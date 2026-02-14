import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('pipeline:get', () => {
  let PipelineGet: any
  let readConfigStub: sinon.SinonStub
  let getPipelineStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {uuid: '{pipe-uuid}', state: {name: 'COMPLETED'}}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    getPipelineStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/pipeline/get.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        getPipeline: getPipelineStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    PipelineGet = imported.default
  })

  it('calls getPipeline with correct args and outputs JSON', async () => {
    const cmd = new PipelineGet(['{pipe-uuid}', 'my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(getPipelineStub.calledOnce).to.be.true
    expect(getPipelineStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo', '{pipe-uuid}'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new PipelineGet(['{pipe-uuid}', 'my-repo', 'my-ws'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(getPipelineStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new PipelineGet(['{pipe-uuid}', 'my-repo', 'my-ws', '--toon'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(getPipelineStub.calledOnce).to.be.true
    expect(getPipelineStub.firstCall.args).to.deep.equal([mockConfig.auth, 'my-ws', 'my-repo', '{pipe-uuid}'])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
