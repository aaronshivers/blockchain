const crypto = require('crypto')

const createHash = ({ timestamp, data, index, previousHash}) => {

  return crypto.createHash('SHA256').update(index + timestamp + data + previousHash).digest('hex')
}

const initializeIt = user => {

  const genesisBlock = {
    index: 0,
    timestamp: new Date().getTime(),
    // data: 'Genesis Data',
    previousHash: '-1'
  }

  const hash = createHash(genesisBlock)
  return Object.assign({}, user, { chain: hash }, { currentBlock: genesisBlock })
}

const addToChain = user => {
console.log(user)
  const newBlock = {
    index: user.currentBlock.index += 1,
    timestamp: new Date().getTime(),
    // data: 'fart',
    previousHash: user.chain
  }

  const hash = createHash(newBlock)
  return Object.assign({}, user, { chain: hash }, { currentBlock: newBlock })
}

const compose = (f, g) => (data) => f(g(data))

const addBlock = (...fns) => fns.reduce(compose)

console.log(addBlock(
  addToChain,
  addToChain,
  initializeIt
)())

