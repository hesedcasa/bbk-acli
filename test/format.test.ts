import {expect} from 'chai'

import {formatAsToon} from '../src/format.js'

describe('format', () => {
  describe('formatAsToon', () => {
    it('returns empty string for null data', () => {
      expect(formatAsToon(null)).to.equal('')
    })

    it('returns empty string for undefined data', () => {
      const val = undefined
      expect(formatAsToon(val)).to.equal('')
    })

    it('encodes data as TOON', () => {
      const data = {key: 'value'}
      const result = formatAsToon(data)
      expect(result).to.be.a('string')
      expect(result.length).to.be.greaterThan(0)
    })
  })
})
