import React, { Component } from 'react'
import Block from './Block'

class Blocks extends Component {
  state = { blocks: [] }

  async componentDidMount() {
    const res = await fetch('http://localhost:3000/api/blocks')
    const json = await res.json()

    this.setState({ blocks: json })
  }

  render() {
    return (
      <div>
        <h3>Blocks</h3>
        {
          this.state.blocks.map(block => {
            return (
              <Block key={ block.hash } block={ block } />
            )
          })
        }
      </div>
    )
  }
}

export default Blocks