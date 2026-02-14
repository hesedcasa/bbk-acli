import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('pr:update', () => {
  let PrUpdate: any
  let readConfigStub: sinon.SinonStub
  let updatePullRequestStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {id: 42, title: 'Updated title'}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    updatePullRequestStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/pr/update.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        updatePullRequest: updatePullRequestStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    PrUpdate = imported.default
  })

  it('calls updatePullRequest with title flag and outputs JSON', async () => {
    const cmd = new PrUpdate(
      ['42', 'my-repo', 'my-ws', '--title', 'Updated title'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(updatePullRequestStub.calledOnce).to.be.true
    expect(updatePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      {title: 'Updated title'},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('calls updatePullRequest with both title and description flags', async () => {
    const cmd = new PrUpdate(
      ['42', 'my-repo', 'my-ws', '--title', 'New title', '-d', 'New description'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(updatePullRequestStub.calledOnce).to.be.true
    expect(updatePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      {description: 'New description', title: 'New title'},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
  })

  it('calls updatePullRequest with empty fields when no optional flags provided', async () => {
    const cmd = new PrUpdate(
      ['42', 'my-repo', 'my-ws'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(updatePullRequestStub.calledOnce).to.be.true
    expect(updatePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      {},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new PrUpdate(
      ['42', 'my-repo', 'my-ws', '--title', 'Updated title'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(updatePullRequestStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new PrUpdate(
      ['42', 'my-repo', 'my-ws', '--title', 'Updated title', '--toon'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(updatePullRequestStub.calledOnce).to.be.true
    expect(updatePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      {title: 'Updated title'},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
