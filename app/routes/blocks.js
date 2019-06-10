const express = require('express')
const router = express.Router()
const request = require('request')

const Blockchain = require('../../block/index')
const PubSub = require('../pubsub')
const TransactionPool = require('../../wallet/transaction-pool')
const Wallet = require('../../wallet')

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet
const pubsub = new PubSub({ blockchain })

const ROOT_NODE_ADDRESS = `http://localhost:${ process.env.PORT }`

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

    const transaction = wallet.createTransaction({ amount, recipient })

    transactionPool.setTransaction(transaction)

    console.log('transactionPool', transactionPool)

    res.json({ transaction })

  } catch (error) {

    res.status(400).json({ error: error.message })

  }
})

const syncChains = () => {
  request({ url: `${ ROOT_NODE_ADDRESS }/api/blocks` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body)

      console.log('replace chain on a sync with', rootChain)
      blockchain.replaceChain(rootChain)
    }
  })
}

module.exports = { router, syncChains }
