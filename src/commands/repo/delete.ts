import {Args, Command, Flags} from '@oclif/core'

import {clearClients, deleteRepository} from '../../bitbucket/bitbucket-client.js'
import {readConfig} from '../../config.js'
import {formatAsToon} from '../../format.js'

export default class RepoDelete extends Command {
  static override args = {
    repoSlug: Args.string({description: 'Repository slug', required: true}),
    workspace: Args.string({description: 'Workspace slug or UUID', required: true}),
  }
  static override description = 'Delete a repository'
  static override examples = ['<%= config.bin %> <%= command.id %> my-workspace my-repo']
  static override flags = {
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(RepoDelete)
    const config = await readConfig(this.config.configDir, this.log.bind(this))
    if (!config) {
      return
    }

    const result = await deleteRepository(config.auth, args.workspace, args.repoSlug)
    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
