/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('auth:add', () => {
  let AuthAdd: any
  let testConnectionStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let fsStub: Record<string, sinon.SinonStub>
  let actionStartStub: sinon.SinonStub
  let actionStopStub: sinon.SinonStub

  beforeEach(async () => {
    testConnectionStub = sinon.stub()
    clearClientsStub = sinon.stub()
    actionStartStub = sinon.stub()
    actionStopStub = sinon.stub()
    fsStub = {
      createFile: sinon.stub().resolves(),
      pathExists: sinon.stub().resolves(false),
      readJSON: sinon.stub().resolves({auth: {apiToken: 'tok', email: 'e@e.com'}}),
      writeJSON: sinon.stub().resolves(),
    }

    const imported = await esmock('../../../src/commands/auth/add.js', {
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        testConnection: testConnectionStub,
      },
      '@oclif/core/ux': {action: {start: actionStartStub, stop: actionStopStub}},
      'fs-extra': {default: fsStub},
    })
    AuthAdd = imported.default
  })

  it('writes config and shows success on valid auth', async () => {
    testConnectionStub.resolves({data: {username: 'user'}, success: true})

    const cmd = new AuthAdd(['-t', 'my-token', '-e', 'user@test.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({failures: [], successes: []}),
    } as any)
    const logStub = sinon.stub(cmd, 'log')

    const result = await cmd.run()

    expect(fsStub.pathExists.calledOnce).to.be.true
    expect(fsStub.createFile.calledOnce).to.be.true
    expect(fsStub.writeJSON.calledOnce).to.be.true
    const writtenData = fsStub.writeJSON.firstCall.args[1]
    expect(writtenData.auth.apiToken).to.equal('my-token')
    expect(writtenData.auth.email).to.equal('user@test.com')
    expect(testConnectionStub.calledOnce).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(actionStopStub.calledWith('✓ successful')).to.be.true
    expect(logStub.calledWith('Authentication added successfully')).to.be.true
    expect(result.success).to.be.true
  })

  it('does not create file if config already exists', async () => {
    fsStub.pathExists.resolves(true)
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AuthAdd(['-t', 'tok', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({failures: [], successes: []}),
    } as any)
    sinon.stub(cmd, 'log')

    await cmd.run()

    expect(fsStub.createFile.called).to.be.false
    expect(fsStub.writeJSON.calledOnce).to.be.true
  })

  it('shows error on failed auth test', async () => {
    testConnectionStub.resolves({error: 'Unauthorized', success: false})

    const cmd = new AuthAdd(['-t', 'bad', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({failures: [], successes: []}),
    } as any)
    sinon.stub(cmd, 'log')
    const errorStub = sinon.stub(cmd, 'error')

    await cmd.run()

    expect(actionStopStub.calledWith('✗ failed')).to.be.true
    expect(errorStub.calledWith('Authentication is invalid. Please check your email, API Token, and URL.')).to.be.true
  })

  it('writes config with owner-only permissions', async () => {
    testConnectionStub.resolves({data: {}, success: true})

    const cmd = new AuthAdd(['-t', 'tok', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({failures: [], successes: []}),
    } as any)
    sinon.stub(cmd, 'log')

    await cmd.run()

    const writeOptions = fsStub.writeJSON.firstCall.args[2]
    expect(writeOptions.mode).to.equal(0o600)
  })
})
