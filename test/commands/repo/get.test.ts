import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('repo:get', () => {
  let RepoGet: any
  let readConfigStub: sinon.SinonStub
  let getRepositoryStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {slug: 'my-repo', full_name: 'my-ws/my-repo'}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    getRepositoryStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/repo/get.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        getRepository: getRepositoryStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    RepoGet = imported.default
  })

  it('calls getRepository with correct args and outputs JSON', async () => {
    const cmd = new RepoGet(['my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(getRepositoryStub.calledOnce).to.be.true
    expect(getRepositoryStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new RepoGet(['my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(getRepositoryStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new RepoGet(['my-repo', 'my-ws', '--toon'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(getRepositoryStub.calledOnce).to.be.true
    expect(getRepositoryStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
