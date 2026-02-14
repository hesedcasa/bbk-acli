import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('pipeline:list', () => {
  let PipelineList: any
  let readConfigStub: sinon.SinonStub
  let listPipelinesStub: sinon.SinonStub
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
    data: {values: [{uuid: '{pipe-1}'}, {uuid: '{pipe-2}'}]},
    success: true,
  }

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    listPipelinesStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/pipeline/list.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        listPipelines: listPipelinesStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    PipelineList = imported.default
  })

  it('calls listPipelines with correct args and outputs JSON', async () => {
    const cmd = new PipelineList(['my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(listPipelinesStub.calledOnce).to.be.true
    expect(listPipelinesStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo', 1, 10, undefined])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('passes custom page, pagelen, and sort flags', async () => {
    const cmd = new PipelineList(['my-repo', 'my-ws', '--page', '3', '--pagelen', '25', '--sort', 'created_on'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(listPipelinesStub.calledOnce).to.be.true
    expect(listPipelinesStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo', 3, 25, 'created_on'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new PipelineList(['my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(listPipelinesStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new PipelineList(['my-repo', 'my-ws', '--toon'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(listPipelinesStub.calledOnce).to.be.true
    expect(listPipelinesStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo', 1, 10, undefined])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
