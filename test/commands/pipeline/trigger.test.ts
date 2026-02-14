import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('pipeline:trigger', () => {
  let PipelineTrigger: any
  let readConfigStub: sinon.SinonStub
  let triggerPipelineStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let formatAsToonStub: sinon.SinonStub

  const mockConfig = {
    auth: {
      apiToken: 'test-token',
      email: 'test@example.com',
      host: 'https://bitbucket.org',
    },
  }

  const mockResult = {data: {uuid: '{triggered-pipe}', state: {name: 'PENDING'}}, success: true}

  beforeEach(async () => {
    readConfigStub = sinon.stub().resolves(mockConfig)
    triggerPipelineStub = sinon.stub().resolves(mockResult)
    clearClientsStub = sinon.stub()
    formatAsToonStub = sinon.stub().returns('toon-output')

    const imported = await esmock('../../../src/commands/pipeline/trigger.js', {
      '../../../src/config.js': {readConfig: readConfigStub},
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        triggerPipeline: triggerPipelineStub,
      },
      '../../../src/format.js': {formatAsToon: formatAsToonStub},
    })
    PipelineTrigger = imported.default
  })

  it('calls triggerPipeline with correct args and outputs JSON', async () => {
    const cmd = new PipelineTrigger(['my-repo', 'my-ws', '--branch', 'main'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(triggerPipelineStub.calledOnce).to.be.true
    expect(triggerPipelineStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      {refName: 'main', refType: 'branch'},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
    expect(logJsonStub.firstCall.args[0]).to.deep.equal(mockResult)
  })

  it('includes custom selector when --custom flag is provided', async () => {
    const cmd = new PipelineTrigger(['my-repo', 'my-ws', '--branch', 'main', '--custom', 'my-pipeline'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(triggerPipelineStub.calledOnce).to.be.true
    expect(triggerPipelineStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      {refName: 'main', refType: 'branch', selector: {pattern: 'my-pipeline', type: 'custom'}},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(logJsonStub.calledOnce).to.be.true
  })

  it('returns early when config is missing', async () => {
    readConfigStub.resolves(null)

    const cmd = new PipelineTrigger(['my-repo', 'my-ws', '--branch', 'main'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logJsonStub = sinon.stub(cmd, 'logJson')

    await cmd.run()

    expect(readConfigStub.calledOnce).to.be.true
    expect(triggerPipelineStub.called).to.be.false
    expect(clearClientsStub.called).to.be.false
    expect(logJsonStub.called).to.be.false
  })

  it('outputs TOON format when --toon flag is used', async () => {
    const cmd = new PipelineTrigger(['my-repo', 'my-ws', '--branch', 'main', '--toon'], {root: process.cwd(), runHook: sinon.stub().resolves({successes: [], failures: []})} as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(triggerPipelineStub.calledOnce).to.be.true
    expect(triggerPipelineStub.firstCall.args).to.deep.equal([
      mockConfig.auth,
      'my-ws',
      'my-repo',
      {refName: 'main', refType: 'branch'},
    ])
    expect(clearClientsStub.calledOnce).to.be.true
    expect(formatAsToonStub.calledOnce).to.be.true
    expect(formatAsToonStub.firstCall.args[0]).to.deep.equal(mockResult)
    expect(logStub.calledWith('toon-output')).to.be.true
  })
})
