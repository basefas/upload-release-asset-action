import * as core from '@actions/core'
import * as fs from 'fs'
import * as github from '@actions/github'
// eslint-disable-next-line import/named
import { Endpoints } from '@octokit/types'

type UploadAssetResp =
  Endpoints['POST {origin}/repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}']['response']

async function run(): Promise<void> {
  try {
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      core.setFailed('GITHUB_TOKEN need to set in env.')
      return
    }

    const releaseId = core.getInput('release_id', { required: true })
    const release_id = Number(releaseId)
    if (isNaN(release_id)) {
      core.setFailed('release ID is not a valid integer.')
    }
    const assetName = core.getInput('asset_name', { required: true })
    const assetPath = core.getInput('asset_path', { required: true })
    const octokit = github.getOctokit(githubToken)
    const context = github.context
    const name = assetName
    const data = fs.readFileSync(assetPath).toString()
    const { owner, repo } = context.repo

    const uploadAssetResponse: UploadAssetResp = await octokit.rest.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id,
      name,
      data
    })

    core.setOutput('id', uploadAssetResponse.data.id)
    core.setOutput('browser_download_url', uploadAssetResponse.data.browser_download_url)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
