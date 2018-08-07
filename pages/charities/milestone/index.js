import React, { Component } from "react";
import { Button, Table, Message, Icon } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Charity from "../../../ethereum/charity";
import MilestoneRow from "../../../components/MilestoneRow";

class MilestoneIndex extends Component {
  state = {
    hideMessage: true
  }

  static async getInitialProps(props) {
    const { address } = props.query;
    const charity = Charity(address);
    const milestoneCount = await charity.methods.getMilestonesCount().call();
    const approversCount = await charity.methods.donorsCount().call();

    const milestones = await Promise.all(
      Array(parseInt(milestoneCount))
        .fill()
        .map((element, index) => {
          return charity.methods.milestones(index).call();
        })
    );

    return { address, milestones, milestoneCount, approversCount };
  }

  myCallback = (dataFromChild) => {
    this.setState({ hideMessage: dataFromChild })
  }

  renderRows() {
    return this.props.milestones.map((milestone, index) => {
      return (
        <MilestoneRow
          callbackFromParent={this.myCallback}
          key={index}
          id={index}
          milestone={milestone}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Milestones</h3>
        <Link route={`/charities/${this.props.address}/milestones/new`}>
          <a>
            <Button floated="right" color="green" style={{ marginBottom: 10 }}>
              Add Milestone
            </Button>
          </a>
        </Link>
        <Link route={`/charities/${this.props.address}/`}>
          <a>
            Back to details
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>

        <Message icon hidden={this.state.hideMessage} >
          <Icon name='circle notched' loading />
            <Message.Content>
              <Message.Header>Just a moment</Message.Header>
                We are processing your transaction.
            </Message.Content>
        </Message>

        <div>Found {this.props.milestoneCount} milestones.</div>
      </Layout>
    );
  }
}

export default MilestoneIndex;
