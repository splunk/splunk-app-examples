
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
        e("h2", null,  "This app requires you to configure the weather-app-example version 1.0 or above in order to complete the setup process. If this dependency requirement is satisfied, then app setup completes and you are directed to the app home page. If this dependency requirement is not satisfied, then you are prompted to configure or upgrade the weather-app-example."),
        e("div", null, [
          e("form", { onSubmit: this.handleSubmit }, [
            e("input", { type: "submit", value: "Check dependencies and complete setup." })
          ])
        ])
      ]);
    }
  }

  return e(SetupPage);
});
