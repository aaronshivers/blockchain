const request = require('supertest')
let server

const Blockchain = require('../../blockchain')
const blockchain = new Blockchain()

beforeEach(() => server = require('../../app'))
afterEach(() => server.close())

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
