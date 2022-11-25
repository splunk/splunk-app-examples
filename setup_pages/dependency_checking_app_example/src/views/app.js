import { perform } from "./setup_page";
import React from "react";
import { Component } from "react";
import splunkjs from "splunk-sdk";

let splunk_js_sdk = splunkjs;


class SetupPage extends Component {
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
    await perform(splunk_js_sdk, this.state)
  }

  render() {
    return (
    <div>
      <h2>This app requires you to configure the weather-app-example version 1.0 or above in order to complete the setup process. If this dependency requirement is satisfied, then app setup completes and you are directed to the app home page. If this dependency requirement is not satisfied, then you are prompted to configure or upgrade the weather-app-example.</h2>
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Check dependencies and complete setup." />
        </form>
      </div>
    </div>
    );
  }
}

export default SetupPage;
