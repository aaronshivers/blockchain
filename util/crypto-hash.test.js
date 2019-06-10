const cryptoHash = require('./crypto-hash')

describe('cryptoHash()', () => {

  const hash = '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'

  it('generates a SHA-256 hashed output', () => {

    expect(cryptoHash('foo')).toEqual(hash)
  })

  it('produced the same hash with the same arguments in any order', () => {

    expect(cryptoHash('one', 'two', 'three'))
      .toEqual(cryptoHash('three', 'one', 'two'))
  })
})
