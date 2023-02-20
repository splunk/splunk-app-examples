import Splunk from './splunk_helpers';
import Setup from './setup_configuration';
import TemplateComponent from './setup_page_example_template';
import splunkjs from 'splunk-sdk';
import jquery from 'jquery';
import React from "react";

const MACROS_CONF = 'macros';
const splunk_js_sdk = splunkjs;

function display_error_output(error_messages) {
    // Hides the element if no messages, shows if any messages exist
    let did_error_messages_occur = error_messages.length > 0;

    let error_output_element = jquery(".setup.container .error.output");

    if (did_error_messages_occur) {
        let new_error_output_string = "";
        new_error_output_string += "<ul>";
        for (let index = 0; index < error_messages.length; index++) {
            new_error_output_string +=
                "<li>" + error_messages[index] + "</li>";
        }
        new_error_output_string += "</ul>";

        error_output_element.html(new_error_output_string);
        error_output_element.stop();
        error_output_element.fadeIn();
    } else {
        error_output_element.stop();
        error_output_element.fadeOut({
            complete: function() {
                error_output_element.html("");
            },
        });
    }
}

function sanitize_string(string_to_sanitize) {
    let sanitized_string = string_to_sanitize.trim();

    return sanitized_string;
}

function validate_setup_options(_setup_options) {
    let error_messages = [];

    // validate here

    return error_messages;
}

function extract_error_messages(error_messages) {
    // A helper function to extract error messages

    // Expects an array of messages
    // [
    //     {
    //         type: the_specific_error_type_found,
    //         text: the_specific_reason_for_the_error,
    //     },
    //     ...
    // ]

    let error_messages_to_display = [];
    for (let index = 0; index < error_messages.length; index++) {
        error_message = error_messages[index];
        error_message_to_display =
            error_message.type + ": " + error_message.text;
        error_messages_to_display.push(error_message_to_display);
    }

    return error_messages_to_display;
}

async function perform_setup(splunk_js_sdk, setup_options) {
    let app_name = "developer_guidance_setup_page";

    let application_name_space = {
        owner: "nobody",
        app: app_name,
        sharing: "app",
    };

    try {
        // Create the Splunk JS SDK Service object

        const splunk_js_sdk_service = Setup.create_splunk_js_sdk_service(
            splunk_js_sdk,
            application_name_space,
        );

        let { stanza, ...properties } = setup_options;

        // Get macros.conf and do stuff to it
        await Splunk.update_configuration_file(
            splunk_js_sdk_service,
            MACROS_CONF,
            stanza,
            properties
        )

        // Completes the setup, by access the app.conf's [install]
        // stanza and then setting the `is_configured` to true
        await Setup.complete_setup(splunk_js_sdk_service);

        // Reloads the splunk app so that splunk is aware of the
        // updates made to the file system
        await Setup.reload_splunk_app(splunk_js_sdk_service, app_name);

        // Redirect to the Splunk App's home page
        Setup.redirect_to_splunk_app_homepage(app_name);
    } catch (error) {
        // This could be better error catching.
        // Usually, error output that is ONLY relevant to the user
        // should be displayed. This will return output that the
        // user does not understand, causing them to be confused.
        let error_messages_to_display = [];
        if (
            error !== null &&
            typeof error === "object" &&
            error.hasOwnProperty("responseText")
        ) {
            let response_object = JSON.parse(error.responseText);
            error_messages_to_display = extract_error_messages(
                response_object.messages,
            );
        } else {
            // Assumed to be string
            error_messages_to_display.push(error);
        }

        display_error_output(error_messages_to_display);
    }
}

class myApp extends React.Component {
    
    async handleClick() {
        // Used to hide the error output, when a setup is retried
        display_error_output([]);

        let macro_setup_options = {
            stanza: null,
            args: null,
            definition: null,
        }

        console.log("Triggering setup");
        let macro_stanza_input_element = jquery("input[name=macro_stanza]");
        let macro_stanza = macro_stanza_input_element.val();
        macro_setup_options.stanza = sanitize_string(macro_stanza);

        let macro_args_input_element = jquery("input[name=macro_args]");
        let macro_args = macro_args_input_element.val();
        macro_setup_options.args = sanitize_string(macro_args);

        let macro_definition_input_element = jquery("input[name=macro_definition]");
        let macro_definition = macro_definition_input_element.val();
        macro_setup_options.definition = sanitize_string(macro_definition);

        let error_messages_to_display = validate_setup_options(
            macro_setup_options
        );

        let did_error_messages_occur = error_messages_to_display.length > 0;
        if (did_error_messages_occur) {
            // Displays the errors that occurred input validation
            display_error_output(error_messages_to_display);
        } else {
            await perform_setup(
                splunk_js_sdk,
                macro_setup_options
            )
        }
    }
    
    render(){
        return (
            <TemplateComponent onClick={this.handleClick}/>
        )
    }
}
export default myApp;