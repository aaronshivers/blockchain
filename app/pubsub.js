const PubNub = require('pubnub')
    
const { PUB_KEY, SUB_KEY, SEC_KEY } = process.env
const credentials = {
  publishKey: PUB_KEY,
  subscribeKey: SUB_KEY,
  secretKey: SEC_KEY
}

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
}  

class PubSub {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet

    this.pubnub = new PubNub(credentials)
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })
    this.pubnub.addListener(this.listener())
  }

  listener() {
    return {
      message: messageObject => {
        const { channel, message } = messageObject
      
        console.log(`Message received.\nChannel: ${ channel }\nMessage: ${ message }`)
        const parsedMessage = JSON.parse(message)

        switch(channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage)
            break
          case CHANNELS.TRANSACTION:
            if (!this.transactionPool.existingTransaction({
              inputAddress: this.wallet.publicKey
            })) {
              this.transactionPool.setTransaction(parsedMessage)
            }
            break
          default:
            return
        }
      }
    }
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: [ Object.values(CHANNELS) ]
    })
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message })
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain, null, 1)
    })
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    })
  }
}

module.exports = PubSub
