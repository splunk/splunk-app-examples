import { perform } from "./setup_page";
import * as React from "react";
import { Component } from "react";
import splunkjs from "splunk-sdk";

const splunk_js_sdk = splunkjs;

class SetupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    await perform(splunk_js_sdk, this.state);
  }

  render() {
    return (
      <div>
        <h2>Weather Setup Page</h2>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Token
              <input
                type="text"
                name="token"
                value={this.state.token}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}
export default SetupPage;
