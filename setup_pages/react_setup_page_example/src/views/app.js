import { perform } from "./setup_page";
import React from "react";
import { Component } from "react";
import splunkjs from "splunk-sdk";

const splunk_js_sdk = splunkjs;

class SetupPage extends Component {
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

  async handleSubmit(event) {
    event.preventDefault();

    await perform(splunk_js_sdk, this.state)
  }

  render() {
    return <div>
      <h2>Macro Setup Page</h2>
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Macro Stanza
            <input type="text" name="stanza" value={this.state.stanza} onChange={this.handleChange} />
          </label>
          <label>
            Macro args
            <input type="text" name="args" value={this.state.args} onChange={this.handleChange} />
          </label>
          <label>
            Macro Definition
            <input type="text" name="definition" value={this.state.definition} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>;
  }
}

export default SetupPage;
