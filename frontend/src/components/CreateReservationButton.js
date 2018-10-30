import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap/lib';
import axios from 'axios';
import Urls from '../util/Urls.js';
import DatePicker from 'react-bootstrap-date-picker';
import CharacterCounter from './CharacterCounter';
// import TagsInput from 'react-tagsinput';
// import Autosuggest from 'react-autosuggest';

import 'react-select/dist/react-select.css';
import '../util/selectMenu.css';
import 'react-tagsinput/react-tagsinput.css';
import '../util/tagStyles.css'

// function tagSuggestions() {
//   return [
//     {value: 'Arctic'},
//     {value: 'Arctic Connections'},
//     {value: 'Arctic news'},
//     {value: 'Arctic science'},
//     {value: 'B.C.'},
//     {value: 'Cetacean Sightings Network'},
//     {value: 'Beluga Research'},
//     {value: 'Canada\'s North'},
//     {value: 'Cetacean Research'},
//     {value: 'Cetaceans'},
//     {value: 'Chester'},
//     {value: 'Climate Change'},
//     {value: 'Conservation'},
//     {value: 'Education'},
//     {value: 'Expansion'},
//     {value: 'False Killer Whale'},
//     {value: 'Featured - Category'},
//     {value: 'Featured - Main'},
//     {value: 'Featured - www.vanaqua.org'},
//     {value: 'Featured Animal'},
//     {value: 'Great Canadian Shoreline Cleanup'},
//     {value: 'Killer whales'},
//     {value: 'Marine Debris'},
//     {value: 'Marine Mammal Rescue'},
//     {value: 'Marine Mammal Rescue Centre'},
//     {value: 'Narwhals'},
//     {value: 'Ocean Pollution'},
//     {value: 'Ocean Wise'},
//     {value: 'Plastic Free'},
//     {value: 'POLAR'},
//     {value: 'Popular'},
//     {value: 'Public Programs'},
//     {value: 'Rescue Centre'},
//     {value: 'Rescue story'},
//     {value: 'Research'},
//     {value: 'Sea Otter'},
//     {value: 'Shoreline Cleanup'},
//     {value: 'Staff'},
//     {value: 'Staff Pick of the Month'},
//     {value: 'Sustainable Seafood'},
//     {value: 'Tsunami Debris'},
//     {value: 'Vancouver Aquarium'},
//     {value: 'Volunteers'},
//     {value: 'Whales'},
//     {value: 'Whale Sightings'}
//   ]
// }


class CreateReservationButton extends Component {
  constructor(props) {
    super(props);
    var date = new Date().toISOString();
    this.state = {
      title: 'Date Reservation',
      type: 'Date Reservation',
      message: '',
      author: '',
      email: '',
      images: '',
      tags: [],
      category: 'Date Reservation',
      date: date,
      isLoading: false,
      errors: [],
      user: {},
      QA: false,
      FA: false,
      ann: false,
    };

  }

  close() {
    this.setState({QA: false, FA: false, ann: false});
  }

  showQAGuidelines() {
    this.setState({QA: true});
  }
  showFAGuidelines() {
    this.setState({FA: true});
  }
  showAnnouncement() {
    this.setState({ann: true});
  }

  handleChange(key, e) {
    const newState = {};
    if (key === 'type') {
      newState[key] = e.value;
      if (e.value === 'Announcement') {
        this.showAnnouncement()
      } else if (e.value === 'Question + Answer Profile') {
        this.showQAGuidelines()
      } else if (e.value === 'First-hand Account') {
        this.showFAGuidelines()
      }
    } else if (key === 'category' || key === 'date' || key === 'tags') {
      newState[key] = e;
    } else if (key === 'images') {
      var newImages = [];
      // eslint-disable-next-line
      e.map(image => {
        newImages.push(image.base64);
      });
      newImages = newImages.join("^");
      this.setState({images: newImages});
    } else {
      newState[key] = e.target.value;
    }

    this.setState(newState);
  }

