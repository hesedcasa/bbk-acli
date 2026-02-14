import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('pr:create', () => {
  let PrCreate: any
  let readConfigStub: sinon.SinonStub
  let createPullRequestStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {id: 1, title: 'My PR'}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    createPullRequestStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/pr/create.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        createPullRequest: createPullRequestStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    PrCreate = imported.default
  })

  it('calls createPullRequest with correct args and outputs JSON', async () => {
    const cmd = new PrCreate(
      ['my-repo', 'my-ws', '--title', 'My PR', '--source', 'feature', '--destination', 'main'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(createPullRequestStub.calledOnce).to.be.true
    expect(createPullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      'My PR',
      'feature',
      'main',
      undefined,
      false,
      undefined,
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('passes optional flags correctly', async () => {
    const cmd = new PrCreate(
      [
        'my-repo',
        'my-ws',
        '--title',
        'My PR',
        '--source',
        'feature',
        '--destination',
        'main',
        '-d',
        'A description',
        '--close-source-branch',
        '--reviewers',
        'uuid1, uuid2, uuid3',
      ],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(createPullRequestStub.calledOnce).to.be.true
    expect(createPullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      'My PR',
      'feature',
      'main',
      'A description',
      true,
      ['uuid1', 'uuid2', 'uuid3'],
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new PrCreate(
      ['my-repo', 'my-ws', '--title', 'My PR', '--source', 'feature', '--destination', 'main'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(createPullRequestStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new PrCreate(
      ['my-repo', 'my-ws', '--title', 'My PR', '--source', 'feature', '--destination', 'main', '--toon'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(createPullRequestStub.calledOnce).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
