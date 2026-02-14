import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('auth:test', () => {
  let AuthTest: any
  let readConfigStub: sinon.SinonStub
  let testConnectionStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let actionStartStub: sinon.SinonStub
  let actionStopStub: sinon.SinonStub

  const mockConfig = {
    auth: {apiToken: 'test-token', email: 'test@example.com', host: 'https://bitbucket.org'},
  }

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    testConnectionStub = sinon.stub()
    clearClientsStub = sinon.stub()
    actionStartStub = sinon.stub()
    actionStopStub = sinon.stub()

    const imported = await esmock('../../../src/commands/auth/test.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        testConnection: testConnectionStub,
      },
      '@oclif/core/ux': {action: {start: actionStartStub, stop: actionStopStub}},
    })
    AuthTest = imported.default
  })

  it('shows success on valid connection', async () => {
    testConnectionStub.resolves({data: {username: 'user'}, success: true})

    const cmd = new AuthTest([], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    const result = await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(testConnectionStub.calledWith(mockConfig.auth)).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(actionStopStub.calledWith('✓ successful')).to.be.true
    expect(logStub.calledWith('Successful connection to Bitbucket')).to.be.true
    expect(result.success).to.be.true
  })

  it('shows error on failed connection', async () => {
    testConnectionStub.resolves({error: 'Unauthorized', success: false})

    const cmd = new AuthTest([], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    sinon.stub(cmd, 'log')
    const errorStub = sinon.stub(cmd, 'error')

    await cmd.run()

    expect(actionStopStub.calledWith('✗ failed')).to.be.true
    expect(errorStub.calledWith('Failed to connect to Bitbucket.')).to.be.true
  })

  it('returns error result when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new AuthTest([], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    sinon.stub(cmd, 'log')

    const result = await cmd.run()

    expect(result.success).to.be.false
    expect(result.error).to.equal('Missing authentication config')
    expect(testConnectionStub.called).to.be.false
  })
})
