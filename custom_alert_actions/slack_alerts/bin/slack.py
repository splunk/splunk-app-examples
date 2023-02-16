import json
import re
import sys
import time
import traceback
from copy import deepcopy
from fnmatch import fnmatch
from safe_fmt import safe_format
from six import ensure_binary
from six.moves import urllib

SEVERITY_COLORS = ['#555555','#6DB7C6','#65A637','#F7BC38','#F58F39','#D93F3C']

OK = 0
ERROR_CODE_UNKNOWN = 1
ERROR_CODE_VALIDATION_FAILED = 2
ERROR_CODE_CHANNEL_NOT_FOUND = 3
ERROR_CODE_FORBIDDEN = 4
ERROR_CODE_HTTP_FAIL = 5
ERROR_CODE_UNEXPECTED = 6

def log(msg, *args):
    sys.stderr.write(msg + " ".join([str(a) for a in args]) + "\n")

def build_fields_attachment(payload):
    res = payload.get('result', dict())
    available_fields = list(res.keys())
    field_attachments = []
    seen_fields = set()
    field_list = re.split(r'\s*,\s*', payload['configuration'].get('fields', '').strip())
    for f in field_list:
        for af in available_fields:
            if af not in seen_fields and fnmatch(af, f):
                seen_fields.add(af)
                val = res[af]
                if isinstance(val, list):
                    val = val[0]
                field_attachments.append(dict(title=af, value=val, short=True))
    return field_attachments

def format_template(template_key, payload, fallback=''):
    config = payload['configuration']
    template = config.get(template_key)
    if template is not None:
        fallback = template
        try:
            args = deepcopy(payload)
            args['configuration']['webhook_url'] = '****'
            args['configuration']['webhook_url_override'] = '****'
            return safe_format(template, args)
        except:
            log("WARN Failed to format template %s \"%s\" -" % (template_key, template), sys.exc_info()[1])
    return fallback

def build_alert_attachment(payload):
    config = payload['configuration']
    attachment = dict()
    if 'info_severity' in config:
        try:
            attachment['color'] = SEVERITY_COLORS[int(config['info_severity'])]
        except: pass
    attachment['fallback'] = format_template('attachment_fallback', payload)
    attachment_title_key = 'attachment_alert_title' if payload.get('search_name') else 'attachment_adhoc_title'
    attachment['title'] = format_template(attachment_title_key, payload, 'Alert')
    if config.get('attachment', 'none') == 'message':
        attachment['text'] = format_template('message', payload)
    else:
        attachment['text'] = format_template('attachment_results_link', payload)
    attachment['title_link'] = config.get('view_link')
    attachment['footer'] = format_template('attachment_footer_text', payload)
    attachment['footer_icon'] = 'https://s3-us-west-1.amazonaws.com/ziegfried-apps/slack-alerts/splunk-icon.png'
    try:
        attachment['ts'] = int(float(config.get('info_trigger_time')))
    except: pass
    if config.get('fields'):
        attachment['fields'] = build_fields_attachment(payload)
    return attachment

def build_slack_message(payload):
    config = payload.get('configuration')
    params = dict()

    if config['attachment'] != 'message':
        params['text'] = format_template('message', payload)
    params['username'] = config.get('from_user', 'Splunk')
    params['icon_url'] = config.get('from_user_icon')

    channel = config.get('channel')
    if channel:
        params['channel'] = channel
    else:
        log("WARN No channel supplied, using default for webhook")

    if config.get('attachment', 'none') != 'none':
        params['attachments'] = [build_alert_attachment(payload)]
    elif config.get('fields'):
        params['attachments'] = [dict(fields=build_fields_attachment(payload))]
    return params

