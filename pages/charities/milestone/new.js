import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Charity from '../../../ethereum/charity';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class MilestoneNew extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();

    const charity = Charity(this.props.address);
    const { description, value, recipient } = this.state;
    
    try {
      if (description === '') throw 'description field is empty';
      if (value === '') throw 'value field is empty';
      if (isNaN(Number(value))) throw "value field is not a number";
      if (value <= 0) throw 'value is less than equal to zero';
      if (recipient === '') throw 'Recipient address is invalid';

    } catch (error) {
      this.setState({ loading: false, errorMessage: 'Invalid input (' + error + ')' })
      return;
    }

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await charity.methods
        .createMilestone(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/charities/${this.props.address}/milestones`);
    } catch (error) {
      if(error.message.includes('Returned error: Error: MetaMask Tx Signature: User denied')) {
        this.setState({ errorMessage: 'Transaction rejected by user' })
      } else if (error.message.includes('Provided address')){
        this.setState({ errorMessage: 'Recipient address is invalid' })
      } else if (error.message.includes('No "from" address')) {
        this.setState({ errorMessage: 'MetaMask log in is required to create milestones' })
      } else {
        this.setState({ errorMessage: error.message }); // for production change errorMessage to: 'something went wrong!
      }
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/charities/${this.props.address}/milestones`}>
          <a>Back</a>
        </Link>
        <h3>Create a Milestone</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })}
            />
          </Form.Field>

          <Message error header="Error!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default MilestoneNew;