import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap/lib';
import axios from 'axios';
import Urls from '../util/Urls.js';
import DatePicker from 'react-bootstrap-date-picker';
import Select from 'react-select';
import CharacterCounter from './CharacterCounter';
// import TagsInput from 'react-tagsinput';
// import Autosuggest from 'react-autosuggest';
import FileBase64 from 'react-file-base64';

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


class CreatePostButton extends Component {
  constructor(props) {
    super(props);
    var date = new Date().toISOString();
    this.state = {
      title: '',
      type: '',
      message: '',
      images: '',
      tags: [],
      category: '',
      author: '',
      email: '',
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
      errors.push('Message cannot be blank.');
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
        "Email": email
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
        Tags: tags,
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
    const { isLoading, QA, FA, ann } = this.state;

    const formStyle = {
      margin: 'auto',
      marginTop: '65px',
      textAlign: 'left',
    };

    // Post types to show in dropdown menu
    var postType = [
      { value: 'Announcement', label: 'Announcement: research discovery, exciting update to a program, or commentary on ocean news' },
      { value: 'Question + Answer Profile', label: 'Question + Answer Profile: interview with an ocean champion' },
      { value: 'First-hand Account', label: 'First-hand Account: personal memoir recounting a specific event/experience' },
    ];

    // Post categaries to show in dropdown menu
    var possibleCategories = [
      { value: 'Aquablog', label: 'Aquablog' },
      { value: 'Arctic Connections', label: 'Arctic Connections' },
      { value: 'Coastal Ocean Research', label: 'Coastal Ocean Research' },
      { value: 'Marine Biodiversity', label: 'Marine Biodiversity' },
      { value: 'Marine Mammal Rescue', label: 'Marine Mammal Rescue' },
      { value: 'Ocean Wise', label: 'Ocean Wise' },
      { value: 'Ocean Wise Life', label: 'Ocean Wise Life' },
      { value: 'Photos', label: 'Photos' },
      { value: 'Shoreline Cleanup', label: 'Shoreline Cleanup' },
      { value: 'Vancouver Aquarium', label: 'Vancouver Aquarium' },
      { value: 'Videos', label: 'Videos' },
      { value: 'Whale Sightings', label: 'Whale Sightings' }
    ];

    var theTags = [
      {value: 'Arctic', label: 'Arctic'},
      {value: 'Arctic Connections', label: 'Arctic Connections'},
      {value: 'Arctic news', label: 'Arctic news'},
      {value: 'Arctic science', label: 'Arctic science'},
      {value: 'B.C.', label: 'B.C.'},
      {value: 'Cetacean Sightings Network', label: 'Cetacean Sightings Network'},
      {value: 'Beluga Research', label: 'Beluga Research'},
      {value: 'Canada\'s North', label: 'Canada\'s North'},
      {value: 'Cetacean Research', label: 'Cetacean Research'},
      {value: 'Cetaceans', label: 'Cetaceans'},
      {value: 'Chester', label: 'Chester'},
      {value: 'Climate Change', label: 'Climate Change'},
      {value: 'Conservation', label: 'Conservation'},
      {value: 'Education', label: 'Education'},
      {value: 'Expansion', label: 'Expansion'},
      {value: 'False Killer Whale', label: 'False Killer Whale'},
      {value: 'Featured - Category', label: 'Featured - Category'},
      {value: 'Featured - Main', label: 'Featured - Main'},
      {value: 'Featured - www.vanaqua.org', label: 'Featured - www.vanaqua.org'},
      {value: 'Featured Animal', label: 'Featured Animal'},
      {value: 'Great Canadian Shoreline Cleanup', label: 'Great Canadian Shoreline Cleanup'},
      {value: 'Killer whales', label: 'Killer whales'},
      {value: 'Marine Debris', label: 'Marine Debris'},
      {value: 'Marine Mammal Rescue', label: 'Marine Mammal Rescue'},
      {value: 'Marine Mammal Rescue Centre', label: 'Marine Mammal Rescue Centre'},
      {value: 'Narwhals', label: 'Narwhals'},
      {value: 'Ocean Pollution', label: 'Ocean Pollution'},
      {value: 'Ocean Wise', label: 'Ocean Wise'},
      {value: 'Plastic Free', label: 'Plastic Free'},
      {value: 'POLAR', label: 'POLAR'},
      {value: 'Popular', label: 'Popular'},
      {value: 'Public Programs', label: 'Public Programs'},
      {value: 'Rescue Centre', label: 'Rescue Centre'},
      {value: 'Rescue story', label: 'Rescue story'},
      {value: 'Research', label: 'Research'},
      {value: 'Sea Otter', label: 'Sea Otter'},
      {value: 'Shoreline Cleanup', label: 'Shoreline Cleanup'},
      {value: 'Staff', label: 'Staff'},
      {value: 'Staff Pick of the Month', label: 'Staff Pick of the Month'},
      {value: 'Sustainable Seafood', label: 'Sustainable Seafood'},
      {value: 'Tsunami Debris', label: 'Tsunami Debris'},
      {value: 'Vancouver Aquarium', label: 'Vancouver Aquarium'},
      {value: 'Volunteers', label: 'Volunteers'},
      {value: 'Whales', label: 'Whales'},
      {value: 'Whale Sightings', label: 'Whale Sightings'}
    ];

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
                <ControlLabel>Title: <i>Write an accessible title that grabs your reader's attention. Questions work well, eg) "Why is This Crab Wearing Pom-Poms?"</i></ControlLabel>
                <CharacterCounter>
                  <FormControl
                    type="text"
                    value={this.state.title}
                    placeholder="Enter post Title"
                    onChange={this.handleChange.bind(this, 'title')}
                  />
                </CharacterCounter>
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Post Type: <i>Choose one of three formats for your blog post. Detailed instructions will pop up for each format</i></ControlLabel>
                <Select
                  value={this.state.type}
                  options={postType}
                  onChange={this.handleChange.bind(this, 'type')}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Blog Post</ControlLabel>
                <CharacterCounter>
                  <FormControl
                    componentClass="textarea"
                    style={{ height: 200 }}
                    value={this.state.message}
                    placeholder="Write your blog post here!"
                    onChange={this.handleChange.bind(this, 'message')}
                  />
                </CharacterCounter>
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Images: <i>Please upload two to three high-resolution images (minimum 300dpi) sized to [width] 1200 pixels and [height] 800 pixels. Refer to Submission Guidelines above for more detailed instructions.</i></ControlLabel>
                <FileBase64
                  multiple={ true }
                  onDone={this.handleChange.bind(this, 'images')} />
                  {this.state.images !== '' ? <span>Current upload size: {this.formatBytes(this.roughSizeOfObject(this.state.images))}</span> : null}
              </FormGroup>
              <FormGroup>
                <ControlLabel>Tags</ControlLabel>
                {/* <TagsInput
                  renderInput={autocompleteRenderInput}
                  value={this.state.tags}
                  onChange={tags => this.setState({tags: tags})}
                /> */}
                <Select
                  multi={true}
                  simpleValue={true}
                  value={this.state.tags}
                  options={theTags}
                  onChange={this.handleChange.bind(this, 'tags')}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Category</ControlLabel>
                <Select
                  value={this.state.category}
                  options={possibleCategories}
                  multi={true}
                  simpleValue={true}
                  onChange={this.handleChange.bind(this, 'category')}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Date to post: <i>You will receive an email letting you know what day your post will appear on Aquablog</i></ControlLabel>
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
            <Modal show={ann} onHide={this.close.bind(this)}>
              <Modal.Header closeButton>
                <Modal.Title>Announcement Guidelines</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b>Length: 500 words</b><br/>
                <u>Introduction: 150 words</u><br/>
		<ol>
                <li>Lead with the most catchy or noteworthy detail about your story. This could also be a grabby quote from a source, if you have one.</li>                	<li>Unpack information in first grabby sentence.</li>
</ol>                <u>Background Information: 200 words</u><br/>
                <ol>
		<li>Write background information on the subject so that someone with no prior knowledge of the topic can appreciate new information.</li>
                <li>Include a quote (if applicable) that builds out the WHY of your story.</li></ol>
                <u>Conclusion: 150 Words</u><br/>
                <ol><li>Write why this new angle is important to the wider world, beyond Ocean Wise.</li></ol>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close.bind(this)}>Close</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={QA} onHide={this.close.bind(this)}>
              <Modal.Header closeButton>
                <Modal.Title>Question & Answer Guidelines</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b>Length: 500 words</b><br/>
                <u>Introduction: 150 words</u><br/>
                <ol>
		<li>Start with the most catchy or noteworthy detail about the profiled person, making sure to include the person's value, age, and who they are (ie. job position). You could also start with a grabby quote from the profile subject and then segue back into the person's story.</li>
                <li>Finish introduction paragraph with a short one-liner about the upcoming interview.</li></ol>
                <i><b>Example: "Ocean Wise Education sat down with Sarah to find out why she took on such a mammoth project."<br/><br/></b></i>

                <u>Main Body: 250 Words</u><br/>
		<ol start="3">
                <li>Set up first question with the interviewer's title, followed by a colon and the question. Follow this with the interviewee's value, colon and response. Start with the more general question and work toward the concluding point of the interview. Keep questions and answers tight and to the point.</li>
<br/><b><i>                Ocean Wise Education: What was your most memorable experience at the Junior Biologist Club?<br/>
                Oliver Millar: The most memorable experience'I had was when the belugas were led down to the viewing glass and we got to interact with the whales! I also loved achieving my 35-session milestone.<br/></i></b><br/>
                <li>Include a maximum of three questions with answers. After the first question and answer, shorten the interviewer's and interviewee's title to initials.</li><br/>
<b><i>                OWE: What's next for you at the JBC?<br/>
                OM: I am thrilled that Ocean Wise has opened up the Junior Biologist Club to 12-year-olds, so I will continue attending and learn even more about our oceans! I would like to be a marine biologist when I grow up and the club sessions are the perfect introduction for me.<br/></i></b>
</ol>
                <u>Conclusion: 100 Words</u><br/>
                <ol start="5"><li>Write a forward-looking conclusion to the subject's story. For instance, what does their experience say about the Ocean Wise initiative? Or what do they plan to do in the future?</li></ol>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close.bind(this)}>Close</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={FA} onHide={this.close.bind(this)}>
              <Modal.Header closeButton>
                <Modal.Title>First-hand Account Guidelines</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <b>Length: 500 words<br/></b>
                <u>Introduction: 150 words<br/></u>
<ol>
                <li>Start with the most catchy or noteworthy detail about your story. Establish who you are and what your account is going to explore in the first paragraph.</li>
</ol>
                <u>Background and Main Body: 250 Words<br/></u>
                <ol start="2"><li>Focus your account on one or two events that highlight the main point of your story.</li></ol>
                <u>Conclusion: 100 Words<br/></u>
                <ol start="3"><li>Express what you learned from this experience --- don't be subtle, spell it out for the reader.</li></ol>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close.bind(this)}>Close</Button>
              </Modal.Footer>
            </Modal>
      </div>
    );
  }
}

CreatePostButton.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default CreatePostButton;
