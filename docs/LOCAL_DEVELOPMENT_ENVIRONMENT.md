# Local Development Environment

## 1. Purpose

This document defines the local development environment for rebuilding ADO
Platform from scratch with NestJS, TypeScript, TypeORM, PostgreSQL, local LLM
review practice, and Next.js.

The goal is not only to make the app run. The goal is to make each setup step
understandable to the Human Owner.

## 2. Supported Local Machine

The first supported development machine is macOS.

Linux support may be added later after the local macOS path is stable.
Windows-specific process behavior is not part of the initial setup path.

## 3. Editor And Project Root

Open the repository root in the editor:

```text
<repo-root>
```

WebStorm or IntelliJ are acceptable for learning NestJS/TypeScript. PyCharm is
not the primary editor for this NestJS path unless TypeScript support is
configured correctly.

Editor-generated files are local by default:

- `.idea/` is not committed unless the Human Owner explicitly decides to
  version a shared IDE setting.
- `.env` is never committed.
- `.DS_Store` is never committed.

## 4. Required Tools

LU-01 must verify tool versions before creating framework files.

Required tools:

| Tool | Purpose | Version rule |
|---|---|---|
| Node.js | NestJS, Worker, Next.js, and TypeScript runtime/tooling | use LTS or the version later pinned by the repo |
| Corepack | package manager activation | required when available |
| `pnpm` | workspace package manager | required |
| Docker or local PostgreSQL | local PostgreSQL | one local method is chosen during LU-05 |
| Git | branches, commits, PRs | required |
| GitHub CLI `gh` | PR workflow | recommended |

If a version is unknown, Codex must ask the Human Owner to run the version
command instead of guessing.

LU-01 must record observed versions in the PR evidence and then pin the
project-supported ranges in `package.json` or a later tool-version file. Exact
framework versions are confirmation required until LU-01 checks local versions
and official compatibility.

## 5. Node And pnpm Policy

TypeScript dependencies are declared in `package.json` files and locked in
`pnpm-lock.yaml`.

`pnpm` owns:

- dependency resolution;
- lockfile generation;
- workspace linking;
- command execution through `pnpm` scripts.

Do not install NestJS, TypeORM, or Next.js globally for this project. Do not
rely on whichever packages happen to be installed outside the repository.

Recommended first checks:

```bash
node --version
corepack --version
pnpm --version
```

If `pnpm` is unavailable, enable it through Corepack during LU-01.

The first Node baseline must decide:

- supported Node major version;
- package manager expectation;
- initial TypeScript version;
- runtime dependencies for NestJS and TypeORM work;
- development dependencies for formatting, linting, typing, and tests.

## 6. PostgreSQL Local Policy

ADO uses PostgreSQL as the orchestration single source of truth.

The first local PostgreSQL setup should use one of these methods:

- Docker Compose inside the repository;
- an existing local PostgreSQL server.

Do not mix methods in one Learning Unit.

The default LU-05 path is Docker Compose inside the repository unless the Human
Owner explicitly chooses an existing local PostgreSQL server.

Default local values, unless changed during LU-05:

| Setting | Value |
|---|---|
| database | `ado_platform` |
| user | `ado` |
| password | `ado` |
| host | `localhost` |
| port | `5434` |

The non-default port `5434` avoids collisions with other local projects that
may already use `5432`.

Minimum Docker Compose runbook for LU-05:

```bash
docker compose -f infra/docker/compose.local.yml up -d postgres
docker compose -f infra/docker/compose.local.yml ps
docker compose -f infra/docker/compose.local.yml exec postgres pg_isready -U ado -d ado_platform
docker compose -f infra/docker/compose.local.yml exec postgres psql -U ado -d ado_platform -c "select version();"
make db-migrate
```

If `infra/docker/compose.local.yml` does not exist yet, LU-05 must create it
before claiming PostgreSQL setup is complete. If an existing local PostgreSQL
server is chosen instead, the LU summary must list equivalent `pg_isready`,
`psql`, and migration verification commands. Before LU-08 creates `make
db-migrate`, LU-05 must document the visible `pnpm` or TypeORM command that the
Makefile will wrap.

## 7. Environment Files

`.env.example` is committed only after LU-03 defines the first required
variables.

`.env.example` may contain:

- non-secret local examples;
- placeholder values;
- comments explaining required variables.

`.env.example` must not contain:

- real provider keys;
- real GitHub tokens;
- private local file paths that reveal sensitive data;
- production credentials.

`.env` is local only and must remain ignored.

## 8. Local LLM Practice Boundary

Local LLM setup is allowed later, but it is not part of LU-01.

When local LLM review work begins:

- model installation is documented separately;
- model output is treated as a ReviewResult claim;
- Human/Codex decisions are recorded against findings;
- no model output becomes completion evidence without validation;
- local model paths and cache directories are not committed.

## 9. Local Cleanup Rules

The repository should stay understandable while learning.

Allowed local-only clutter:

- `.idea/`;
- `.env`;
- Node dependency directories;
- package-manager caches;
- `.DS_Store`.

Before committing, run:

```bash
git status --short
git check-ignore -v .idea .env .DS_Store
```

Only intentional source, config, lockfile, and documentation changes should be
staged.

The expected result is:

- `.idea/`, `.env`, and `.DS_Store` are ignored;
- no private local path is added to committed documentation;
- any shared IDE setting is added only after the Human Owner explicitly
  approves a narrow allowlist.
