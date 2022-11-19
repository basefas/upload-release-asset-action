# GitHub Action - Upload A Release Asset Action

This GitHub Action is written according to the action [`actions/upload-release-asset`](https://github.com/actions/upload-release-asset) which had been archived.

It has solved the `Node.js 12 actions are deprecated.` warnings.

The action wraps the [GitHub Release API](https://docs.github.com/en/rest/releases), specifically the [Upload A Release Asset](https://docs.github.com/en/rest/releases/assets#upload-a-release-asset) endpoint, to allow you to leverage GitHub Actions to upload release assets.

## Usage
### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. For more information, reference the GitHub Help Documentation for [Quickstart for GitHub Actions](https://docs.github.com/en/actions/quickstart). You also will need to have a release to upload your asset to, which could be created programmatically by [`@bruceadams/get-release`](https://github.com/bruceadams/get-release) as show in the example workflow.

This Action needs the environment variable `${{ secrets.GITHUB_TOKEN }}` to be set correctly.
`GITHUB_TOKEN` secret created automatically by GitHub, and you don't need more operation. For more information, see the [Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

### Inputs
For more information on these inputs, see the [API Documentation](https://docs.github.com/en/rest/releases/assets#upload-a-release-asset) <Parameters>

- `release_id`: The ID uploading assets to the release, which could come from another GitHub Action, for example the [`@bruceadams/get-release`](https://github.com/bruceadams/get-release) GitHub Action

### Outputs
For more information on these outputs, see the [API Documentation](https://docs.github.com/en/rest/releases/assets#upload-a-release-asset) <Response for successful upload>

- `id`: The ID of the asset
- `browser_download_url`: The URL users can navigate to in order to download the release asset.

### Example workflow - upload a release asset
On every `push` to a tag matching the pattern `v*`, [create a release](https://docs.github.com/en/rest/releases/releases#create-a-release) and [upload a release asset](https://docs.github.com/en/rest/releases/assets#upload-a-release-asset). This Workflow example assumes you have the [`@bruceadams/get-release`](https://github.com/bruceadams/get-release) Action in a previous step:

```yaml
name: Upload Release Asset

on:
  push:
    # Sequence of patterns matched against refs/tags
    tags:
    - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

jobs:
  build:
    name: Upload Release Asset
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build project # This would actually build your project, using zip for an example artifact
        run: |
          zip --junk-paths my-artifact README.md

      - name: Get Release
        id: get_release
        uses: bruceadams/get-release@v1.3.2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload Release Asset
        id: upload-release-asset 
        uses: basefas/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          release_id: ${{ steps.get_release.outputs.id }} # This pulls from the Get RELEASE step above, referencing its ID to get its outputs object, which include a `id`.
          asset_path: ./my-artifact.zip
          asset_name: my-artifact.zip
```

This will upload a release artifact to an existing release, outputting the `browser_download_url` for the asset which could be handled by a third party service, or by GitHub Actions for additional uses. For more information, see the GitHub Documentation for the [upload a release asset](https://docs.github.com/en/rest/releases/assets#upload-a-release-asset) endpoint.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
