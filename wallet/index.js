const { STARTING_BALANCE } = require('../config')
const { ec } = require('../util/index')

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE
    this.publicKey = ec.genKeyPair().getPublic().encode('hex')

  }
}

module.exports = Wallet
