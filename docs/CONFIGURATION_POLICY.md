# Configuration Policy

## 1. Purpose

This document defines how ADO Platform handles configuration while being
rebuilt with NestJS, TypeORM, PostgreSQL, and Next.js.

Configuration must be explicit enough for learning, safe enough for a public
repository, and stable enough for future automation.

## 2. Sources Of Configuration

Configuration sources, from highest runtime precedence to lowest:

1. shell environment;
2. local `.env`;
3. committed `.env.example`;
4. safe code defaults for non-secret local development.

Deployment environment variables will also enter through process environment
when deployment rules exist.

Runtime precedence is:

```text
process environment > local .env > safe code default
```

`.env.example` documents names and safe examples only. It is never loaded as a
runtime source.

Initial implementation decisions:

- `@ado/config` owns typed config parsing;
- config validation uses a schema library chosen in LU-03;
- `ADO_DATABASE_URL` is parsed once and shared by API, Worker, and TypeORM
  DataSource setup;
- frontend code reads only `NEXT_PUBLIC_*` values and never reads server
  secrets directly.

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

ADO-owned server variables use the `ADO_` prefix.

Frontend variables exposed to the browser use the `NEXT_PUBLIC_` prefix and
must never contain secrets.

Examples:

| Variable | Purpose | Secret? |
|---|---|---|
| `ADO_API_ENV` | local/test/development mode | no |
| `ADO_DATABASE_URL` | non-production DB URL | local value may be sensitive |
| `ADO_APP_SECRET` | local signing/session placeholder | yes |
| `ADO_WORKER_ID` | local Worker identity | no |
| `ADO_LOCAL_LLM_ORIGIN` | local model server origin | no |
| `NEXT_PUBLIC_ADO_API_ORIGIN` | browser-visible API origin | no |

Initial required variable matrix:

| Variable | API local | API test | Worker local | Frontend local | CI |
|---|---|---|---|---|---|
| `ADO_API_ENV` | required | required | required | no | required |
| `ADO_DATABASE_URL` | required after LU-03 | no for unit tests without DB | required after LU-06 | no | required for PostgreSQL gates |
| `ADO_APP_SECRET` | required | safe test value allowed | no unless used by Worker | no | required outside isolated tests |
| `ADO_WORKER_ID` | no | no | required unless passed as `--worker-id` | no | no |
| `ADO_LOCAL_LLM_ORIGIN` | no | no | optional after local review LU | no | no |
| `NEXT_PUBLIC_ADO_API_ORIGIN` | no | no | no | required after LU-07 | required for Control build |

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

- it maps cleanly to TypeORM DataSource configuration;
- it is easy to pass to tools;
- it avoids scattering DB parts across many variables too early.

If the Human Owner wants separate `POSTGRES_*` variables later, that change
must update this policy and the settings parser.

The parser must reject missing or malformed database URLs in API local, Worker
local, and PostgreSQL-backed CI modes before the process does real work.

## 7. Test Database Policy

Unit tests may avoid PostgreSQL only when they do not claim database behavior.

Any test involving these behaviors must use PostgreSQL:

- migrations;
- row locks;
- `FOR UPDATE SKIP LOCKED`;
- JSON/index behavior;
- queue leasing;
- transaction isolation;
- pgvector.

PR summaries must not use no-DB or mock tests as proof of PostgreSQL behavior.

## 8. Secret Policy

Never commit:

- real app/session secrets;
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

Fail-fast errors must include the variable name and configuration source
guidance. They must not print secret values.

During learning setup, failures should be explained in plain language:

- which variable was missing;
- where it should be set;
- whether it belongs in `.env` or `.env.example`;
- whether it is safe to commit.

## 10. LU-03 Completion Criteria

LU-03 is complete when:

1. `.env.example` exists with safe values;
2. local `.env` remains untracked;
3. `@ado/config` can parse `ADO_DATABASE_URL`;
4. TypeORM DataSource receives config from `@ado/config`;
5. the Human Owner can explain which variables are browser-visible.
