import React, { Component } from 'react';
import { Panel, Button, Modal } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import CreatePostButton from './CreatePostButton.js';
import TopNavbar from './TopNavbar.js';
import TopNavbarBackend from './TopNavbarBackend';

class App extends Component {
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
    const { windowWidth, hasSubmitted, isAdmin, loggedIn, showGuidelines } = this.state;
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

    var postButton = hasSubmitted ? <h3>Thank you for your submission!</h3> : <CreatePostButton addPost={this.addPost.bind(this)} />;

    var loadButton = loggedIn ? postButton : <h3>Authentication Failure</h3>;

    console.log(this.props.location);
    return (
      <div>
        {loadNav}
        <Panel style={panelStyle} bsStyle="primary">
          <h2>Aquablog Submissions</h2>
          <p>Use this form to suggest a post for Aquablog. Submission will be reviewed and approved for publication.</p>
          <h4>Please read our <Button onClick={this.open.bind(this)}>Submission Guidelines</Button></h4>
          <Modal show={showGuidelines} onHide={this.close.bind(this)}>
            <Modal.Header closeButton>
              <Modal.Title>Submission Guidelines</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>All blog posts will be edited for clarity and accuracy. Have fun writing your post!</p>
              <h3>Image Guidelines:</h3>
                <ul>
                  <li>The blog requires high-resolution images (minimum 300dpi) that are sized to [width] 1200 pixels x [height] 800 pixels.</li>
                  <li>Images need to be framed horizontal/landscape, particularly for photos of groups where heads can be cut off by the sizing requirements.</li>
                  <li>The cumulative upload size of your images must be less than 50MB.</li>
                  <li>Send images separately, not in the body of a word document.</li>
                  <li>Style tips: vibrant colours, focus on one person (with facial expression) or animal work well.</li>
                </ul>
              <h3>Style Guidelines: Fun, Witty, Upbeat, Engaging</h3>
              <p>
                The Ocean Wise writing style engages readers with an interesting, cool, and fascinating side of the ocean. Bring enthusiasm to your writing style, by using colloquial, accessible language. See 'Post Type' for detailed instructions on writing your post.
              </p>
              <h3>Ocean Wise Style:</h3>
                <ul>
                  <li>Keep writing grounded in details and examples</li>
                  <li>Avoid exclamation points unless it's actually an exclamation like 'oh!'</li>
                  <li>Avoid filler words like:
                    <ul>
                      <li>Despite all that;</li>
                      <li>If I'm honest;</li>
                      <li>I think;</li>
                      <li>Really;</li>
                      <li>Mostly;</li>
                      <li>That;</li>
                      <li>If this isn't possible;</li>
                      <li>Sometimes;</li>
                      <li>The other thing is that;</li>
                      <li>For some reason;</li>
                      <li>It's fair to say;</li>
                      <li>Overall</li>
                    </ul>
                  </li>
                </ul>
              {/* <h3>Length: 500 words</h3>
                <p>
                  Please keep your blog post to 500 words or less
                </p>
              <h3>Post Structure:</h3>
                <ol>
                  <li>Write an engaging introduction to your blog by focusing on the new/novel/newsworthy part of your story. This could be a new discovery or research publication, or an update to a program.</li>
                  <li>Include background on the subject so that someone with no prior knowledge of the topic can understand and appreciate this new information.</li>
                  <li>Include an conclusion on why this new angle is important or interesting to the wider world, beyond Ocean Wise.</li>
                </ol>
              <h3>Writing Style: Fun, Witty, Upbeat and Engaging</h3>
                <p>
                  The Ocean Wise’s writing style engages readers with an interesting, cool, and fascinating side of the ocean. Bring enthusiasm to your writing style, by using colloquial, accessible language.
                </p>
              <h3>General, Not Personal</h3>
                <p>
                  Aquablog is written from a general journalistic perspective, rather than personal. This is because the reader is not always be acquainted with staff members, ocean advocate groups and the like. Throughout the blog, you can introduce yourself/who is speaking.
                </p>
               */}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal>
          {loadButton}
        </Panel>
      </div>
    );
  }
}

export default App;
