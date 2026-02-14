import {expect} from 'chai'

import {clearClients} from '../../src/bitbucket/bitbucket-client.js'

describe('bitbucket-client', () => {
  it('clearClients does not throw', () => {
    expect(() => clearClients()).to.not.throw()
  })
})
