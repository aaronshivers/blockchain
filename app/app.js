require('dotenv').config()

const express = require('express')
const app = express()

const indexRoutes = require('./routes/index')
const { router: blocksRoutes, syncChains } = require('./routes/blocks')

app.use(express.json())

app.use(indexRoutes)
app.use(blocksRoutes)

const DEFAULT_PORT = process.env.PORT
let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = Number(DEFAULT_PORT) + Math.floor(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)

  if (PORT !== DEFAULT_PORT) {
    syncChains()
  }
})

module.exports = server
