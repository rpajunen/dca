import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Charity from "../../ethereum/charity";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CharityShow extends Component {
  static async getInitialProps(props) {
    const charity = Charity(props.query.address);
    const summary = await charity.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      milestonesCount: summary[2],
      donorsCount: summary[3],
      milestonesCompleted: summary[4],
      manager: summary[5]
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      milestonesCount,
      donorsCount,
      milestonesCompleted
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "Charity's manager can create milestones to withdraw money",
        style: { overflowWrap: "break-word" }
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become a donor"
      },
      {
        header: milestonesCompleted + "/" + milestonesCount,
        meta: "Milestones Completed",
        description:
          "Milestones are steps to complete the charity. They must be approved by donors"
      },
      {
        header: donorsCount,
        meta: "Number of Donors",
        description: "Number of people who have already donated to this charity"
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Charity Balance (ether)",
        description:
          "The balance is how much money this charity has left to spend."
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Charity Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/charities/${this.props.address}/milestones`}>
                <a>
                  <Button color="green">View Milestones</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CharityShow;
