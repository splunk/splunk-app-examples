function get_template() {
  const template_string =
      "<div class='title'>" +
      "    <h1>Welcome to Your Setup Page!</h1>" +
      "</div>" +
      "<div class='setup container'>" +
      "    <div class='left'>" +
      "        <h2>Overview</h2>" +
      "        This setup view will create/modify two files in the local directory of this Splunk App." +
      "        <br/>" +
      "        <br/>" +
      "        Splunk App Directory Path: `$SPLUNK_HOME/etc/apps/developer_guidance_setup_view/local/`" +
      "        <ul>" +
      "            <li>app.conf" +
      "                <ul>" +
      "                    <li>Sets the [install] stanza's `is_configured` property to `true`</li>" +
      "                </ul>" +
      "            </li>" +
      "            <li>macros.conf" +
      "                <ul>" +
      "                    <li>Creates a custom conf file to manage Splunk App specific settings</li>" +
      "                    <li>Creates the stanza</li>" +
      "                    <li>Creates the properties args and definition in the stanza and assigns values to it" +
      "                </ul>" +
      "            </li>" +
      "        </ul>" +
      "        <h2>Setup Properties</h2>" +
      "        <div>" +
      "            https://docs.splunk.com/Documentation/Splunk/latest/Admin/Macrosconf" +
      "        </div>" +
      "        <div class='field macro_stanza'>" +
      "            <div class='title'>" +
      "                <div>" +
      "                    <h3>Macro Stanza:</h3>" +
      "                </div>" +
      "            </div>" +
      "            </br>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <input type='text' name='macro_stanza' placeholder='foobar(2)'></input>" +
      "                </div>" +
      "            </div>" +
      "        </div>" +
      "        <div class='field macro_args'>" +
      "            <div class='title'>" +
      "                <h3>Macro Args:</h3>" +
      "            </div>" +
      "            </br>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <input type='text' name='macro_args' placeholder='foo, bar'></input>" +
      "                </div>" +
      "            </div>" +
      "        </div>" +
      "        <div class='field macro_definition'>" +
      "            <div class='title'>" +
      "                <h3>Macro Definition:</h3>" +
      "                Please specify the API Key that will be used to authenticate to the API." +
      "            </div>" +
      "            </br>" +
      "            <div class='user_input'>" +
      "                <div class='text'>" +
      "                    <input type='text' name='macro_definition' placeholder='&quot;foo = $foo$, bar = $bar$&quot;'></input>" +
      "                </div>" +
      "            </div>" +
      "        </div>" +
      "        <h2>Complete the Setup</h2>" +
      "        <div>" +
      "            Please press the 'Perform Setup` button below to complete the Splunk App setup." +
      "        </div>" +
      "        <br/>" +
      "        <div>" +
      "            <button name='setup_button' class='setup_button'>" +
      "                Perform Setup" +
      "            </button>" +
      "        </div>" +
      "        <br/>" +
      "        <div class='error output'>" +
      "        </div>" +
      "    </div>" +
      "    <div class='right'>" +
      "        <h2>Implementation Details</h2>" +
      "        <div class='description'>" +
      "            <h3>Overview</h3>" +
      "            This is a setup view that is intended to serve as a point of reference for Splunk Developers." +
      "            </br>" +
      "            This has been created using Application Certification approved best practices." +
      "            <br/>" +
      "            <h3>Splunk Techniques Used</h3>" +
      "            <ul>" +
      "                <li>Splunk Dashboards" +
      "                    <ul>" +
      "                        <li><a href='http://docs.splunk.com/Documentation/SplunkCloud/latest/Viz/PanelreferenceforSimplifiedXML'>API Documentation</a>  (docs.splunk.com)" +
      "                    </ul>" +
      "                </li>" +
      "                <li>Splunk Setup View" +
      "                    <ul>" +
      "                        <li><a href='http://docs.splunk.com/Documentation/Splunk/6.6.3/admin/Appconf#.5Bui.5D'>app.conf Specification</a>" +
      "                    </ul>" +
      "                </li>" +
      "                <li>Splunk Web Framework" +
      "                    <ul>" +
      "                        <li><a href='http://docs.splunk.com/Documentation/WebFramework'>API Documentation</a> (docs.splunk.com)" +
      "                        <li><a href='http://dev.splunk.com/webframework'>Main Website</a> (dev.splunk.com)" +
      "                    </ul>" +
      "                </li>" +
      "            </ul>" +
      "            <h3>Technology Used</h3>" +
      "            <ul>" +
      "                <li>CSS</li>" +
      "                <li>HTML</li>" +
      "                <li>JavaScript" +
      "                    <ul>" +
      "                        <li>Backbone JS" +
      "                            <ul>" +
      "                                <li><a href='http://backbonejs.org/'>Main Website</a></li>" +
      "                                <li><a href='https://github.com/jashkenas/backbone/'>On GitHub</a></li>" +
      "                                <li><a href='http://backbonejs.org/#View'>Views</a> are the only feature used</li>" +
      "                            </ul>" +
      "                        </li>" +
      "                        <li>JQuery" +
      "                            <ul>" +
      "                                <li><a href='http://jquery.com/'>Main Website</a>" +
      "                                    <li><a href='https://github.com/jquery/jquery/'>On GitHub</a>" +
      "                            </ul>" +
      "                            </li>" +
      "                            <li>Splunk JavaScript Software Development Kit" +
      "                                <ul>" +
      "                                    <li><a href='http://docs.splunk.com/Documentation/JavaScriptSDK'>API Documentation</a> (docs.splunk.com)</li>" +
      "                                    <li><a href='https://github.com/splunk/splunk-sdk-javascript'>On GitHub</a></li>" +
      "                                    <li><a href='http://dev.splunk.com/javascript'>Main Website</a> (dev.splunk.com)</li>" +
      "                                </ul>" +
      "                            </li>" +
      "                    </ul>" +
      "                    </li>" +
      "            </ul>" +
      "            <br/>" +
      "        </div>" +
      "    </div>" +
      "</div>";

  return template_string;
}

export default get_template;
