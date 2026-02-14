# bb-acli

CLI for Bitbucket API interaction

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [bb-acli](#bb-acli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g bb-acli
$ bb-acli COMMAND
running command...
$ bb-acli (--version)
bb-acli/0.0.0 darwin-arm64 node-v22.14.0
$ bb-acli --help [COMMAND]
USAGE
  $ bb-acli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bb-acli auth add`](#bb-acli-auth-add)
* [`bb-acli auth test`](#bb-acli-auth-test)
* [`bb-acli auth update`](#bb-acli-auth-update)
* [`bb-acli commands`](#bb-acli-commands)
* [`bb-acli help [COMMAND]`](#bb-acli-help-command)
* [`bb-acli pipeline get PIPELINEUUID REPOSLUG WORKSPACE`](#bb-acli-pipeline-get-pipelineuuid-reposlug-workspace)
* [`bb-acli pipeline list REPOSLUG WORKSPACE`](#bb-acli-pipeline-list-reposlug-workspace)
* [`bb-acli pipeline trigger REPOSLUG WORKSPACE`](#bb-acli-pipeline-trigger-reposlug-workspace)
* [`bb-acli pr approve PULLREQUESTID REPOSLUG WORKSPACE`](#bb-acli-pr-approve-pullrequestid-reposlug-workspace)
* [`bb-acli pr create REPOSLUG WORKSPACE`](#bb-acli-pr-create-reposlug-workspace)
* [`bb-acli pr decline PULLREQUESTID REPOSLUG WORKSPACE`](#bb-acli-pr-decline-pullrequestid-reposlug-workspace)
* [`bb-acli pr get PULLREQUESTID REPOSLUG WORKSPACE`](#bb-acli-pr-get-pullrequestid-reposlug-workspace)
* [`bb-acli pr list REPOSLUG WORKSPACE`](#bb-acli-pr-list-reposlug-workspace)
* [`bb-acli pr merge PULLREQUESTID REPOSLUG WORKSPACE`](#bb-acli-pr-merge-pullrequestid-reposlug-workspace)
* [`bb-acli pr unapprove PULLREQUESTID REPOSLUG WORKSPACE`](#bb-acli-pr-unapprove-pullrequestid-reposlug-workspace)
* [`bb-acli pr update PULLREQUESTID REPOSLUG WORKSPACE`](#bb-acli-pr-update-pullrequestid-reposlug-workspace)
* [`bb-acli repo create REPOSLUG WORKSPACE`](#bb-acli-repo-create-reposlug-workspace)
* [`bb-acli repo delete REPOSLUG WORKSPACE`](#bb-acli-repo-delete-reposlug-workspace)
* [`bb-acli repo get REPOSLUG WORKSPACE`](#bb-acli-repo-get-reposlug-workspace)
* [`bb-acli repo list WORKSPACE`](#bb-acli-repo-list-workspace)
* [`bb-acli update [CHANNEL]`](#bb-acli-update-channel)
* [`bb-acli version`](#bb-acli-version)
* [`bb-acli workspace get WORKSPACE`](#bb-acli-workspace-get-workspace)
* [`bb-acli workspace list`](#bb-acli-workspace-list)

## `bb-acli auth add`

Add Atlassian authentication

```
USAGE
  $ bb-acli auth add [--json] [-e <value>] [-t <value>] [-u <value>]

FLAGS
  -e, --email=<value>  Account email:
  -t, --token=<value>  API Token:
  -u, --url=<value>    Bitbucket URL (start with https://):

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Add Atlassian authentication

EXAMPLES
  $ bb-acli auth add
```

_See code: [src/commands/auth/add.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/auth/add.ts)_

## `bb-acli auth test`

Test authentication and connection

```
USAGE
  $ bb-acli auth test [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Test authentication and connection

EXAMPLES
  $ bb-acli auth test
```

_See code: [src/commands/auth/test.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/auth/test.ts)_

## `bb-acli auth update`

Update existing authentication

```
USAGE
  $ bb-acli auth update [--json] [-e <value>] [-t <value>] [-u <value>]

FLAGS
  -e, --email=<value>  Account email
  -t, --token=<value>  API Token
  -u, --url=<value>    Bitbucket URL (start with https://)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Update existing authentication

EXAMPLES
  $ bb-acli auth update
```

_See code: [src/commands/auth/update.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/auth/update.ts)_

## `bb-acli commands`

List all bb-acli commands.

```
USAGE
  $ bb-acli commands [--json] [-c id|plugin|summary|type... | --tree] [--deprecated] [-x | ] [--hidden]
    [--no-truncate | ] [--sort id|plugin|summary|type | ]

FLAGS
  -c, --columns=<option>...  Only show provided columns (comma-separated).
                             <options: id|plugin|summary|type>
  -x, --extended             Show extra columns.
      --deprecated           Show deprecated commands.
      --hidden               Show hidden commands.
      --no-truncate          Do not truncate output.
      --sort=<option>        [default: id] Property to sort by.
                             <options: id|plugin|summary|type>
      --tree                 Show tree of commands.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all bb-acli commands.
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v4.1.40/src/commands/commands.ts)_

## `bb-acli help [COMMAND]`

Display help for bb-acli.

```
USAGE
  $ bb-acli help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bb-acli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.37/src/commands/help.ts)_

## `bb-acli pipeline get PIPELINEUUID REPOSLUG WORKSPACE`

Get details of a specific pipeline

```
USAGE
  $ bb-acli pipeline get PIPELINEUUID REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  PIPELINEUUID  Pipeline UUID
  REPOSLUG      Repository slug
  WORKSPACE     Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Get details of a specific pipeline

EXAMPLES
  $ bb-acli pipeline get my-workspace my-repo {uuid}
```

_See code: [src/commands/pipeline/get.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pipeline/get.ts)_

## `bb-acli pipeline list REPOSLUG WORKSPACE`

List pipelines for a repository

```
USAGE
  $ bb-acli pipeline list REPOSLUG WORKSPACE [--page <value>] [--pagelen <value>] [--sort <value>] [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  --page=<value>     [default: 1] Page number
  --pagelen=<value>  [default: 10] Number of items per page
  --sort=<value>     Sort field (e.g., created_on)
  --toon             Format output as toon

DESCRIPTION
  List pipelines for a repository

EXAMPLES
  $ bb-acli pipeline list my-workspace my-repo
```

_See code: [src/commands/pipeline/list.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pipeline/list.ts)_

## `bb-acli pipeline trigger REPOSLUG WORKSPACE`

Trigger a pipeline run

```
USAGE
  $ bb-acli pipeline trigger REPOSLUG WORKSPACE --branch <value> [--custom <value>] [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  --branch=<value>  (required) Branch name to run pipeline on
  --custom=<value>  Custom pipeline pattern name
  --toon            Format output as toon

DESCRIPTION
  Trigger a pipeline run

EXAMPLES
  $ bb-acli pipeline trigger my-workspace my-repo --branch main

  $ bb-acli pipeline trigger my-workspace my-repo --branch main --custom my-pipeline
```

_See code: [src/commands/pipeline/trigger.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pipeline/trigger.ts)_

## `bb-acli pr approve PULLREQUESTID REPOSLUG WORKSPACE`

Approve a pull request

```
USAGE
  $ bb-acli pr approve PULLREQUESTID REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  PULLREQUESTID  Pull request ID
  REPOSLUG       Repository slug
  WORKSPACE      Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Approve a pull request

EXAMPLES
  $ bb-acli pr approve my-workspace my-repo 1
```

_See code: [src/commands/pr/approve.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/approve.ts)_

## `bb-acli pr create REPOSLUG WORKSPACE`

Create a new pull request

```
USAGE
  $ bb-acli pr create REPOSLUG WORKSPACE --destination <value> --source <value> --title <value>
    [--close-source-branch] [-d <value>] [--reviewers <value>] [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  -d, --description=<value>  Pull request description
      --close-source-branch  Close source branch after merge
      --destination=<value>  (required) Destination branch name
      --reviewers=<value>    Comma-separated list of reviewer UUIDs
      --source=<value>       (required) Source branch name
      --title=<value>        (required) Pull request title
      --toon                 Format output as toon

DESCRIPTION
  Create a new pull request

EXAMPLES
  $ bb-acli pr create my-workspace my-repo --title "My PR" --source feature-branch --destination main
```

_See code: [src/commands/pr/create.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/create.ts)_

## `bb-acli pr decline PULLREQUESTID REPOSLUG WORKSPACE`

Decline a pull request

```
USAGE
  $ bb-acli pr decline PULLREQUESTID REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  PULLREQUESTID  Pull request ID
  REPOSLUG       Repository slug
  WORKSPACE      Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Decline a pull request

EXAMPLES
  $ bb-acli pr decline my-workspace my-repo 1
```

_See code: [src/commands/pr/decline.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/decline.ts)_

## `bb-acli pr get PULLREQUESTID REPOSLUG WORKSPACE`

Get details of a specific pull request

```
USAGE
  $ bb-acli pr get PULLREQUESTID REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  PULLREQUESTID  Pull request ID
  REPOSLUG       Repository slug
  WORKSPACE      Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Get details of a specific pull request

EXAMPLES
  $ bb-acli pr get my-workspace my-repo 1
```

_See code: [src/commands/pr/get.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/get.ts)_

## `bb-acli pr list REPOSLUG WORKSPACE`

List pull requests for a repository

```
USAGE
  $ bb-acli pr list REPOSLUG WORKSPACE [--page <value>] [--pagelen <value>] [--state <value>] [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  --page=<value>     [default: 1] Page number
  --pagelen=<value>  [default: 10] Number of items per page
  --state=<value>    Filter by state (OPEN, MERGED, DECLINED, SUPERSEDED)
  --toon             Format output as toon

DESCRIPTION
  List pull requests for a repository

EXAMPLES
  $ bb-acli pr list my-workspace my-repo
```

_See code: [src/commands/pr/list.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/list.ts)_

## `bb-acli pr merge PULLREQUESTID REPOSLUG WORKSPACE`

Merge a pull request

```
USAGE
  $ bb-acli pr merge PULLREQUESTID REPOSLUG WORKSPACE [--close-source-branch] [-m <value>] [--strategy
    merge_commit|squash|fast_forward] [--toon]

ARGUMENTS
  PULLREQUESTID  Pull request ID
  REPOSLUG       Repository slug
  WORKSPACE      Workspace slug or UUID

FLAGS
  -m, --message=<value>      Merge commit message
      --close-source-branch  Close source branch after merge
      --strategy=<option>    Merge strategy (merge_commit, squash, fast_forward)
                             <options: merge_commit|squash|fast_forward>
      --toon                 Format output as toon

DESCRIPTION
  Merge a pull request

EXAMPLES
  $ bb-acli pr merge my-workspace my-repo 1
```

_See code: [src/commands/pr/merge.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/merge.ts)_

## `bb-acli pr unapprove PULLREQUESTID REPOSLUG WORKSPACE`

Remove approval from a pull request

```
USAGE
  $ bb-acli pr unapprove PULLREQUESTID REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  PULLREQUESTID  Pull request ID
  REPOSLUG       Repository slug
  WORKSPACE      Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Remove approval from a pull request

EXAMPLES
  $ bb-acli pr unapprove my-workspace my-repo 1
```

_See code: [src/commands/pr/unapprove.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/unapprove.ts)_

## `bb-acli pr update PULLREQUESTID REPOSLUG WORKSPACE`

Update a pull request

```
USAGE
  $ bb-acli pr update PULLREQUESTID REPOSLUG WORKSPACE [-d <value>] [--title <value>] [--toon]

ARGUMENTS
  PULLREQUESTID  Pull request ID
  REPOSLUG       Repository slug
  WORKSPACE      Workspace slug or UUID

FLAGS
  -d, --description=<value>  Pull request description
      --title=<value>        Pull request title
      --toon                 Format output as toon

DESCRIPTION
  Update a pull request

EXAMPLES
  $ bb-acli pr update my-workspace my-repo 1 --title "Updated title"
```

_See code: [src/commands/pr/update.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/pr/update.ts)_

## `bb-acli repo create REPOSLUG WORKSPACE`

Create a new repository

```
USAGE
  $ bb-acli repo create REPOSLUG WORKSPACE [-d <value>] [--language <value>] [--private] [--project-key
    <value>] [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  -d, --description=<value>  Repository description
      --language=<value>     Repository language
      --private              Make repository private
      --project-key=<value>  Project key
      --toon                 Format output as toon

DESCRIPTION
  Create a new repository

EXAMPLES
  $ bb-acli repo create my-workspace my-repo

  $ bb-acli repo create my-workspace my-repo --private --description "My new repo"
```

_See code: [src/commands/repo/create.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/repo/create.ts)_

## `bb-acli repo delete REPOSLUG WORKSPACE`

Delete a repository

```
USAGE
  $ bb-acli repo delete REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Delete a repository

EXAMPLES
  $ bb-acli repo delete my-workspace my-repo
```

_See code: [src/commands/repo/delete.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/repo/delete.ts)_

## `bb-acli repo get REPOSLUG WORKSPACE`

Get details of a specific repository

```
USAGE
  $ bb-acli repo get REPOSLUG WORKSPACE [--toon]

ARGUMENTS
  REPOSLUG   Repository slug
  WORKSPACE  Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Get details of a specific repository

EXAMPLES
  $ bb-acli repo get my-workspace my-repo
```

_See code: [src/commands/repo/get.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/repo/get.ts)_

## `bb-acli repo list WORKSPACE`

List repositories in a workspace

```
USAGE
  $ bb-acli repo list WORKSPACE [--page <value>] [--pagelen <value>] [--q <value>] [--role <value>]
    [--toon]

ARGUMENTS
  WORKSPACE  Workspace slug or UUID

FLAGS
  --page=<value>     [default: 1] Page number
  --pagelen=<value>  [default: 10] Number of items per page
  --q=<value>        Query string to filter repositories
  --role=<value>     Filter by role (admin, contributor, member, owner)
  --toon             Format output as toon

DESCRIPTION
  List repositories in a workspace

EXAMPLES
  $ bb-acli repo list my-workspace
```

_See code: [src/commands/repo/list.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/repo/list.ts)_

## `bb-acli update [CHANNEL]`

update the bb-acli CLI

```
USAGE
  $ bb-acli update [CHANNEL] [--force |  | [-a | -v <value> | -i]] [-b ]

FLAGS
  -a, --available        See available versions.
  -b, --verbose          Show more details about the available versions.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
      --force            Force a re-download of the requested version.

DESCRIPTION
  update the bb-acli CLI

EXAMPLES
  Update to the stable channel:

    $ bb-acli update stable

  Update to a specific version:

    $ bb-acli update --version 1.0.0

  Interactively select version:

    $ bb-acli update --interactive

  See available versions:

    $ bb-acli update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v4.7.19/src/commands/update.ts)_

## `bb-acli version`

```
USAGE
  $ bb-acli version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.36/src/commands/version.ts)_

## `bb-acli workspace get WORKSPACE`

Get details of a specific workspace

```
USAGE
  $ bb-acli workspace get WORKSPACE [--toon]

ARGUMENTS
  WORKSPACE  Workspace slug or UUID

FLAGS
  --toon  Format output as toon

DESCRIPTION
  Get details of a specific workspace

EXAMPLES
  $ bb-acli workspace get my-workspace
```

_See code: [src/commands/workspace/get.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/workspace/get.ts)_

## `bb-acli workspace list`

List all accessible workspaces

```
USAGE
  $ bb-acli workspace list [--page <value>] [--pagelen <value>] [--toon]

FLAGS
  --page=<value>     [default: 1] Page number
  --pagelen=<value>  [default: 10] Number of items per page
  --toon             Format output as toon

DESCRIPTION
  List all accessible workspaces

EXAMPLES
  $ bb-acli workspace list
```

_See code: [src/commands/workspace/list.ts](https://github.com/hesedcasa/bb-acli/blob/v0.0.0/src/commands/workspace/list.ts)_
<!-- commandsstop -->
