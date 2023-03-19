const { Octokit } = require('@octokit/core')
const fetch = require('isomorphic-fetch')
require('dotenv').config()

const authToken = process.env.GITHUB_TOKEN

if (!authToken) {
  throw new Error('GITHUB_TOKEN is required')
}

const octokit = new Octokit({
  auth: authToken
})

async function main() {
  const org = process.argv[2] || process.env.ORG
  if (!org) {
    throw new Error('Please provide an org name')
  }

  const repos = await getRepos(org)

  const repoContributors = []

  for (const { repo, url } of repos) {
    const contributors = await getContributors(org, repo)
    const totalContributions = contributors.reduce((acc, curr) => acc + curr.contributions, 0)

    repoContributors.push({
      org,
      repo,
      url,
      contributors,
      totalContributions
    })
  }

  const sortedRepoContributors = repoContributors.sort((a, b) => b.totalContributions - a.totalContributions)

  const json = {
    lastUpdated: Date.now(),
    org,
    repos: sortedRepoContributors
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

  let sumContributions = 0
  for (const item of res.data) {
    sumContributions += item.contributions
  }

  for (const item of res.data) {
    json.push({
      username: item.login,
      avatar: item.avatar_url,
      url: item.html_url,
      contributions: item.contributions,
      percentage: Number(((item.contributions / sumContributions) * 100).toFixed(2))
    })
  }

  return json
}

main().catch(console.error)
