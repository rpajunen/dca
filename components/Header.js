import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "../routes";

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
