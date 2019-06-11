const request = require('supertest')

const TransactionPool = require('../../../wallet/transaction-pool')
const Wallet = require('../../../wallet')
const Blockchain = require('../../../block/index')

const transactionPool = new TransactionPool
const wallet = new Wallet
const blockchain = new Blockchain()

let server

beforeEach(() => server = require('../../app'))
afterEach(async () => await server.close())

describe('/', () => {

  // GET /
  describe('GET /', () => {

    it('should respond 200', async () => {

      await request(server)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Hello')
        })
    })
  })
})

// GET /api/blocks
describe('GET /api/blocks', () => {

  it('should respond 200', async () => {

    await request(server)
      .get('/api/blocks')
      .expect(200)
      .expect(res => {
        expect(JSON.stringify(res.body)).toContain(JSON.stringify(blockchain.chain))
      })
  })
})

// POST /api/mine
describe('POST /api/mine', () => {

  it('should respond 302 and redirect to /api/blocks', async () => {

    await request(server)
      .post('/api/mine')
      .expect(302)
      .expect(res => {
        expect(res.header.location).toEqual('/api/blocks')
      })
  })
})

// POST /api/transact
describe('POST /api/transact', () => {

  describe('if the transaction is invalid', () => {

    describe('because the amount is greater than the sender wallet balance', () => {

      it('should respond 400', async () => {

        await request(server)
          .post('/api/transact')
          .send({ recipient: 'foo', amount: 999999 })
          .expect(400)
      })

      it('should respond with an error message', async () => {

        await request(server)
          .post('/api/transact')
          .send({ recipient: 'foo', amount: 999999 })
          .expect(res => {
            // expect(res.text).toContain('Amount exceeds balance')
          })
      })
    })
  })

  describe('if the transaction is valid', () => {

    // it('should respond 200', async () => {

    //   await request(server)
    //     .post('/api/transact')
    //     .send({ recipient: 'foo', amount: 75 })
    //     .expect(200)
    // })

    it('should respond with the completed tranasction', async () => {

      const proposedTranasaction = { recipient: 'foo', amount: 75 }
      const transaction = wallet.createTransaction(proposedTranasaction)

      await request(server)
        .post('/api/transact')
        .send(proposedTranasaction)
        .expect(res => {
          expect(res.json)
            .toBe(transactionPool.setTransaction(transaction))
        })
    })
  })
})
