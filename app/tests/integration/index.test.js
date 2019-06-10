const request = require('supertest')
let server

describe('/', () => {

  beforeEach(async () => server = await require('../../app'))
  afterEach(async () => await server.close())

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
