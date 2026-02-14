import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('workspace:list', () => {
  let WorkspaceList: any
  let readConfigStub: sinon.SinonStub
  let listWorkspacesStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {
    data: {values: [{slug: 'ws-1'}, {slug: 'ws-2'}]},
    success: true,
  }

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    listWorkspacesStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/workspace/list.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        listWorkspaces: listWorkspacesStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    WorkspaceList = imported.default
  })

  it('calls listWorkspaces with correct args and outputs JSON', async () => {
    const oclifConfig = {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any
    const cmd = new WorkspaceList([], oclifConfig)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(listWorkspacesStub.calledOnce).to.be.true
    expect(listWorkspacesStub.firstCall.args).to.deep.equal([mockConfig.auth, 1, 10])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const oclifConfig = {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any
    const cmd = new WorkspaceList([], oclifConfig)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(listWorkspacesStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const oclifConfig = {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any
    const cmd = new WorkspaceList(['--toon'], oclifConfig)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(listWorkspacesStub.calledOnce).to.be.true
    expect(listWorkspacesStub.firstCall.args).to.deep.equal([mockConfig.auth, 1, 10])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
