// Imports
import React, { Component, PropTypes } from 'react'

// Styles
const styles = {
  counter: {
    height: 7,
    position: 'absolute',
    bottom: -12,
    right: 0,
    fontSize: 15,
    lineHeight: '11px',
    color: '#C0C0C0',
  },
  good: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
}

export default class CharacterCounter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valueLength: null,
    };
  }

  componentDidMount() {
    const input = this.container.firstChild
    const inputRender = () => { this.setState({ valueLength: input.value.length }) }
    input.addEventListener('keyup', inputRender)
    inputRender()
  }

  render() {

    const { valueLength } = this.state
    const { children, style } = this.props
    const maxLength = (['text', 'email', 'password'].includes(children.props.type) || children.props.componentClass === 'textarea') && children.props.maxLength ? children.props.maxLength : false

    return (
      <div ref={div => this.container = div}>
        {children}
        <span className='form-control-character-counter' style={style ? Object.assign({}, styles.counter) : styles.counter}>
          {valueLength !== null && valueLength > 0 && maxLength &&
            <span style={valueLength === maxLength ? styles.error : styles.good}>{valueLength}/{maxLength}</span>
          }
        </span>
      </div>
    )
  }

}

CharacterCounter.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
}
