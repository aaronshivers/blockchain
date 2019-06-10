const hexToBinary = require('hex-to-binary')
const crypto = require('crypto')
const { GENESIS_DATA, MINE_RATE } = require('../config')
const cryptoHash = require('../util/crypto-hash')

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

    const lastHash = lastBlock.hash
    let hash, timestamp
    let { difficulty } = lastBlock
    let nonce = 0

    do {

      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)

    } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({ timestamp, lastHash, hash, nonce, difficulty, data })
  }

  static adjustDifficulty({ originalBlock, timestamp }) {

    const { difficulty } = originalBlock

    if (difficulty < 1) return 1

    const difference = timestamp - originalBlock.timestamp

    return difference > MINE_RATE ? difficulty - 1 : difficulty + 1
  }
}

module.exports = Block