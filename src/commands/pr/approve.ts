import {Args, Command, Flags} from '@oclif/core'

import {approvePullRequest, clearClients} from '../../bitbucket/bitbucket-client.js'
import {readConfig} from '../../config.js'
import {formatAsToon} from '../../format.js'

export default class PrApprove extends Command {
  static override args = {
    pullRequestId: Args.integer({description: 'Pull request ID', required: true}),
    repoSlug: Args.string({description: 'Repository slug', required: true}),
    workspace: Args.string({description: 'Workspace slug or UUID', required: true}),
  }
  static override description = 'Approve a pull request'
  static override examples = ['<%= config.bin %> <%= command.id %> my-workspace my-repo 1']
  static override flags = {
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PrApprove)
    const config = await readConfig(this.config.configDir, this.log.bind(this))
    if (!config) {
      return
    }

    const result = await approvePullRequest(config.auth, args.workspace, args.repoSlug, args.pullRequestId)
    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
