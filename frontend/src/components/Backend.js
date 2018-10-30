import React, { Component } from 'react';
import { Panel } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import Urls from '../util/Urls.js';
import PostBoard from './PostBoard.js';
import TopNavbar from './TopNavbar.js';
import TopNavbarBackend from './TopNavbarBackend.js';
import axios from 'axios';

class Backend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      posts: [],
      errors: [],
      admins: ["Laura.Trethewey@ocean.org", "Ethan.Dinnen@ocean.org"],
      user: {},
      loggedIn: true,
      isAdmin: this.props.routes[0].isAdmin
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  // Get the posts from database
  getPosts() {
    var that = this;

    axios.get(`${Urls.api}/posts`, {
      headers: {
        key: Urls.key
      }
    }).then(res => {
      that.setState({ posts: res.data.data });
    }).catch(err => {
      that.setState({errors: ['Error connecting to API']});
    });
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
    this.setState({ posts });
  }

  render() {
    const { windowWidth, posts, isAdmin, loggedIn } = this.state;
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
    };

    var loadNav = isAdmin ? <TopNavbarBackend /> : <TopNavbar />;

    var ifLoggedIn = loggedIn ? <PostBoard posts={posts} removePost={this.removePost.bind(this)} /> : <h3>Authentication error</h3>;

    return (
      <div>
        {loadNav}
        <Panel style={panelStyle} bsStyle="primary">
          <h2>Aquablog Posts</h2>
          {ifLoggedIn}
        </Panel>
      </div>
    );
  }
}

export default Backend;
