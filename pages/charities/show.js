import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Charity from "../../ethereum/charity";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

/**
 * show.js:
 * -this file shows information about particular campaign
 *
 * getInitialProps method:
 * -we are trying to show information about particular campaign
 * -the campaigns address will be in the URL
 * -the method is called with seperate props object
 * -the props object has proprty called query and the query contains the address
 * -props.query.address is the address that information we are trying to show in this page
 */

class CharityShow extends Component {
  /**
   * getInitialProps() is asynchronous lifecycle method that populates props
   * 1. use the address from props.query.address and use it to create new campaign instance
   * 2. call getSummary() and assign the returned object to summary variable
   * 3. return an object that contains key-value pairs labeled for later use
   */
  static async getInitialProps(props) {
    const charity = Charity(props.query.address);
    const summary = await charity.methods.getSummary().call();

    /**
     * Rather than passign the summary object that doesn't give much information
     * we'll return an object that describes the key value pairs (it goes to props).
     */
    return {
      address: props.query.address, // add address so we can pass it to contributeForm later on
      minimumContribution: summary[0],
      balance: summary[1],
      milestonesCount: summary[2],
      donorsCount: summary[3],
      milestonesCompleted: summary[4],
      manager: summary[5]
    };
  }

  /**
   * 1. To make use of variables inside renderCards() let's destruct variables from props.
   */
  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      milestonesCount,
      donorsCount,
      milestonesCompleted
    } = this.props;

    /**
     * 2. array of objects containing the information we want to display
     * 3. return <Card.Group> and add in items property and pass in the array of objects
     */
    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "Charity's manager can create milestones to withdraw money",
        style: { overflowWrap: "break-word" } // additional property for styling
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become a donor"
      },
      {
        header: milestonesCompleted + '/' + milestonesCount,
        meta: "Milestones Completed",
        description:
          "Milestones are steps to complete the charity. They must be approved by donors"
      },
      {
        header: donorsCount,
        meta: "Number of Donors",
        description:
          "Number of people who have already donated to this charity"
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

  /**
   * render():
   * -create first <Grid.Row>
   *    -display cards in <Grid.Column> with width=10
   *    -display contributeForm is <Grid.Column> with width=6
   * -second row:
   *    -button to view requests
   * -pass in the address as property so the contributeForm can use it later
   *               <Link route={`/charities/${this.props.address}/feedback`}>
                <a>
                  <Button primary>Give Feedback</Button>
                </a>
              </Link>
   */
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
                  <Button color="green" >View Milestones</Button>
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