  handleDelete(i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleAddition(tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  roughSizeOfObject(object) {
    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while (stack.length) {
      var value = stack.pop();

      if (typeof value === 'boolean') {
        bytes += 4;
      } else if (typeof value === 'string') {
        bytes += value.length * 2;
      } else if (typeof value === 'number') {
        bytes += 8;
      } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
        objectList.push(value);
        for (var i in value) {
          if (value[i] !== null) {
            stack.push(value[i]);
          }
        }
      }
    }
    return bytes;
  }

  formatBytes(bytes,decimals) {
    if(bytes === 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k,i)).toFixed(dm)) + ' ' + sizes[i];
  }

  checkInput(data) {
    const errors = [];

    if (this.state.message.length === 0) {
      errors.push('Description cannot be blank.');
    }

    if (this.state.title.length === 0) {
      errors.push('Title cannot be blank.');
    }

    if (this.roughSizeOfObject(data) >= (50 * 1024 * 1024)) { // If size of data to pass to API is >= 50MB
      errors.push('Maximum size of all attached files must be less than 50MB');
    }

    return errors;
  }

  createPost() {
    const { title, type, message, images, tags, category, date, author, email } = this.state;
    this.setState({ isLoading: true, errors: [] });
    var data = {
      "fields": {
        "Title": title,
        "Type": type,
        "Body": message,
        "Images": images,
        "Tags": tags,
        "Category": category,
        "Date": date,
        "Author": author,
        "Email": email,
      }
    }

    const errors = this.checkInput(data);

    if (errors.length === 0) {

      var that = this;

      axios.post(`${Urls.api}/posts`, {
        Title: title,
        Type: type,
        Body: message,
        Images: images,
        Tags: tags.join(', '),
        Category: category,
        Date: date,
        Author: author,
        Email: email,
        key: Urls.key,
        Scheduled: 0
      }).then((res) => {
        that.setState({ showModal: false, title: '', type: 0, message: '', images: '', tags: [], category: '', date: '', isLoading: false, errors: []});
        this.props.addPost(data);
        that.lauraEmail(title);
      }).catch((err) => {
        that.setState({ isLoading: false, errors: [err.message] });
      });

    } else {
      this.setState({ isLoading: false, errors });
    }
  }

  lauraEmail(title) {

    axios.post(`${Urls.api}/laura`, {
      headers: {
        key: Urls.key
      },
      body: {
        title: title,
        recipient: 'laura.trethewey@ocean.org'
      }
    }).then(res => {
      return true;
    }).catch(err => {
      console.log(err)
    });

  }


  render() {
    const { isLoading } = this.state;

    const formStyle = {
      margin: 'auto',
      marginTop: '65px',
      textAlign: 'left',
    };

    // function autocompleteRenderInput ({addTag, ...props}) {
    //   const handleOnChange = (e, {newValue, method}) => {
    //     if (method === 'enter') {
    //       e.preventDefault()
    //     } else {
    //       props.onChange(e)
    //     }
    //   }
    //
    //   const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
    //   const inputLength = inputValue.length
    //
    //   let suggestions = tagSuggestions().filter((state) => {
    //     return state.value.toLowerCase().slice(0, inputLength) === inputValue
    //   })
    //
    //   return (
    //     <Autosuggest
    //       ref={props.ref}
    //       suggestions={suggestions}
    //       shouldRenderSuggestions={(value) => value && value.trim().length > 0}
    //       getSuggestionValue={(suggestion) => suggestion.value}
    //       renderSuggestion={(suggestion) => <span>{suggestion.value}</span>}
    //       inputProps={{...props, onChange: handleOnChange}}
    //       onSuggestionSelected={(e, {suggestion}) => {
    //         addTag(suggestion.value)
    //       }}
    //       onSuggestionsClearRequested={() => {}}
    //       onSuggestionsFetchRequested={() => {}}
    //     />
    //   )
    // }

    var errorStyle = {
      parent: {
        width: '230px',
        textAlign: 'left',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'red'
      },
      child: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: '-15px'
      }
    }
    const errors = this.state.errors.map((err, i) => <li key={i}>{err}</li>);

    var showErrors = this.state.errors.length > 0 ? <div style={errorStyle.parent}><center style={errorStyle.child}>Error with submission</center><br/><ul>{errors}</ul></div> : null;

    return (
      <div>
            {showErrors}
            <form style={formStyle}>
              <FormGroup>
                <ControlLabel>Your Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.author}
                  placeholder="Enter your name"
                  onChange={this.handleChange.bind(this, 'author')}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Your Ocean.org Email</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.email}
                  placeholder="Enter your @ocean.org email address"
                  onChange={this.handleChange.bind(this, 'email')}
                />
              </FormGroup>
	      <FormGroup>
		<ControlLabel>Post Description</ControlLabel>
		<CharacterCounter>
		  <FormControl
		    type="text"
		    value={this.state.message}
                    placeholder="Enter post description"
                    onChange={this.handleChange.bind(this, 'message')}
                  />
                </CharacterCounter>
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Reserve a date for an upcoming, but still unwritten, blog post.</ControlLabel>
                <DatePicker
                  id="datepicker"
                  value={this.state.date}
                  onChange={this.handleChange.bind(this, 'date')}
                />
              </FormGroup>
            </form>
            <Button
              onClick={this.createPost.bind(this)}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
      </div>
    );
  }
}

CreateReservationButton.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default CreateReservationButton;
