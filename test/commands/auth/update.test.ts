import {expect} from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

describe('auth:update', () => {
  let AuthUpdate: any
  let testConnectionStub: sinon.SinonStub
  let clearClientsStub: sinon.SinonStub
  let fsStub: Record<string, sinon.SinonStub>
  let confirmStub: sinon.SinonStub
  let actionStartStub: sinon.SinonStub
  let actionStopStub: sinon.SinonStub

  const existingConfig = {auth: {apiToken: 'old-token', email: 'old@test.com'}}

  beforeEach(async () => {
    testConnectionStub = sinon.stub()
    clearClientsStub = sinon.stub()
    confirmStub = sinon.stub().resolves(true)
    actionStartStub = sinon.stub()
    actionStopStub = sinon.stub()
    fsStub = {
      readJSON: sinon.stub().resolves(existingConfig),
      writeJSON: sinon.stub().resolves(),
    }

    const imported = await esmock('../../../src/commands/auth/update.js', {
      '../../../src/bitbucket/bitbucket-client.js': {
        clearClients: clearClientsStub,
        testConnection: testConnectionStub,
      },
      '@inquirer/prompts': {confirm: confirmStub, input: sinon.stub()},
      '@oclif/core/ux': {action: {start: actionStartStub, stop: actionStopStub}},
      'fs-extra': {default: fsStub},
    })
    AuthUpdate = imported.default
  })

  it('updates config and shows success on valid auth', async () => {
    testConnectionStub.resolves({data: {username: 'user'}, success: true})

    const cmd = new AuthUpdate(['-t', 'new-token', '-e', 'new@test.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({successes: [], failures: []}),
    } as any)
    const logStub = sinon.stub(cmd, 'log')

    const result = await cmd.run()

    expect(fsStub.readJSON.calledOnce).to.be.false // readJSON called twice (read existing + read after write)
    expect(confirmStub.calledOnce).to.be.true
    expect(fsStub.writeJSON.calledOnce).to.be.true
    const writtenData = fsStub.writeJSON.firstCall.args[1]
    expect(writtenData.auth.apiToken).to.equal('new-token')
    expect(writtenData.auth.email).to.equal('new@test.com')
    expect(testConnectionStub.calledOnce).to.be.true
    expect(clearClientsStub.calledOnce).to.be.true
    expect(actionStopStub.calledWith('✓ successful')).to.be.true
    expect(logStub.calledWith('Authentication updated successfully')).to.be.true
    expect(result.success).to.be.true
  })

  it('returns early when user declines confirmation', async () => {
    confirmStub.resolves(false)

    const cmd = new AuthUpdate(['-t', 'tok', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({successes: [], failures: []}),
    } as any)
    sinon.stub(cmd, 'log')

    const result = await cmd.run()

    expect(fsStub.writeJSON.called).to.be.false
    expect(testConnectionStub.called).to.be.false
    expect(result).to.be.undefined
  })

  it('shows "Run auth:add" when config file not found', async () => {
    fsStub.readJSON.rejects(new Error('ENOENT: no such file or directory'))

    const cmd = new AuthUpdate(['-t', 'tok', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({successes: [], failures: []}),
    } as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith('Run auth:add instead')).to.be.true
    expect(fsStub.writeJSON.called).to.be.false
  })

  it('shows error message for other read errors', async () => {
    fsStub.readJSON.rejects(new Error('Permission denied'))

    const cmd = new AuthUpdate(['-t', 'tok', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({successes: [], failures: []}),
    } as any)
    const logStub = sinon.stub(cmd, 'log')

    await cmd.run()

    expect(logStub.calledWith('Permission denied')).to.be.true
    expect(fsStub.writeJSON.called).to.be.false
  })

  it('shows error on failed auth test after update', async () => {
    testConnectionStub.resolves({error: 'Unauthorized', success: false})

    const cmd = new AuthUpdate(['-t', 'bad', '-e', 'e@e.com'], {
      configDir: '/tmp/test-config',
      root: process.cwd(),
      runHook: sinon.stub().resolves({successes: [], failures: []}),
    } as any)
    sinon.stub(cmd, 'log')
    const errorStub = sinon.stub(cmd, 'error')

    await cmd.run()

    expect(actionStopStub.calledWith('✗ failed')).to.be.true
    expect(errorStub.calledWith('Authentication is invalid. Please check your email, API Token, and URL.')).to.be.true
  })
})
