import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CharityNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      if (this.state.minimumContribution === "") throw "field is empty";
      if (this.state.minimumContribution <= 0)
        throw "field is less than equal to zero";
      if (isNaN(Number(this.state.minimumContribution)))
        throw "field is not a number";
      if (this.state.minimumContribution % 1 != 0)
        throw "field is a decimal number";
    } catch (error) {
      this.setState({
        loading: false,
        errorMessage: "Invalid minimum contribution (" + error + ")",
        minimumContribution: ""
      });
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCharity(this.state.minimumContribution).send({
        from: accounts[0]
      });

      Router.pushRoute("/");
    } catch (error) {
      if (
        error.message.includes(
          "Returned error: Error: MetaMask Tx Signature: User denied"
        )
      ) {
        this.setState({ errorMessage: "Transaction rejected by user" });
      } else if (error.message.includes('No "from" address')) {
        this.setState({
          errorMessage: "MetaMask log in is required to create new charity"
        });
      } else {
        this.setState({ errorMessage: err.message }); // for production change errorMessage to: 'something went wrong!
      }
    }

    this.setState({ loading: false, minimumContribution: "" });
  };

  render() {
    return (
      <Layout>
        <h3>Create New Charity</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimun Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <Message error header="Error!" content={this.state.errorMessage} />
          </Form.Field>
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CharityNew;
