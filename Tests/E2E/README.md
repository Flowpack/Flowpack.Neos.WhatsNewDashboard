# E2E tests for Flowpack.Neos.WhatsNewDashboard

Playwright + [playwright-bdd](https://vitalets.github.io/playwright-bdd/) tests that run against a
dockerized Neos "system under test" (SUT) — for **both Neos 8 and Neos 9**.
The setup is copied and adapted from the
[Sandstorm.NeosTwoFactorAuthentication E2E template](https://github.com/sandstorm/NeosTwoFactorAuthentication).

## How it works

- The SUT is a stock `neos/neos-base-distribution` (`^8` with PHP 8.2, `^9` with PHP 8.5)
  running on FrankenPHP, with MariaDB and Redis (see `system_under_test/`).
- The **local working copy of this package** is bind-mounted into the container and installed
  at startup as a composer *path repository* (`flowpack/neos-whatsnewdashboard:@dev`), so code
  changes are live after a container restart.
- The **companion package** `flowpack/neos-whatsneweditor-inmyproject` is installed from
  packagist in the version matching the Neos version: `^1.0` on Neos 8, `^2.0` on Neos 9.
  It provides the `/api/whats-new/in-project` endpoint and the
  "What's New Dashboard Page" node type used by the notification-modal tests.
- Configuration variants are selected via **`FLOW_CONTEXT`** sub-contexts
  (`system_under_test/sut_file_system_overrides/app/Configuration/Production/E2E-SUT/…`),
  paired with a Gherkin tag per variant:

  | Variant | FLOW_CONTEXT | Tag |
  |---|---|---|
  | defaults | `Production/E2E-SUT` | `@default-context` |
  | with-source-url | `Production/E2E-SUT/WithSourceUrl` | `@with-source-url` |
  | notification-modal | `Production/E2E-SUT` | `@notification-modal` |

- Playwright's `webServer` boots the SUT via docker compose (cold boot ~3–4 min) and reuses an
  already-running one. After a test run the SUT is torn down **including volumes** — set
  `KEEP_SUT=1` to keep it running for a faster local dev loop.
- Caveat when iterating with `KEEP_SUT=1`: the notification-modal scenario "The dialog reappears
  when news are published after dismissal" publishes a news page and expects a clean site —
  a leftover page from a previous run can shadow the new one in the API. Reset with
  `docker compose -f system_under_test/neos8/docker-compose.yaml down -v` before re-running
  that variant (without `KEEP_SUT` every run starts fresh anyway, as in CI).

## Prerequisites

- Docker (with compose v2.20+, needed for `include:` in compose files)
- Node.js (version from `.nvmrc`)
- `make`

## Usage

```sh
make setup       # build both SUT images, install node deps + chromium, generate BDD files

make test                             # everything (neos8 + neos9, all variants)
make test-neos8                       # all neos8 variants
make test-neos8-defaults              # a single variant
KEEP_SUT=1 make test-neos8-defaults   # keep the SUT running afterwards

make start-sut-neos8   # start the SUT manually (e.g. to poke around on http://localhost:8081)
make log-sut-neos8     # follow container logs (useful during the cold boot)
make enter-sut-neos8   # bash shell inside the neos container
make sut-prune         # tear down both SUTs incl. volumes (fresh DB on next start)
```

Run `make` without a target to list all targets.

## Writing tests

- **Features** live in `features/<variant>/*.feature`, tagged with the variant's tag.
- **Steps** live in `steps/*.ts` and are shared across all features.
- **Page objects** live in `helpers/` (`dashboard-pages.ts` for this package's UI,
  `general-pages.ts` for the Neos login/content pages).
- `helpers/system.ts` shells into the SUT container (`docker exec … ./flow …`) to create/delete
  users per scenario; `steps/hooks.ts` cleans up after every scenario.
- `npm run generate-tests` (or `make generate-bdd-files`) regenerates the executable specs in
  `.features-gen/` — it runs automatically before every test script.
- Selector convention: prefer `getByRole` with the accessible name; fall back to stable
  ids/classes rendered by the package (e.g. `#whatsNewIFrame`, `.whats-new__dialog`).
- Note: the "What's New Dashboard Page" node type label uses a typographic apostrophe (`’`).

## Adding a new configuration variant

1. Add a config folder `system_under_test/sut_file_system_overrides/app/Configuration/Production/E2E-SUT/<MyVariant>/Settings.yaml`.
2. Rebuild the SUT images (`make setup-sut`) — the configs are copied into the image at build time.
3. Add a feature folder `features/my-variant/` and tag its scenarios `@my-variant`.
4. Add npm scripts `test:neos8:my-variant` / `test:neos9:my-variant` setting
   `FLOW_CONTEXT=Production/E2E-SUT/MyVariant` and `--grep @my-variant`.
5. Add Makefile targets wrapping the npm scripts and extend `test-neos8` / `test-neos9`.
