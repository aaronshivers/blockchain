require('dotenv').config()

const express = require('express')
const app = express()
const request = require('request')
const path = require('path')

const Blockchain = require('./block/index')
const PubSub = require('./app/pubsub')
const TransactionPool = require('./wallet/transaction-pool')
const Wallet = require('./wallet')
const TransactionMiner = require('./app/transaction-miner')

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet
const pubsub = new PubSub({ blockchain, transactionPool, wallet })
const transactionMiner = new TransactionMiner({
  blockchain, transactionPool, wallet, pubsub
})

app.use(express.json())
app.use(express.static(path.join(__dirname, 'client/dist')))

// GET /api/blocks
app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain)
})

// POST /api/mine
app.post('/api/mine', (req, res) => {
  const { data } = req.body

  blockchain.addBlock({ data })

  pubsub.broadcastChain()

  res.redirect('/api/blocks')
})

// POST /api/transact
app.post('/api/transact', (req, res) => {

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
app.get('/api/transaction-pool-map', (req, res) => {

  try {
    
    res.json(transactionPool.transactionMap)

  } catch (error) {

    res.json({ error: error.message })

  }
})

// GET /api/mine-transactions
app.get('/api/mine-transactions', (req, res) => {

  try {

    transactionMiner.mineTransactions()

    res.redirect('/api/blocks')
    
  } catch (error) {
    
    res.json({ error: error.message })

  }
})

// GET /api/wallet-info
app.get('/api/wallet-info', (req, res) => {

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

// GET *
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')))

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

// if (isDevelopment) {
  const walletFoo = new Wallet()
  const walletBar = new Wallet()

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient, amount, chain: blockchain.chain
    })

    transactionPool.setTransaction(transaction)
  }

  const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount: 5
  })

  const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
  })

  const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
  })

  for (let i = 0; i < 10; i++) {
    if (i % 3 === 0) {
      walletAction()
      walletFooAction()
    } else if (i % 3 === 1) {
      walletAction()
      walletBarAction()
    } else {
      walletFooAction()
      walletBarAction()
    }

    transactionMiner.mineTransactions()
  }
// }

const ROOT_NODE_ADDRESS = `http://localhost:${ process.env.PORT }`

const DEFAULT_PORT = process.env.PORT
let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = Number(DEFAULT_PORT) + Math.floor(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState()
  }
})

module.exports = server
