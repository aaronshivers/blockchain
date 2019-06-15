const Transaction = require('./transaction')
const { STARTING_BALANCE } = require('../config')
const { ec, cryptoHash } = require('../util')

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE
    this.keyPair = ec.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode('hex')
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data))
  }

  createTransaction({ recipient, amount, chain }) {

    if (chain) {

      this.balance = Wallet.calculateBalance({

        chain,
        address: this.publicKey
      })
    }

    if (amount > this.balance) throw Error('Amount exceeds balance')
    
    return new Transaction({ senderWallet: this, recipient, amount })
  }

  static calculateBalance({ chain, address }) {

    let hasConductedTransaction = false
    let outputsTotal = 0

    for (let i = chain.length - 1; i > 0; i--) {

      const block = chain[i]
// console.log(block)
      for (const transaction of block.data) {
console.log(transaction, address)

        if (transaction.input.address === address) {
console.log('###################################')
          hasConductedTransaction = true
        }

        const addressOutput = transaction.outputMap[address]
// console.log(transaction.outputMap)
        if (addressOutput) {
console.log('**********************************')
          outputsTotal += addressOutput
        }
      }

      if (hasConductedTransaction) break
    }

    return hasConductedTransaction ?
      outputsTotal :
      STARTING_BALANCE + outputsTotal
  }
}

module.exports = Wallet
