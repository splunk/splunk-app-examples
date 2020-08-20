import os, sys
import requests
from urllib.parse import urljoin, urlencode

# Library-loading boilerplate
APP_NAME = 'weather_app_example'
splunkhome = os.environ['SPLUNK_HOME']
apphome = os.path.join(splunkhome, 'etc', 'apps', APP_NAME)
sys.path.append(os.path.join(apphome, 'vendor'))

# Enterprise SDK imports
import splunklib.client as client
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators

WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/'
TOKEN_CONF = 'weather'
TOKEN_STANZA = 'api'

SECRET_REALM = 'weather_app_example_realm'
SECRET_NAME = 'admin'

def build_weather_api_url(path, query, token):
    return urljoin(WEATHER_API_URL, path + "?" + urlencode(dict(q=query, appid=token)))

def get_weather_api_token(search_command):
    confs = search_command.service.confs

    return confs[TOKEN_CONF][TOKEN_STANZA].token

def get_encrypted_weather_api_token(search_command):
    secrets = search_command.service.storage_passwords

    return next(secret for secret in secrets if (secret.realm == SECRET_REALM and secret.username == SECRET_NAME)).clear_password

@Configuration()
class WeatherSearch(GeneratingCommand):
    def generate(self):
        # TODO: Never ever do this! Take the token out of configuration instead.
        # token = 'DUMMY_TOKEN'

        token = get_encrypted_weather_api_token(self)

        # call out to the weather API
        url = build_weather_api_url('forecast', 'seattle', token)

        # make request
        response = requests.get(url)

        del token, url

        # DEBUG:
        # yield {
        #     '_raw': url
        # }

        # for each in [list]: _time = dt, _raw = event
        for result in response.json()['list']:
            yield {
                '_raw': result,
                '_time': result['dt']
            }

dispatch(WeatherSearch, sys.argv, sys.stdin, sys.stdout, __name__)
