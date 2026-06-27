# Configuration Policy

## 1. Purpose

This document defines how ADO Platform handles configuration while being
rebuilt from scratch.

Configuration must be explicit enough for learning, safe enough for a public
repository, and stable enough for future automation.

## 2. Sources Of Configuration

Configuration sources, from most local to most durable:

1. shell environment;
2. local `.env`;
3. committed `.env.example`;
4. Django settings defaults for non-secret local development;
5. deployment environment later.

The database remains the application source of truth. Environment variables
configure processes; they do not replace database state.

## 3. File Rules

`.env`:

- local only;
- ignored by Git;
- may contain real local secrets;
- never referenced in PR text with secret values.

`.env.example`:

- committed after LU-03;
- contains safe examples only;
- documents required variables;
- must be updated when required configuration changes.

## 4. Variable Naming

ADO-owned variables use the `ADO_` prefix.

Frontend variables exposed to the browser use the `NEXT_PUBLIC_` prefix and
must never contain secrets.

Examples:

| Variable | Purpose | Secret? |
|---|---|---|
| `ADO_API_ENV` | local/test/development mode | no |
| `ADO_DATABASE_URL` | non-production DB URL | local value may be sensitive |
| `ADO_DJANGO_SECRET_KEY` | Django signing secret | yes |
| `ADO_WORKER_ID` | local Worker identity | no |
| `NEXT_PUBLIC_ADO_API_ORIGIN` | browser-visible API origin | no |

## 5. Environment Names

Initial allowed values for `ADO_API_ENV`:

- `local`
- `test`
- `development`

`production` is reserved until deployment rules are written.

## 6. Database Configuration

Use `ADO_DATABASE_URL` as the first database configuration interface.

Default local example:

```text
postgres://ado:ado@localhost:5434/ado_platform
```

Reasons:

- it maps cleanly to Django settings;
- it is easy to pass to tools;
- it avoids scattering DB parts across many variables too early.

If the Human Owner wants separate `POSTGRES_*` variables later, that change
must update this policy and the settings parser.

## 7. Test Database Policy

Early unit tests may use SQLite only when the test does not claim PostgreSQL
behavior.

Any test involving these behaviors must use PostgreSQL:

- migrations;
- row locks;
- `select_for_update`;
- JSON/index behavior;
- queue leasing;
- transaction isolation;
- pgvector.

PR summaries must not use SQLite-only tests as proof of PostgreSQL behavior.

## 8. Secret Policy

Never commit:

- real Django secret keys;
- provider API keys;
- GitHub tokens;
- local LLM private service credentials;
- production URLs with credentials;
- private local filesystem paths that reveal sensitive data.

Use obvious placeholders:

```text
replace-me
local-only-example
```

## 9. Settings Failure Policy

The API and Worker should fail before doing real work when required
configuration is missing or invalid.

During learning setup, failures should be explained in plain language:

- which variable was missing;
- where it should be set;
- whether it belongs in `.env` or `.env.example`;
- whether it is safe to commit.

## 10. LU-03 Completion Criteria

LU-03 is complete when:

1. `.env.example` exists with safe values;
2. local `.env` remains untracked;
3. Django settings can parse `ADO_DATABASE_URL`;
4. test settings are clearly separated from local settings;
5. the Human Owner can explain which variables are browser-visible.
