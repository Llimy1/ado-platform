# Local Development Environment

## 1. Purpose

This document defines the local development environment for rebuilding ADO
Platform from scratch with Django, Python, PostgreSQL, local LLM practice, and
Next.js.

The goal is not only to make the app run. The goal is to make each setup step
understandable to the Human Owner.

## 2. Supported Local Machine

The first supported development machine is macOS.

Linux support may be added later after the local macOS path is stable.
Windows-specific process behavior is not part of the initial setup path.

## 3. Editor And Project Root

Open the repository root in the editor:

```text
/Users/iminhyeog/dev/agent/ado-platform
```

PyCharm is acceptable and recommended for learning Django/Python. IntelliJ is
also acceptable if Python support is configured correctly.

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
| Python | Django API and Worker runtime | use the local installed version if compatible with the pinned project range |
| `uv` | Python dependency and command runner | required |
| Node.js | Next.js and TypeScript tooling | use LTS or the version later pinned by the repo |
| `pnpm` | frontend package manager | required for Next.js workspace |
| Docker or local PostgreSQL | local PostgreSQL | one local method is chosen during LU-05 |
| Git | branches, commits, PRs | required |
| GitHub CLI `gh` | PR workflow | recommended |

If a version is unknown, Codex must ask the Human Owner to run the version
command instead of guessing.

## 5. Python And uv Policy

Python dependencies are declared in `pyproject.toml`.

`uv` owns:

- dependency resolution;
- lockfile generation;
- virtual environment management;
- Python command execution through `uv run`.

Do not install Django globally for this project. Do not rely on whichever
Python packages happen to be installed outside the repository.

Recommended first checks:

```bash
python3 --version
uv --version
uv python list
```

## 6. Node And pnpm Policy

Node and `pnpm` are used for the Next.js Control Room and generated TypeScript
client only.

`pnpm` does not orchestrate the Django API or Python Worker.

Recommended first checks:

```bash
node --version
corepack --version
pnpm --version
```

If `pnpm` is unavailable, enable it through Corepack during the relevant
Learning Unit.

## 7. PostgreSQL Local Policy

ADO uses PostgreSQL as the orchestration single source of truth.

The first local PostgreSQL setup should use one of these methods:

- Docker Compose inside the repository;
- an existing local PostgreSQL server.

Do not mix methods in one Learning Unit.

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

## 8. Environment Files

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

## 9. Local LLM Practice Boundary

Local LLM setup is allowed later, but it is not part of LU-01.

When local LLM work begins:

- model installation is documented separately;
- model output is treated as a claim;
- no model output becomes completion evidence without review and validation;
- local model paths and cache directories are not committed.

## 10. Local Cleanup Rules

The repository should stay understandable while learning.

Allowed local-only clutter:

- `.idea/`;
- `.env`;
- virtual environment/cache directories managed by `uv`;
- Node dependency directories;
- `.DS_Store`.

Before committing, run:

```bash
git status --short
```

Only intentional source, config, lockfile, and documentation changes should be
staged.
