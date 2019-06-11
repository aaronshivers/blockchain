const express = require('express')
const router = express.Router()
const request = require('request')

const Blockchain = require('../../block/index')
const PubSub = require('../pubsub')
const TransactionPool = require('../../wallet/transaction-pool')
const Wallet = require('../../wallet')
const TransactionMiner = require('../transaction-miner')

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet
const pubsub = new PubSub({ blockchain, transactionPool, wallet })
const transactionMiner = new TransactionMiner({
  blockchain, transactionPool, wallet, pubsub
})

const ROOT_NODE_ADDRESS = `http://localhost:${ process.env.PORT }`

// GET /
router.get('/', (req, res) => res.send('Hello'))

// GET /api/blocks
router.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain)
})

// POST /api/mine
router.post('/api/mine', (req, res) => {
  const { data } = req.body

  blockchain.addBlock({ data })

  pubsub.broadcastChain()

  res.redirect('/api/blocks')
})

// POST /api/transact
router.post('/api/transact', (req, res) => {

  try {

    const { amount, recipient } = req.body

    let transaction = transactionPool
      .existingTransaction({ inputAddress: wallet.publicKey })

    if (transaction) {

      transaction.update({ senderWallet: wallet, recipient, amount })

    } else {

      transaction = wallet.createTransaction({

        amount,
        recipient,
        chain: blockchain.chain
      })
    }

    transactionPool.setTransaction(transaction)

    pubsub.broadcastTransaction(transaction)

    res.json({ transaction })

  } catch (error) {

    res.status(400).json({ error: error.message })

  }
})

// GET /api/transaction-pool-map
router.get('/api/transaction-pool-map', (req, res) => {

  try {
    
    res.json(transactionPool.transactionMap)

  } catch (error) {

    res.json({ error: error.message })

  }
})

// GET /api/mine-transactions
router.get('/api/mine-transactions', (req, res) => {

  try {

    transactionMiner.mineTransactions()

    res.redirect('/api/blocks')
    
  } catch (error) {
    
    res.json({ error: error.message })

  }
})

// GET /api/wallet-info
router.get('/api/wallet-info', (req, res) => {

  try {

    const address = wallet.publicKey
    
    res.json({

      address,
      balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    })

  } catch (error) {
    
    res.json({ error: error.message })

  }

})

const syncWithRootState = () => {
  request({ url: `${ ROOT_NODE_ADDRESS }/api/blocks` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body)

      console.log('replace chain on a sync with', rootChain)
      blockchain.replaceChain(rootChain)
    }
  })

  request({ url: `${ ROOT_NODE_ADDRESS }/api/transaction-pool-map` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body)

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
      transactionPool.setMap(rootTransactionPoolMap)
    }
  })
}

module.exports = { router, syncWithRootState }
