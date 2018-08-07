import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Charity from "../ethereum/charity";
import { Router } from "../routes";

class MilestoneRow extends Component {
  onApprove = async () => {
    const charity = Charity(this.props.address);

    this.props.callbackFromParent(false);

    try {
      const accounts = await web3.eth.getAccounts();
      await charity.methods.approveMilestone(this.props.id).send({
        from: accounts[0]
      });
    } catch (error) {
      this.props.callbackFromParent(true);
    }

    this.props.callbackFromParent(true);

    Router.replaceRoute(`/charities/${this.props.address}/milestones`);
  };

  onFinalize = async () => {
    const charity = Charity(this.props.address);

    this.props.callbackFromParent(false);

    try {
      const accounts = await web3.eth.getAccounts();
      await charity.methods.finalizeMilestone(this.props.id).send({
        from: accounts[0]
      });
    } catch (error) {
      this.props.callbackFromParent(true);
    }

    this.props.callbackFromParent(true);

    Router.replaceRoute(`/charities/${this.props.address}/milestones`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, milestone, approversCount } = this.props;
    const readyToFinalize = milestone.approvalCount > approversCount / 2;

    return (
      <Row
        disabled={milestone.complete}
        positive={readyToFinalize && !milestone.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{milestone.description}</Cell>
        <Cell>{web3.utils.fromWei(milestone.value, "ether")}</Cell>
        <Cell>{milestone.recipient}</Cell>
        <Cell>
          {milestone.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {milestone.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {milestone.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default MilestoneRow;
