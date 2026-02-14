import {expect} from 'chai'

import {BitbucketApi} from '../../src/bitbucket/bitbucket-api.js'

describe('BitbucketApi', () => {
  it('creates an instance with config', () => {
    const api = new BitbucketApi({
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    })
    expect(api).to.be.instanceOf(BitbucketApi)
  })

  it('clearClients does not throw', () => {
    const api = new BitbucketApi({
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    })
    expect(() => api.clearClients()).to.not.throw()
  })
})
