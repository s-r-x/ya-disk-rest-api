.PHONY: docs, test

test:
	npm run test
dev:
	npm run dev
build:
	npm run build
build.types:
	npm run build.types
build.code:
	npm run build.code
lint:
	npm run lint
lint.strict:
	npm run lint.strict
lint.fix:
	npm run lint.fix
check-types:
	npm run check-types
release:
	npm run semantic-release
docs.build:
	npm run docs.build
docs.watch:
	npm run docs.watch