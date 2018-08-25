import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "../routes";

/**
 * Header.js
 * -<Menu> is the header
 * -<Menu.Menu> with property position=right is right side of the header
 * -<Menu style={{ marginTop: "10px" }}>. Can pass in styling e.g. marging
 * -<Menu.Item> is replaced with <Link> tag
 *    -set route property that indicates where user is taken if link is pressed
 *    -link tag wraps its children with clickevent handler
 *    -set property className="item", it restores semantic-ui styling and makes anchor tag look nicer
 */

export default () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Decentralized Charity Application</a>
      </Link>

      <Menu.Menu position="right" />
      <Link route="/">
        <a className="item">Charities</a>
      </Link>
      <Link route="/charities/new">
        <a className="item">
          <Icon name="plus" />
        </a>
      </Link>
    </Menu>
  );
};
