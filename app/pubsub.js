require('dotenv').config()
const PubNub = require('pubnub')
    
const { PUB_KEY, SUB_KEY, SEC_KEY } = process.env
const credentials = {
  publishKey: PUB_KEY,
  subscribeKey: SUB_KEY,
  secretKey: SEC_KEY
}

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN'
}  

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain
    this.pubnub = new PubNub(credentials)
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })
    this.pubnub.addListener(this.listener())
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain, null, 1)
    })
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: [ Object.values(CHANNELS) ]
    })
  }

  listener() {
    return {
      message: messageObject => {
        const { channel, message } = messageObject
      
        console.log(`Message received.\nChannel: ${ channel }\nMessage: ${ message }`)
        const parsedMessage = JSON.parse(message)

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(parsedMessage)
        }
      }
    }
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message })
  }
}

module.exports = PubSub
