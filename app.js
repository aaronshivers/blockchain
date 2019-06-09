require('dotenv').config()

const express = require('express')
const app = express()
const { PORT } = process.env

const indexRoutes = require('./routes/index')
const blocksRoutes = require('./routes/blocks')
const pubnubRoutes = require('./routes/pubnub')

app.use(express.json())

app.use(indexRoutes)
app.use(blocksRoutes)
app.use(pubnubRoutes)

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)
})

module.exports = server
