import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('repo:create', () => {
  let RepoCreate: any
  let readConfigStub: sinon.SinonStub
  let createRepositoryStub: sinon.SinonStub
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
    createRepositoryStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/repo/create.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        createRepository: createRepositoryStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    RepoCreate = imported.default
  })

  it('calls createRepository with correct args and outputs JSON', async () => {
    const cmd = new RepoCreate(['my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(createRepositoryStub.calledOnce).to.be.true
    expect(createRepositoryStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      {description: undefined, isPrivate: false, language: undefined, projectKey: undefined},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new RepoCreate(['my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(createRepositoryStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new RepoCreate(['my-repo', 'my-ws', '--toon'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(createRepositoryStub.calledOnce).to.be.true
    expect(createRepositoryStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      {description: undefined, isPrivate: false, language: undefined, projectKey: undefined},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
