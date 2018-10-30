import React, { Component, PropTypes } from 'react';
import { Button, Image, Modal } from 'react-bootstrap/lib';
import Urls from '../util/Urls.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';

class PostRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isDeleteDisabled: false,
      isDeleteLoading: false,
      isEditDisabled: false,
      isScheduledLoading: false,
      isScheduled: false,
      showModal: false,
      showScheduleModal: false,
      showDateModal: false,
      authorName: '',
      authorEmail: '',
      selectedDate: moment(this.props.post.date),
      date: moment(this.props.post.date),
    };
  }

  componentWillMount() {
    const { post } = this.props;
    this.setState({isScheduled: !!post.scheduled, authorName: post.author, authorEmail: post.email});
  }

  updatePostDate() {
    const { post } = this.props;
    axios.put(`${Urls.api}/posts/` + post.id, {
      key: Urls.key,
      column: 'Date',
      value: this.state.selectedDate.toISOString()
    })
    .then(() => {
      this.setState({ date: this.state.selectedDate, showDateModal: false });
    })
    .catch(err => console.log(err));
  }

  handleDateChange(date) {
    this.setState({
      selectedDate: date
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  scheduleOpen() {
    this.setState({ showScheduleModal: true });
  }

  scheduleClose() {
    this.setState({ showScheduleModal: false });
  }

  dateOpen() {
    this.setState({ showDateModal: true });
  }

  dateClose() {
    this.setState({ showDateModal: false });
  }

  resetButtonsState() {
    this.setState({
      isDeleteLoading: false,
      isDeleteDisabled: false,
      isEditDisabled: false,
    });
  }

  deletePost() {
    const { removePost, index, post, addError, clearErrors } = this.props;
    clearErrors();
    this.setState({
      isDeleteLoading: true,
      isDeleteDisabled: false,
      showModal: false,
    });
    axios.delete(`${Urls.api}/posts/${post.id}`, {
      headers: {
        key: Urls.key
      }
    })
      .then(() => {
        removePost(index);
        this.resetButtonsState();
      },
    )
      .catch((err) => {
        addError(err.message);
        this.resetButtonsState();
      },
    );
  }

  sendEmail() {
    const { post } = this.props;

    axios.post(`${Urls.api}/mail`, {
      headers: {
        key: Urls.key
      },
      body: {
        title: post.title,
        date: moment(post.date).format('DD MMM, YYYY'),
        recipient: post.email
      }
    }).then(res => {
      axios.put(`${Urls.api}/posts/` + post.id, {
          key: Urls.key,
          column: 'Scheduled',
          value: 1
        }).catch(err => console.log(err));
        this.setState({ isScheduled: true, showScheduleModal: false });
    }).catch(err => {
      console.log(err)
      this.setState({ showScheduleModal: false });
    });

  }

  makeScheduledButton() {
    const { isScheduledLoading, isScheduled } = this.state;
    if (isScheduledLoading) {
      return <Button bsStyle="danger" disabled>Sending Email...</Button>;
    } else if (isScheduled) {
      return <Button bsStyle="danger" disabled>Scheduled</Button>;
    }

    return <Button bsStyle="danger" onClick={this.scheduleOpen.bind(this)}>Schedule</Button>;
  }

  makeDeleteButton() {
    const { isDeleteLoading, isDeleteDisabled } = this.state;
    if (isDeleteLoading) {
      return <Button bsStyle="danger" disabled>Deleting...</Button>;
    } else if (isDeleteDisabled) {
      return <Button bsStyle="danger" disabled>Delete</Button>;
    }

    return <Button bsStyle="danger" onClick={this.open.bind(this)}>Delete</Button>;
  }

  renderImages() {
    const { post } = this.props;
    var data = post;
    try {
      var splitImages = data.images.split("^");
      var output = [];
      splitImages.map((item, index) => (
        output.push(
          <Image src={item} key={index} responsive />
        )
      ));
      return output;
    } catch (err) {
      console.log("An error occured with image rendering... \n" + err);
      return post.Images;
    }
  }

  render() {
    const { post } = this.props;
    const { showModal, showScheduleModal, isDeleteLoading, isScheduledLoading, authorEmail, authorName } = this.state;
    var data = post;
    return (
      <tr>
        <td>{data.title}</td>
        <td>{data.type}</td>
        <td>{data.body}</td>
        <td>{this.renderImages()}</td>
        <td>{data.tags}</td>
        <td>{data.category}</td>
        <td>{authorName}</td>
        <td>{moment(this.state.date).format('DD MMM, YYYY')}</td>
        <td>
          {this.makeDeleteButton()}
          {this.makeScheduledButton()}
          <Button onClick={this.dateOpen.bind(this)}>Change Date</Button>
        </td>
        <Modal show={showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h2>Are you sure?</h2>
            <h4>This is not reversible!</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>No</Button>
            <Button
              onClick={this.deletePost.bind(this)}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? 'Deleting...' : 'Yes'}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showScheduleModal} onHide={this.scheduleClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Schedule Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h2>This post is set to be published on {moment(this.state.date).format('DD MMM, YYYY')}</h2>
            <h4>The author {authorName} will be notified at email {authorEmail}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.scheduleClose.bind(this)}>No</Button>
            <Button
              onClick={this.sendEmail.bind(this)}
              disabled={isScheduledLoading}
            >
              {isScheduledLoading ? 'Sending email...' : 'Confirm scheduling'}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showDateModal} onHide={this.dateClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Date</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h2>This post is set to be published on {moment(this.state.date).format('DD MMM, YYYY')}</h2>
            Change the date to:
            <DatePicker
              selected={this.state.selectedDate}
              onChange={this.handleDateChange.bind(this)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.dateClose.bind(this)}>No</Button>
            <Button
              onClick={this.updatePostDate.bind(this)}
            >
              Update Date
            </Button>
          </Modal.Footer>
        </Modal>
      </tr>
    );
  }
}

PostRow.propTypes = {
  removePost: PropTypes.func.isRequired,
  addError: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default PostRow;
