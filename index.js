const { Octokit } = require('@octokit/core')
const fetch = require('isomorphic-fetch')
require('dotenv').config()

const authToken = process.env.GITHUB_TOKEN

const octokit = new Octokit({
  auth: authToken
})

async function main() {
  const org = process.env.ORG
  const repos = await getRepos(org)

  const repoContributors = []

  for (const { repo, url } of repos) {
    const contributors = await getContributors(org, repo)

    repoContributors.push({
      org,
      repo,
      url,
      contributors
    })
  }

  const json = {
    lastUpdated: Date.now(),
    repos: repoContributors
  }

  console.log(JSON.stringify(json, null, 2))
}

async function getRepos(org) {
  const res = await octokit.request('GET /orgs/{org}/repos', {
    org,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  const json = []

  for (const item of res.data) {
    if (item.private) {
      continue
    }

    if (item.fork) {
      continue
    }

    json.push({
      repo: item.name,
      url: item.html_url,
    })
  }

  return json
}

async function getContributors(org, repo) {
  const res = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
    owner: org,
    repo: repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  const json = []

  for (const item of res.data) {
    json.push({
      username: item.login,
      avatar: item.avatar_url,
      url: item.html_url,
      contributions: item.contributions
    })
  }

  return json
}

main().catch(console.error)
