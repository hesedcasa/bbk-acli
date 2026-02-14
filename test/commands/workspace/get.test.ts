import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('workspace:get', () => {
  let WorkspaceGet: any
  let readConfigStub: sinon.SinonStub
  let getWorkspaceStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {slug: 'my-workspace', name: 'My Workspace'}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    getWorkspaceStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/workspace/get.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        getWorkspace: getWorkspaceStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    WorkspaceGet = imported.default
  })

  it('calls getWorkspace with correct args and outputs JSON', async () => {
    const oclifConfig = {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any
    const cmd = new WorkspaceGet(['my-workspace'], oclifConfig)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(getWorkspaceStub.calledOnce).to.be.true
    expect(getWorkspaceStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-workspace'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const oclifConfig = {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any
    const cmd = new WorkspaceGet(['my-workspace'], oclifConfig)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(getWorkspaceStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const oclifConfig = {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any
    const cmd = new WorkspaceGet(['my-workspace', '--toon'], oclifConfig)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(getWorkspaceStub.calledOnce).to.be.true
    expect(getWorkspaceStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-workspace'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
