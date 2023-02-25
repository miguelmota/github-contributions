const url = 'http://localhost:2222/output/data.json'

const $root = document.querySelector('#root')

async function main() {
  let html = `<h1 style="margin-bottom: 5rem;">hop-protocol contributions</h1>`

  const res = await fetch(url)
  const json = await res.json()

  const repos = json.repos
  const lastUpdated = json.lastUpdated

  html += `<div>Last updated: ${lastUpdated}</div>`

  const rows = repos.map((repo) => {
    return `
      <div style="margin-bottom: 10rem;">
        <h2><a href="${repo.url}">${repo.org}/${repo.repo}</a></h2>
        <div style="display: flex; justify-content: flex-start; align-items: center;">
        ${repo.contributors.map((contributor) => {
          return `
            <div style="margin-right: 2rem;">
              <h2>${contributor.contributions}</h2>
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
