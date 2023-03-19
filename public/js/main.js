const url = '../output/contributions.json'

const $root = document.querySelector('#root')

async function main() {
  let html = ''

  const res = await fetch(url)
  const json = await res.json()

  const orgName = json.org
  html += `<h1 style="margin-bottom: 5rem;">${orgName} contributions</h1>`
  const repos = json.repos
  const lastUpdated = new Date(json.lastUpdated).toISOString()

  html += `<div>Last updated: ${lastUpdated}</div>`

  const rows = repos.map((repo) => {
    return `
      <div style="margin-bottom: 10rem;">
        <h2><a href="${repo.url}">${repo.org}/${repo.repo}</a></h2>
        <div style="display: flex; justify-content: flex-start; align-items: center;">
        ${repo.contributors.map((contributor) => {
          return `
            <div style="margin-right: 2rem;">
              <h2>${contributor.contributions} (${contributor.percentage}%)</h2>
              <div>
                <a href="${contributor.url}">
                  <div><img src="${contributor.avatar}" width="64px" /></div>
                  <div>${contributor.username}</a></div>
                </a>
              </div>
            </div>
          `
        }).join('')}
        </div>
      </div>
    `
  })

  html += `<div>${rows.join('')}</div>`

  $root.innerHTML = html
}

main().catch(console.error)
