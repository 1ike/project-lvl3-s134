install:
	npm i

start:
	npm run babel-node -- src/bin/page-loader.js http://api.jquery.com/

d:
	npm run babel-node -- --inspect-brk src/bin/page-loader.js https://tpverstak.github.io/

build: lint
	npm run build

b:
	npm run build

lint:
	npm run eslint src

fix:
	npm run eslint --fix src

test:
	npm run test

t:
	npm run test-watch

publish:
	npm publish
