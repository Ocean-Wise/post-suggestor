import React from 'react';
import Urls from '../util/Urls.js';
import TopNavbar from './TopNavbar';
import TopNavbarBackend from './TopNavbarBackend';
import axios from 'axios';

/* Load stuff for react-big-calendar *
**************************************/
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';
import '../util/calendarStyles.css';


const DragAndDropCalendar = withDragAndDrop(BigCalendar);

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);
// Done loading

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: [],
      posts: [],
      admins: ["Laura.Trethewey@ocean.org", "Ethan.Dinnen@ocean.org"],
      user: {},
      loggedIn: true,
      isAdmin: this.props.routes[0].isAdmin
    }

    this.moveEvent = this.moveEvent.bind(this)
  }

  componentDidMount() {
    this.getPosts();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  getPosts() {
    var events = this.state.events; // Initialize/Load events array
    var posts = []; // Initialize posts array

    var that = this;

    axios.get(`${Urls.api}/posts`, {
      headers: {
        key: Urls.key
      }
    }).then(res => {
      posts = res.data.data;
      // eslint-disable-next-line
      posts.map((post, i) => {
        events.push({'title': post.title, 'start': moment(post.date).toDate(), 'end': moment(post.date).add(30, 'm').toDate(), 'databaseId': post.id})
      });
      that.setState({events:events});
      that.setState({posts:posts});
    }).catch(err => {
      that.setState({errors: ['Error connecting to API']});
    });
  }

  moveEvent({ event, start, end }) {
    // Load variables
    const { events } = this.state;

    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    // Move events around in the array
    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)


    var original = this.state.posts.find((post) => post.id === updatedEvent.databaseId); // Find the moved event in the post array based on the database ID
    original.date = moment(updatedEvent.start).toISOString(); // Update the original post's date

    this.setState({
      events: nextEvents
    })

    // Update the database entry with the new date and time so that the update is persistent
    var postId = updatedEvent.databaseId;

    axios.put(`${Urls.api}/posts/` + postId, {
      key: Urls.key,
      column: 'Date',
      value: original.date
    }).catch(err => console.log(err));

    alert(`${event.title} was dropped onto ${event.start}`);
  }

  render() {
    const { isAdmin, loggedIn } = this.state;

    const styles = {
      marginTop: "5.5vh",
      height: "90vh",
      width: "100vw",
      display: "flex",
      flex: 1
    }

    var loadNav = isAdmin ? <TopNavbarBackend /> : <TopNavbar />;
    var ifLoggedIn = loggedIn ? <DragAndDropCalendar selectable events={this.state.events} onEventDrop={this.moveEvent} defaultView='month' defaultDate={new Date()} /> : <h3>Authentication error</h3>;

    return (
      <div>
        {loadNav}
        <div style={styles}>
          {ifLoggedIn}
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Calendar)