def send_slack_message(payload):
    try:
        req = {}
        config = payload.get('configuration')
        body = json.dumps(build_slack_message(payload))

        # Since Slack webhook URLs are deprecated, we will bias towards using Slack Apps, if they are provided
        is_using_slack_app = (("slack_app_oauth_token" in config and config["slack_app_oauth_token"]) or ("slack_app_oauth_token_override" in config and config["slack_app_oauth_token_override"]))
        if is_using_slack_app:
            token = config.get("slack_app_oauth_token", "")
            if config.get("slack_app_oauth_token_override"):
                token = config.get("slack_app_oauth_token_override")
                log("INFO Using Slack App OAuth token from slack_app_oauth_token_override: %s" % token)
            else:
                log("INFO Using configured Slack App OAuth token: %s" % token)

            log('DEBUG Calling url="https://slack.com/api/chat.postMessage" with token=%s and body=%s' % (token, body))
            req = urllib.request.Request("https://slack.com/api/chat.postMessage", ensure_binary(body), {"Content-Type": "application/json", 'Authorization': "Bearer %s" % token})

        # To preserve backwards compatibility, we will fallback to the webhook_url configuration, if a Slack App OAuth token is not provided
        else:
            url = config.get('webhook_url', '')
            if config.get('webhook_url_override'):
                url = config.get('webhook_url_override', '')
                log("INFO Using webhook URL from webhook_url_override: %s" % url)
            elif not url:
                log("FATAL No webhook URL configured and no override specified")
                return ERROR_CODE_VALIDATION_FAILED
            else:
                log("INFO Using configured webhook URL: %s" % url)

            if not url.startswith('https:'):
                log("FATAL Invalid webhook URL specified. The URL must use HTTPS.")
                return ERROR_CODE_VALIDATION_FAILED

            log('DEBUG Calling url="%s" with body=%s' % (url, body))
            req = urllib.request.Request(url, ensure_binary(body), {"Content-Type": "application/json"})

        try:
            res = urllib.request.urlopen(req)
            res_body = str(res.read())
            log("INFO Slack API responded with HTTP status=%d" % res.code)
            log("DEBUG Slack API response: %s" % res_body)
            if 200 <= res.code < 300:
                if "invalid_auth" in res_body:
                    log("FATAL The Slack App OAuth token provided is invalid or does not have the permission to post messages to the channel provided.")
                    return ERROR_CODE_FORBIDDEN
                if "channel_not_found" in res_body or "channel_is_archived" in res_body:
                    log("FATAL The channel provided was not found or is archived. If the channel is private, please make sure the Slack App is added to the channel.")
                    return ERROR_CODE_CHANNEL_NOT_FOUND
                if "error" in res_body:
                    return ERROR_CODE_UNKNOWN
                return OK
        except urllib.error.HTTPError as e:
            log("ERROR HTTP request to Slack API failed: %s" % e)
            try:
                res = e.read()
                log("ERROR Slack error response: %s" % res)
                if res in ('channel_not_found', 'channel_is_archived'):
                    return ERROR_CODE_CHANNEL_NOT_FOUND
                if res == 'action_prohibited':
                    return ERROR_CODE_FORBIDDEN
            except:
                pass
            return ERROR_CODE_HTTP_FAIL
    except:
        log("FATAL Unexpected error:", sys.exc_info()[0])
        track = traceback.format_exc()
        log(track)
        return ERROR_CODE_UNEXPECTED

def validate_payload(payload):
    if not 'configuration' in payload:
        log("FATAL Invalid payload, missing 'configuration'")
        return False
    config = payload.get('configuration')
    channel = config.get('channel')

    if channel and (channel[0] != '#' and channel[0] != '@'):
        # Only warn here for now
        log("WARN Validation warning: Parameter `channel` \"%s\" should start with # or @" % channel)

    msg = config.get('message')
    if not msg:
        log("FATAL Validation error: Parameter `message` is missing or empty")
        return False

    att = config.get('attachment')
    if att and att not in ('alert_link', 'message'):
        log("WARN Validation warning: Parameter `attachment` must be ether \"alert_link\" or \"message\"")

    return True

if __name__ == '__main__':
    log("INFO Running python %s" % (sys.version_info[0]))
    if len(sys.argv) > 1 and sys.argv[1] == "--execute":
        payload = json.loads(sys.stdin.read())
        if not validate_payload(payload):
            sys.exit(ERROR_CODE_VALIDATION_FAILED)
        result = send_slack_message(payload)
        if result == OK:
            log("INFO Successfully sent slack message")
        else:
            log("FATAL Alert action failed")
        sys.exit(result)
