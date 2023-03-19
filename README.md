# GitHub Contributions

> Show github contributions for all repos of an org

## Demo

[https://github-contributions.netlify.app](https://github-contributions.netlify.app)

## Usage

Build JSON

```sh
GITHUB_TOKEN=123... ORG=someOrgOrUsername make build
```

Serve app

```sh
make serve
```

Visit [http://localhost:3000/](http://localhost:3000/)

### Docker

Build Docker

```sh
docker build -f Dockerfile -t github-contributions .
```

Build JSON

```sh
docker run --env-file .env github-contributions
```

## License

[MIT](LICENSE)
