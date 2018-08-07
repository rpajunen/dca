import React from "react";
import { Container } from "semantic-ui-react";
import Head from "next/head";
import Header from "./Header";
/**
 * Layout.js component
 * -all of the page's content that calls layout, will be passed to Layout in props.chidren
 * -{props.chidren} will show that content of the screen
 * -<Container> limits content to a maximum width
 * 
 * Head:
 * -import helper component from Next library called Head
 * -everything wrapped between head tags will be moved to the head tag of the html document
 * -link tag is stored here because it is a location that will always be loaded (Layout.js is part of all pages is this app)
 */

export default props => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};
