const crypto = require('crypto')
const { GENESIS_DATA } = require('./config')

// const createHash = data => {
//   return data + '#'
// }

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

  // toString() {
  //   return `Block -
  //   Data     : ${ this.data }
  //   Last Hash: ${ this.lastHash.toString(0, 10) }
  //   Hash     : ${ this.hash.toString(0, 10) }`
  // }

  // init() {

  // }
}

// class BlockChain {
//   constructor() {
//     const genesis = new Block('time', 'genLastHash', 'genHash', 'genData')
  
//     this.chain = [ genesis ]
//   }

//   addBlock(data) {

//     const lastHash = this.chain[ this.chain.length - 1 ].hash
  
//     const hash = createHash(data + lastHash)

//     const block = new Block(timestamp, lastHash, hash, data)

//     this.chain.push(block)
//   }
// }

const block1 = new Block({
  timestamp: new Date().getTime(),
  lastHash: 'lastHash',
  hash: 'hash',
  data: 'data'
})
// fooBlockChain.addBlock('one')
// fooBlockChain.addBlock('two')
// fooBlockChain.addBlock('three')

console.log('block1', block1)

module.exports = Block

//   const chain = []
//   const currentBlock = {}
//   let genesisBlock = {}

//   const init = () => {

//     genesisBlock = {
//       index: 0,
//       timestamp: new Date().getTime(),
//       data: 'Genesis Data',
//       previousHash: '-1'
//     }

//     genesisBlock.hash = createHash(genesisBlock)
//     addToChain(genesisBlock)
//   }

//   const createHash = ({ timestamp, data, index, previousHash}) => {
    
//     return crypto.createHash('SHA256').update(timestamp + data + index + previousHash).digest('hex')
//   }

//   const addToChain = block => {

//     if (isNewBlockValid(block, currentBlock)) {

//       chain.push(block)
//       currentBlock = block
//       return true
//     }

//     return false
//   }

//   const createBlock = (data) => {
    
//     const newBlock = {
//       timestamp: new Date().getTime(),
//       data,
//       index: currentBlock.index++,
//       previousHash: currentBlock.hash
//     }

//     newBlock.hash = createHash(newBlock)

//     return newBlock
//   }

//   const getLatestBlock = () => currentBlock

//   const getTotalBlocks = () => chain.length

//   const getChain = () => chain

//   const isNewBlockValid = (block, previousBlock) => {

//     if (previousBlock.index + 1 !== block.index) {

//       return false

//     } else if (previousBlock.hash !== block.previousHash) {

//       return false

//     } else if (!hashIsValid) {

//       return false

//     }

//     return true
//   }

//   return {
//     init,
//     createBlock,
//     addToChain,
//     isNewBlockValid,
//     getLatestBlock,
//     getTotalBlocks,
//     getChain
//   }
// }

// const myBrew = new BrewChain()
// myBrew.init()

// myBrew.addToChain(myBrew.createBlock('The 1st Block'))
// myBrew.addToChain(myBrew.createBlock('The 2nd Block'))

// const BrewNode = function(port) {
//   const brewSockets = []
//   let brewServer
//   let _port = port
//   let chain = new BrewChain()

//   const init = () => {

//     chain.init()

//     brewServer = new WebSocket.Server({ port: _port })

//     brewServer.on('connection', connection => {
//       console.leg('connection in')
//       initConnection(connection)
//     })
//   }

//   const messageHandler = connection => {
//     connection.on('message', data => {
//       console.log('Message In:')
//       const msg = JSON.parse(data)

//       console.log(msg.event)
//     })
//     console.log('message handler setup')
//   }

//   const broadcastMessage = message => {
//     console.log('sending to all' + message)
//     brewSockets.forEach(node => node.send(JSON.stringify({ event: message })))
//   }
// }
