
/**
 * This is an example using pure react, with no JSX
 * If you would like to use JSX, you will need to use Babel to transpile your code
 * from JSK to JS. You will also need to use a task runner/module bundler to
 * help build your app before it can be used in the browser.
 * Some task runners/module bundlers are : gulp, grunt, webpack, and Parcel
 */

import * as Setup from "./setup_view.js";

define(["react", "splunkjs/splunk"], function(react, splunk_js_sdk){
  const e = react.createElement;

  class SetupView extends react.Component {
    constructor(props) {
      super(props);

      this.state = {
        stanza: '',
        args: '',
        definition: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({ ...this.state, [event.target.name]: event.target.value})
    }

    handleSubmit(event) {
      await Setup.perform(splunk_js_sdk, this.state)

      event.preventDefault();
    }

    render() {
      return e("div", null, [
        e("h2", null, "Macro Setup View"),
        e("div", null, [
          e("form", { onSubmit: this.handleSubmit }, [
            e("label", null, [
              "Macro Stanza",
              e("input", { type: "text", name: "stanza", value: this.state.stanza, onChange: this.handleChange })
            ]),
            e("label", null, [
              "Macro Args",
              e("input", { type: "text", name: "args", value: this.state.args, onChange: this.handleChange })
            ]),
            e("label", null, [
              "Macro Definition",
              e("input", { type: "text", name: "definition", value: this.state.definition, onChange: this.handleChange })
            ]),
            e("input", { type: "submit", value: "Submit" })
          ])
        ])
      ]);
    }
  }

  return e(SetupView);
});
