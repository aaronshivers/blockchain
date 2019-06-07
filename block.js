function BrewChain () {
  const chain = []
  const currentBlock = {}
  let genesisBlock = {}

  const init = () => {

    genesisBlock = {
      index: 0,
      timestamp: new Date().getTime(),
      data: 'Genesis Data',
      previousHash: '-1'
    }

    genesisBlock.hash = createHash(genesisBlock)
    addToChain(genesisBlock)
  }

  const createHash = ({ timestamp, data, index, previousHash}) => {
    
    return Crypto.createHash('SHA256').update(timestamp + data + index + previousHash).digest('hex')
  }

  const addToChain = block => {

    if (isNewBlockValid(block, currentBlock)) {

      chain.push(block)
      currentBlock = block
      return true
    }

    return false
  }

  const createBlock = (data) => {
    
    const newBlock = {
      timestamp: new Date().getTime(),
      data,
      index: currentBlock.index++,
      previousHash: currentBlock.hash
    }

    newBlock.hash = createHash(newBlock)

    return newBlock
  }

  const getLatestBlock = () => currentBlock

  const getTotalBlocks = () => chain.length

  const getChain = () => chain

  const isNewBlockValid = (block, previousBlock) => {

    if (previousBlock.index + 1 !== block.index) {

      return false

    } else if (previousBlock.hash !== block.previousHash) {

      return false

    } else if (!hashIsValid) {

      return false

    }

    return true
  }

  return {
    init,
    createBlock,
    addToChain,
    isNewBlockValid,
    getLatestBlock,
    getTotalBlocks,
    getChain
  }
}

const myBrew = new BrewChain()
myBrew.init()

myBrew.addToChain(myBrew.createBlock('The 1st Block'))
myBrew.addToChain(myBrew.createBlock('The 2nd Block'))

console.log(myBrew)
