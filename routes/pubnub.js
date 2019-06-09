const express = require('express')
const router = express.Router()
const PubNub = require('pubnub')

// POST /pubnub
router.post('/pubnub', (req, res) => {

  try {
    
    const { PUB_KEY, SUB_KEY } = process.env

    const { message } = req.body

    const publishConfig = {
      channel: 'pubnub_onboarding_channel',
      message
    }

    pubnub.publish(publishConfig, (status, response) => {

      res.send({ status, response })
    })

  } catch (error) {

    res.send(error.message)

  }
})

module.exports = router
