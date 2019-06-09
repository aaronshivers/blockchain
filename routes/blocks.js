const express = require('express')
const router = express.Router()

const Blockchain = require('../blockchain')
const blockchain = new Blockchain()

// GET /api/blocks
router.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain)
})

// POST /api/mine
router.post('/api/mine', (req, res) => {
  const { data } = req.body

  blockchain.addBlock({ data })

  res.redirect('/api/blocks')
})

module.exports = router
