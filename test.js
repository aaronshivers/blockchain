const crypto = require('crypto')

const chain = []

const genesisBlock = {
  index: 0,
  timestamp: new Date().getTime(),
  data: 'Genesis Data',
  previousHash: '-1'
}

const createHash = ({ timestamp, data, index, previousHash}) => {

  return crypto.createHash('SHA256').update(index + timestamp + data + previousHash).digest('hex')
}

const addToChain = block => {

  
}

chain.push(createHash(genesisBlock))


console.log(chain)