import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Charity from '../ethereum/charity';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

/**
 * DonationForm:
 * Is a components that can be rendered to a page so users can send money to specific contract.
 */

class DonationForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    const charity = Charity(this.props.address);

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await charity.methods.donate().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      Router.replaceRoute(`/charities/${this.props.address}`); // refresh the page to get the updated content to show up
    } catch (err) {
      if(err.message.includes('while converting')) {
        this.setState({ errorMessage: 'Please enter valid number' })
      } else if (err.message.includes('Returned error: Error: MetaMask Tx Signature: User denied ')) {
        this.setState({ errorMessage: 'Transaction rejected by user' })
      } else if (err.message.includes('Returned error: Error: Invalid transaction value')) {
        this.setState({ errorMessage: 'Please enter valid number' })
      } else if (err.message.includes('No "from" address')) {
        this.setState({ errorMessage: 'MetaMask log in is required to make donations' })
      } else {
        this.setState({ errorMessage: err.message });
      }
      
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Donate to this Charity</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
            placeholder="Amount in Ether"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Donate!
        </Button>
      </Form>
    );
  }
}

export default DonationForm;