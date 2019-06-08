const Block = require('./block')
const { GENESIS_DATA } = require('./config')

describe('Block', () => {

  const timestamp = 'DATE'
  const lastHash = 'LASTHASH'
  const hash = 'HASH'
  const data = ['BLOCKHAIN', 'DATA']
  const block = new Block({ timestamp, lastHash, hash, data })

  it('has a timestamp, lastHash, hash, and data properties', () => {

    expect(block.timestamp).toEqual(timestamp)
    expect(block.lastHash).toEqual(lastHash)
    expect(block.hash).toEqual(hash)
    expect(block.data).toEqual(data)
  })

  describe('genesis()', () => {

    const genesisBlock = Block.genesis()

    console.log('genesisBlock', genesisBlock)

    it('returns a Block instance', () => {

      expect(genesisBlock instanceof Block).toBe(true)
    })

    it('returns a the genesis data', () => {

      expect(genesisBlock).toEqual(GENESIS_DATA)
    })
  })
})
