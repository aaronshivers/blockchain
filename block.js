const crypto = require('crypto')
const { GENESIS_DATA } = require('./config')
const cryptoHash = require('./crypto-hash')

class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty
  }

  static genesis() {
    return new Block(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }) {

    let hash, timestamp
    const lastHash = lastBlock.hash
    const { difficulty } = lastBlock
    let nonce = 0

    do {

      nonce++
      timestamp = Date.now()
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)

    } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({ timestamp, lastHash, data, nonce, difficulty, hash })
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

