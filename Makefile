SHELL := /bin/bash
.SHELLFLAGS := -euo pipefail -c

.PHONY: test pi-install-local pi-uninstall-local publish-pi publish-pi-dry-run

ABP_PI_LOCAL_PACKAGE := $(abspath agent-booster-pack)

test:
	pnpm test
	node scripts/validate-skill-anatomy.mjs
	pnpm run check:links
	pnpm --dir agent-booster-pack test
	pnpm --dir eval test
	pnpm --dir eval typecheck

pi-install-local:
	scripts/pi-install-local.sh

pi-uninstall-local:
	pi remove "$(ABP_PI_LOCAL_PACKAGE)"

publish-pi:
	scripts/publish-pi-packages.sh

publish-pi-dry-run:
	scripts/publish-pi-packages.sh --dry-run
