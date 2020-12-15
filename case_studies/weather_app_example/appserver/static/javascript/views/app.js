
/**
 * This is an example using pure react, with no JSX
 * If you would like to use JSX, you will need to use Babel to transpile your code
 * from JSK to JS. You will also need to use a task runner/module bundler to
 * help build your app before it can be used in the browser.
 * Some task runners/module bundlers are : gulp, grunt, webpack, and Parcel
 */

import * as Setup from "./setup_page.js";

define(["react", "splunkjs/splunk"], function(react, splunk_js_sdk){
  const e = react.createElement;

  var app_name = "weather_app_example";

  var application_name_space = {
    owner: "nobody",
    app: app_name,
    sharing: "app",
  };

  var http = new splunk_js_sdk.SplunkWebHttp();
  var options = {id: "id_" + ((new Date()).valueOf())};

  var splunk_js_sdk_service = new splunk_js_sdk.Service(
    http,
    application_name_space,
  );
  console.log("splunk_js_sdk_service: ");
  console.log(splunk_js_sdk_service);

  var jobs = splunk_js_sdk_service.jobs({app: 'weather_app_example'});
  var req = jobs.oneshotSearch('search index=_internal | head 1', options, function(err, job) {
    if (err) {
      console.warn("oneshotSeach failed");
      console.warn(err);
      return;
    }
    console.log("oneshotSeach succeeded");
    console.log(job);
  });

  class SetupPage extends react.Component {
    constructor(props) {
      super(props);

      this.state = {
        token: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({ ...this.state, [event.target.name]: event.target.value})
    }

    async handleSubmit(event) {
      event.preventDefault();

      await Setup.perform(splunk_js_sdk, this.state)
    }

    render() {
      return e("div", null, [
        e("h2", null, "Weather Setup Page"),
        e("div", null, [
          e("form", { onSubmit: this.handleSubmit }, [
            e("label", null, [
              "Token",
              e("input", { type: "text", name: "token", value: this.state.token, onChange: this.handleChange })
            ]),
            e("input", { type: "submit", value: "Submit" })
          ])
        ])
      ]);
    }
  }

  return e(SetupPage);
});
