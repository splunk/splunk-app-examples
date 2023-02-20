import React from "react";

class TemplateComponent extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <>
        <div className='title'>
          <h1>Welcome to Your Setup Page!</h1>
        </div>
        <div className='setup container'>
          <div className='left'>
            <h2>Overview</h2>
            This setup page will create/modify two files in the local directory of this Splunk App.
            <br />
            <br />
            Splunk App Directory Path: `$SPLUNK_HOME/etc/apps/developer_guidance_setup_page/local/`
            <ul>
              <li>app.conf
                <ul>
                  <li>Sets the [install] stanza's `is_configured` property to `true`</li>
                </ul>
              </li>
              <li>macros.conf
                <ul>
                  <li>Creates a custom conf file to manage Splunk App specific settings</li>
                  <li>Creates the stanza</li>
                  <li>Creates the properties args and definition in the stanza and assigns values to it</li>
                </ul>
              </li>
            </ul>
            <h2>Setup Properties</h2>
            <div>
              https://docs.splunk.com/Documentation/Splunk/latest/Admin/Macrosconf
            </div>
            <div className='field macro_stanza'>
              <div className='title'>
                <div>
                  <h3>Macro Stanza:</h3>
                </div>
              </div>
              <br />
              <div className='user_input'>
                <div className='text'>
                  <input type='text' name='macro_stanza' placeholder='foobar(2)' />
                </div>
              </div>
            </div>
            <div className='field macro_args'>
              <div className='title'>
                <h3>Macro Args:</h3>
              </div>
              <br />
              <div className='user_input'>
                <div className='text'>
                  <input type='text' name='macro_args' placeholder='foo, bar' />
                </div>
              </div>
            </div>
            <div className='field macro_definition'>
              <div className='title'>
                <h3>Macro Definition:</h3>
                Please specify the API Key that will be used to authenticate to the API.
              </div>
              <br />
              <div className='user_input'>
                <div className='text'>
                  <input type='text' name='macro_definition' placeholder='&quot;foo = $foo$, bar = $bar$&quot;' />
                </div>
              </div>
            </div>
            <h2>Complete the Setup</h2>
            <div>
              Please press the 'Perform Setup` button below to complete the Splunk App setup.
            </div>
            <br />
            <div>
              <button name='setup_button' className='setup_button' onClick={this.props.onClick}>
                Perform Setup
              </button>
            </div>
            <br />
            <div className='error output'>
            </div>
          </div>
          <div className='right'>
            <h2>Implementation Details</h2>
            <div className='description'>
              <h3>Overview</h3>
              This is a setup page that is intended to serve as a point of reference for Splunk Developers.
              <br />
              This has been created using Application Certification approved best practices.
              <br />
              <h3>Splunk Techniques Used</h3>
              <ul>
                <li>Splunk Dashboards
                  <ul>
                    <li><a href='http://docs.splunk.com/Documentation/SplunkCloud/latest/Viz/PanelreferenceforSimplifiedXML'>API Documentation</a> (docs.splunk.com) </li>
                  </ul>
                </li>
                <li>Splunk Setup Page
                  <ul>
                    <li><a href='http://docs.splunk.com/Documentation/Splunk/6.6.3/admin/Appconf#.5Bui.5D'>app.conf Specification</a></li>
                  </ul>
                </li>
                <li>Splunk Web Framework
                  <ul>
                    <li><a href='http://docs.splunk.com/Documentation/WebFramework'>API Documentation</a> (docs.splunk.com)</li>
                    <li><a href='http://dev.splunk.com/webframework'>Main Website</a> (dev.splunk.com)</li>
                  </ul>
                </li>
              </ul>
              <h3>Technology Used</h3>
              <ul>
                <li>CSS</li>
                <li>HTML</li>
                <li>JavaScript
                  <ul>
                    <li>React.js
                      <ul>
                        <li><a href='https://reactjs.org/'>Main Website</a></li>
                        <li><a href='https://github.com/facebook/react'>On GitHub</a></li>
                      </ul>
                    </li>
                    <li>JQuery
                      <ul>
                        <li><a href='http://jquery.com/'>Main Website</a></li>
                        <li><a href='https://github.com/jquery/jquery/'>On GitHub</a></li>
                      </ul>
                    </li>
                    <li>Splunk JavaScript Software Development Kit
                      <ul>
                        <li><a href='http://docs.splunk.com/Documentation/JavaScriptSDK'>API Documentation</a> (docs.splunk.com)</li>
                        <li><a href='https://github.com/splunk/splunk-sdk-javascript'>On GitHub</a></li>
                        <li><a href='http://dev.splunk.com/javascript'>Main Website</a> (dev.splunk.com)</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
              <br />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default TemplateComponent;
