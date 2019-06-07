const crypto = require('crypto')

const user = {
  name: 'Bob',
  chain: [],
  currentBlock: {}
}

const createHash = ({ timestamp, data, index, previousHash}) => {

  return crypto.createHash('SHA256').update(index + timestamp + data + previousHash).digest('hex')
}

const initializeIt = user => {

  const genesisBlock = {
    index: 0,
    timestamp: new Date().getTime(),
    data: 'Genesis Data',
    previousHash: '-1'
  }

  const hash = createHash(genesisBlock)
  const updatedChain = user.chain.push(hash)
  Object.assign(user, { currentBlock: genesisBlock })
  return Object.assign({}, user, { chain: updatedChain })
}

const addToChain = (user, data) => {
// console.log(user)
  const newBlock = {
    // index: user.previousBlock[0].index++,
    timestamp: 1234,
    // timestamp: new Date().getTime(),
    data,
    previousHash: user.chain[user.chain.length - 1]
  }

  const hash = createHash(newBlock)
  const previousBlock = newBlock
  // console.log(previousBlock)
  const updatedChain = user.chain.push(hash)
  return Object.assign({}, user, { previousBlock: newBlock, chain: updatedChain })
}

initializeIt(user)
// addToChain(user, 'data')
// addToChain(user, 'more data')

console.log(user)
