import React, { Component } from 'react';
import { Panel, Button } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import TopNavbar from './TopNavbar.js';
import TopNavbarBackend from './TopNavbarBackend';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      posts: [],
      errors: [],
      admins: ["Laura.Trethewey@ocean.org", "Ethan.Dinnen@ocean.org"],
      user: {},
      hasSubmitted: false,
      loggedIn: true,
      isAdmin: this.props.routes[0].isAdmin,
      authorization: '',
      showGuidelines: false
    };
  }

  render() {
    const { windowWidth, isAdmin, loggedIn } = this.state;
    let width;
    if (windowWidth < Style.xsCutoff) {
      width = '100%';
    } else if (windowWidth < Style.smCutoff) {
      width = '723px';
    } else if (windowWidth < Style.mdCutoff) {
      width = '933px';
    } else {
      width = '1127px';
    }

    const panelStyle = {
      width,
      margin: 'auto',
      marginTop: '65px',
      textAlign: 'center',
    };

    const internalStyle = {
      main: {
        display: "inline-flex",
        flexDirection: "row",
	textAlign: "center",
      },
      button: {
        margin: 10,
      },
    };

    var internalNav = (
      <div style={internalStyle.main}>
        <Button href="/suggestor" style={internalStyle.button}>Submit a blog post</Button>
        <Button href="/idea" style={internalStyle.button}>Submit an idea for a blog post</Button>
        <Button href="/reserve" style={internalStyle.button}>Reserve a date for a blog post</Button>
      </div>
    );


    var loadNav = isAdmin ? <TopNavbarBackend /> : <TopNavbar />;

    var loadButton = loggedIn ? internalNav : (
      <div>
      </div>
    );

    return (
      <div>
        {loadNav}
        <Panel style={panelStyle} bsStyle="primary">
          <h2>Aquablog Submissions</h2>
          {loadButton}
        </Panel>
      </div>
    );
  }
}

export default Landing;
