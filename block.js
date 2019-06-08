const crypto = require('crypto')
const { GENESIS_DATA } = require('./config')
const cryptoHash = require('./crypto-hash')

class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }

  static genesis() {
    return new Block(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }) {

    const timestamp = Date.now()
    const lastHash = lastBlock.hash

    return new this({
      timestamp,
      lastHash,
      data,
      hash: cryptoHash(timestamp, lastHash, data)
    })
  }

  // toString() {
  //   return `Block -
  //   Data     : ${ this.data }
  //   Last Hash: ${ this.lastHash.toString(0, 10) }
  //   Hash     : ${ this.hash.toString(0, 10) }`
  // }

  // init() {

  // }
}

module.exports = Block

