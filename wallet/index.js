const { STARTING_BALANCE } = require('../config')
const { ec } = require('../util/index')

class Wallet {
  constructor(balance, publicKey) {
    this.balance = STARTING_BALANCE
    this.publicKey = ec.genKeyPair().getPublic()

  }
}

module.exports = Wallet
