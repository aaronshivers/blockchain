const request = require('supertest')
const app = require('../../app')

describe('/', () => {

  // GET /
  describe('GET /', () => {

    it('should respond 200', async () => {

      await request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Hello')
        })
    })
  })
})
