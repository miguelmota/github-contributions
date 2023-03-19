serve:
	(cd public && python -m http.server --bind 0.0.0.0 3000)

build:
	node index.js > public/output/contributions.json

docker-build:
	docker build -f Dockerfile -t github-contributions .

docker-start:
	docker run --env-file .env github-contributions
