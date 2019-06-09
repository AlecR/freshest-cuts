import React, { Component } from 'react'
import { Image as BootstrapImage } from 'react-bootstrap'

class Image extends Component {

  state = {
    src: this.props.src
  }

  handleError(backupSrc) {
    this.setState({
      src: backupSrc
    })
  }

  render() {
    const backupSrc = this.props.backupSrc
    return (
      <BootstrapImage
        fluid={this.props.fluid}
        className={this.props.className}
        src={this.state.src}
        alt={this.props.alt}
        onError={() => this.handleError(backupSrc)} 
      />
    )
  }
}

export default Image