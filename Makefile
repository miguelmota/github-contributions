serve:
	(cd public && python -m http.server --bind 0.0.0.0 3000)

build:
	node index.js > public/output/contributions.json
