"use strict";

import * as Splunk from './splunk_helpers.js'
import * as Setup from './setup_configuration.js'
import get_template from './setup_page_example_template.js'

const MACROS_CONF = 'macros'

define(
    ["backbone", "jquery", "splunkjs/splunk"],
    function(Backbone, jquery, splunk_js_sdk) {
        var ExampleView = Backbone.View.extend({
            // -----------------------------------------------------------------
            // Backbon Functions, These are specific to the Backbone library
            // -----------------------------------------------------------------
            initialize: function initialize() {
                Backbone.View.prototype.initialize.apply(this, arguments);
            },

            events: {
                "click .setup_button": "trigger_setup",
            },

            render: function() {
                this.el.innerHTML = get_template();

                return this;
            },

            // -----------------------------------------------------------------
            // Custom Functions, These are unrelated to the Backbone functions
            // -----------------------------------------------------------------
            // ----------------------------------
            // Main Setup Logic
            // ----------------------------------
            // This performs some sanity checking and cleanup on the inputs that
            // the user has provided before kicking off main setup process
            trigger_setup: function trigger_setup() {
                // Used to hide the error output, when a setup is retried
                this.display_error_output([]);

                var macro_setup_options = {
                    stanza: null,
                    args: null,
                    definition: null,
                }

                console.log("Triggering setup");
                var macro_stanza_input_element = jquery("input[name=macro_stanza]");
                var macro_stanza = macro_stanza_input_element.val();
                macro_setup_options.stanza = this.sanitize_string(macro_stanza);

                var macro_args_input_element = jquery("input[name=macro_args]");
                var macro_args = macro_args_input_element.val();
                macro_setup_options.args = this.sanitize_string(macro_args);

                var macro_definition_input_element = jquery("input[name=macro_definition]");
                var macro_definition = macro_definition_input_element.val();
                macro_setup_options.definition = this.sanitize_string(macro_definition);

                var error_messages_to_display = this.validate_setup_options(
                    macro_setup_options
                );

                var did_error_messages_occur = error_messages_to_display.length > 0;
                if (did_error_messages_occur) {
                    // Displays the errors that occurred input validation
                    this.display_error_output(error_messages_to_display);
                } else {
                    this.perform_setup(
                        splunk_js_sdk,
                        macro_setup_options
                    )
                }
            },

            // This is where the main setup process occurs
            perform_setup: async function perform_setup(splunk_js_sdk, setup_options) {
                var app_name = "developer_guidance_setup_page";

                var application_name_space = {
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
                    // await Setup.complete_setup(splunk_js_sdk_service);

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
                    var error_messages_to_display = [];
                    if (
                        error !== null &&
                        typeof error === "object" &&
                        error.hasOwnProperty("responseText")
                    ) {
                        var response_object = JSON.parse(error.responseText);
                        error_messages_to_display = this.extract_error_messages(
                            response_object.messages,
                        );
                    } else {
                        // Assumed to be string
                        error_messages_to_display.push(error);
                    }

                    this.display_error_output(error_messages_to_display);
                }
            },

            // ----------------------------------
            // Input Cleaning and Checking
            // ----------------------------------
            sanitize_string: function sanitize_string(string_to_sanitize) {
                var sanitized_string = string_to_sanitize.trim();

                return sanitized_string;
            },

            validate_setup_options: function validate_setup_options(_setup_options) {
                var error_messages = [];

                // validate here

                return error_messages;
            },

            // ----------------------------------
            // GUI Helpers
            // ----------------------------------
            extract_error_messages: function extract_error_messages(error_messages) {
                // A helper function to extract error messages

                // Expects an array of messages
                // [
                //     {
                //         type: the_specific_error_type_found,
                //         text: the_specific_reason_for_the_error,
                //     },
                //     ...
                // ]

                var error_messages_to_display = [];
                for (var index = 0; index < error_messages.length; index++) {
                    error_message = error_messages[index];
                    error_message_to_display =
                        error_message.type + ": " + error_message.text;
                    error_messages_to_display.push(error_message_to_display);
                }

                return error_messages_to_display;
            },

            // ----------------------------------
            // Display Functions
            // ----------------------------------
            display_error_output: function display_error_output(error_messages) {
                // Hides the element if no messages, shows if any messages exist
                var did_error_messages_occur = error_messages.length > 0;

                var error_output_element = jquery(".setup.container .error.output");

                if (did_error_messages_occur) {
                    var new_error_output_string = "";
                    new_error_output_string += "<ul>";
                    for (var index = 0; index < error_messages.length; index++) {
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
            },
        }); // End of ExampleView class declaration

        return ExampleView;
    }, // End of require asynchronous module definition function
); // End of require statement
