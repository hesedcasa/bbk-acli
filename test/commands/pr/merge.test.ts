import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('pr:merge', () => {
  let PrMerge: any
  let readConfigStub: sinon.SinonStub
  let mergePullRequestStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {state: 'MERGED'}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    mergePullRequestStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/pr/merge.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        mergePullRequest: mergePullRequestStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    PrMerge = imported.default
  })

  it('calls mergePullRequest with correct args and outputs JSON', async () => {
    const cmd = new PrMerge(['42', 'my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(mergePullRequestStub.calledOnce).to.be.true
    expect(mergePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      undefined,
      false,
      undefined,
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('passes optional flags correctly', async () => {
    const cmd = new PrMerge(
      ['42', 'my-repo', 'my-ws', '--strategy', 'squash', '--close-source-branch', '-m', 'Squash merge'],
      {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any,
    )
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(mergePullRequestStub.calledOnce).to.be.true
    expect(mergePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      'squash',
      true,
      'Squash merge',
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new PrMerge(['42', 'my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(mergePullRequestStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new PrMerge(['42', 'my-repo', 'my-ws', '--toon'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(mergePullRequestStub.calledOnce).to.be.true
    expect(mergePullRequestStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      42,
      undefined,
      false,
      undefined,
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
