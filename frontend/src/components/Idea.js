import React, { Component } from 'react';
import { Panel } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import CreateIdeaButton from './CreateIdeaButton.js';
import TopNavbar from './TopNavbar.js';
import TopNavbarBackend from './TopNavbarBackend';

class Idea extends Component {
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

  close() {
    this.setState({showGuidelines: false});
  }

  open() {
    this.setState({showGuidelines: true});
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  // only removes from frontend not DB
  removePost(index) {
    const { posts } = this.state;
    posts.splice(index, 1);
    this.setState({ posts });
  }

  // only adds to frontend not DB
  addPost(post) {
    const { posts } = this.state;
    posts.push(post);
    this.setState({ posts, hasSubmitted: true });
  }

  render() {
    const { windowWidth, hasSubmitted, isAdmin, loggedIn } = this.state;
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

    var loadNav = isAdmin ? <TopNavbarBackend /> : <TopNavbar />;

    var postButton = hasSubmitted ? <h3>Thank you for your idea!</h3> : <CreateIdeaButton addPost={this.addPost.bind(this)} />;

    var loadButton = loggedIn ? postButton : <h3>Authentication Failure</h3>;

    return (
      <div>
        {loadNav}
        <Panel style={panelStyle} bsStyle="primary">
          <h2>Aquablog Ideas</h2>
          {loadButton}
        </Panel>
      </div>
    );
  }
}

export default Idea;
