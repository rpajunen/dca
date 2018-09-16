import React, { Component } from "react";
import { Card, Button, Grid } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CharityIndex extends Component {
  state = {
    names: []
  };

  static async getInitialProps() {
    const charities = await factory.methods.getDeployedCharities().call();

    return { charities };
  }

  renderCharities() {
    const items = this.props.charities.map(address => {
      return {
        raised: true,
        centered: false,
        header: address,
        meta: "Charity address",
        description: (
          <div>
            <Grid columns={2} style={{ marginTop: "10px" }}>
              <Grid.Row>
                <Grid.Column>
                  <Button fluid basic color="green">
                    <Link route={`/charities/${address}/milestones`}>
                      <a>Milestones</a>
                    </Link>
                  </Button>
                </Grid.Column>
                <Grid.Column>
                  <Button fluid basic color="blue">
                    <Link route={`/charities/${address}`}>
                      <a>Donate</a>
                    </Link>
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ),
        fluid: false,
        style: { overflowWrap: "break-word" }
      };
    });

    items.reverse();

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>All Charities</h3>
          <Link route="/charities/new">
            <a>
              <Button
                primary
                floated="right"
                content="Create Charity"
                icon="add"
              />
            </a>
          </Link>
          {this.renderCharities()}
        </div>
      </Layout>
    );
  }
}

export default CharityIndex;
