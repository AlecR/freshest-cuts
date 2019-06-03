import React, { Component } from 'react';

class Image extends Component {

  state = {
    src: this.props.src
  }

  handleError(backupSrc) {
    console.log("Handling it!")
    this.setState({
      src: backupSrc
    })
  }

  render() {
    const backupSrc = this.props.backupSrc
    return (
      <img 
        className={this.props.className}
        src={this.state.src}
        alt={this.props.alt}
        onError={() => this.handleError(backupSrc)} 
      />
    )
  }
}

export default Image