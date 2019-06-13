require('dotenv').config()

const express = require('express')
const app = express()

const { router: indexRoutes, syncWithRootState } = require('./routes/index')

app.use(express.json())
app.use(express.static(('client/dist')))

app.use(indexRoutes)

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
