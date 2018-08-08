import React, { Component } from "react";
import { Card, Button, Grid } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CharityIndex extends Component {
  state = {
    names: []
  };
  /**
   * getInitialProps() is a lifecycle method with Next.js so that dataloading(fetching) can happen on the server
   * when next.js does serverside redering, this method is ececuted before anything else
   */
  static async getInitialProps() {
    const charities = await factory.methods.getDeployedCharities().call();

    /**
     *
       const names = charities.map((address) => {
      const charity = Charity(address)
      const name = charity.methods.name().call()
      return name;
    });

     */

    return { charities };
  }

  /*
  async getNames() {
    const names = this.props.charities.map(address => {
      const charity = Charity(address);
      const name = charity.methods.name().call();
      return name;
    });

    this.setState({ names });

    return names;
  }
*/


  /**
   * renderCharities()
   * -iterate the list of campaign addresses
   * -for each address create an object (card)
   * -map() = pass in a function. that function will be called on each element in the list
   * -sign the array of objects(cards) to items variable
   * -finally return Card.Group-object and assign items-object to its items-property
   * -description field: wrap anchor tag with link tag and set property route
   *    -to dynamically compute the route use ES6 template string (route={`/campaigns/${address}`})
   *
   */
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
  
  /**
   * render()
   * -we must use <Layout>, because it displays the header, styling, etc on the screen
   */
  render() {
    return (
      <Layout>
        <div>
          <h3>Open Charities</h3>
          <Link route="/charities/new">
            <a>
              <Button
                primary
                floated="right"
                content="Create Charity"
                icon="add"
                //color="teal"
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
