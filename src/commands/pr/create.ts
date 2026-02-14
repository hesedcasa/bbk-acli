import {Args, Command, Flags} from '@oclif/core'

import {clearClients, createPullRequest} from '../../bitbucket/bitbucket-client.js'
import {readConfig} from '../../config.js'
import {formatAsToon} from '../../format.js'

export default class PrCreate extends Command {
  static override args = {
    repoSlug: Args.string({description: 'Repository slug', required: true}),
    workspace: Args.string({description: 'Workspace slug or UUID', required: true}),
  }
  static override description = 'Create a new pull request'
  static override examples = [
    '<%= config.bin %> <%= command.id %> my-workspace my-repo --title "My PR" --source feature-branch --destination main',
  ]
  static override flags = {
    'close-source-branch': Flags.boolean({
      default: false,
      description: 'Close source branch after merge',
      required: false,
    }),
    description: Flags.string({char: 'd', description: 'Pull request description', required: false}),
    destination: Flags.string({description: 'Destination branch name', required: true}),
    reviewers: Flags.string({description: 'Comma-separated list of reviewer UUIDs', required: false}),
    source: Flags.string({description: 'Source branch name', required: true}),
    title: Flags.string({description: 'Pull request title', required: true}),
    toon: Flags.boolean({description: 'Format output as toon', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PrCreate)
    const config = await readConfig(this.config.configDir, this.log.bind(this))
    if (!config) {
      return
    }

    const reviewers = flags.reviewers ? flags.reviewers.split(',').map((r) => r.trim()) : undefined

    const result = await createPullRequest(
      config.auth,
      args.workspace,
      args.repoSlug,
      flags.title,
      flags.source,
      flags.destination,
      flags.description,
      flags['close-source-branch'],
      reviewers,
    )
    clearClients()

    if (flags.toon) {
      this.log(formatAsToon(result))
    } else {
      this.logJson(result)
    }
  }
}
