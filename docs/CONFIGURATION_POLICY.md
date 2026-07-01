# Configuration Policy

## 1. Purpose

This document defines how ADO Platform handles configuration while being
rebuilt with Spring Boot, Spring Batch, PostgreSQL, Flyway, JPA, Querydsl, and
Next.js.

Configuration must be explicit enough for learning, safe enough for a public
repository, and stable enough for future automation.

## 2. Sources Of Configuration

Configuration sources, from highest runtime precedence to lowest:

1. shell environment;
2. Spring profile files committed with non-secret defaults;
3. safe code defaults for non-secret local development.

Deployment environment variables will also enter through process environment
when deployment rules exist.

Runtime precedence is:

```text
process environment > committed non-secret Spring profile file > safe code default
```

Spring Boot does not load `.env` files by default. ADO A1 does not add a dotenv
runtime library. Local `.env` may exist for the Human Owner's convenience, but
values from it must be explicitly injected through shell exports, IntelliJ run
configuration, Docker Compose `env_file`, or another visible local command.

`.env.example` documents names and safe examples only. It is never loaded as a
runtime source.

Initial implementation decisions:

- Spring Boot configuration properties own typed config parsing;
- validation uses Jakarta Bean Validation or another explicit validator chosen
  in LU-03;
- `ADO_DATABASE_URL`, `ADO_DATABASE_USERNAME`, and `ADO_DATABASE_PASSWORD` are
  parsed once and shared by API, Worker, Flyway, JPA, and JDBC setup;
- `SPRING_PROFILES_ACTIVE` is the source of truth for Spring profile selection;
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

Spring-owned runtime variables may use the `SPRING_` prefix when they directly
control Spring behavior. `SPRING_PROFILES_ACTIVE` is allowed and preferred over
a parallel ADO profile variable.

Frontend variables exposed to the browser use the `NEXT_PUBLIC_` prefix and
must never contain secrets.

Examples:

| Variable | Purpose | Secret? |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Spring runtime profile | no |
| `ADO_DATABASE_URL` | JDBC database URL | no unless credentials are embedded |
| `ADO_DATABASE_USERNAME` | database user | local value may be sensitive |
| `ADO_DATABASE_PASSWORD` | database password | yes |
| `ADO_APP_SECRET` | local signing/session placeholder | yes |
| `ADO_WORKER_ID` | local Worker identity | no |
| `ADO_LOCAL_LLM_ORIGIN` | local model server origin | no |
| `NEXT_PUBLIC_ADO_API_ORIGIN` | browser-visible API origin | no |

Initial required variable matrix:

| Variable | API local | API test | Worker local | Control local | CI |
|---|---|---|---|---|---|
| `SPRING_PROFILES_ACTIVE` | required | required | required | no | required |
| `ADO_DATABASE_URL` | required after LU-03 | no for unit tests without DB | required after LU-07 | no | required for PostgreSQL gates |
| `ADO_DATABASE_USERNAME` | required after LU-03 | no for unit tests without DB | required after LU-07 | no | required for PostgreSQL gates |
| `ADO_DATABASE_PASSWORD` | required after LU-03 | no for unit tests without DB | required after LU-07 | no | required for PostgreSQL gates |
| `ADO_APP_SECRET` | required once auth/session exists | safe test value allowed | no unless used by Worker | no | required outside isolated tests after auth exists |
| `ADO_WORKER_ID` | no | no | required unless passed as `--worker-id` | no | no |
| `ADO_LOCAL_LLM_ORIGIN` | no | no | optional after local review LU | no | no |
| `NEXT_PUBLIC_ADO_API_ORIGIN` | no | no | no | required after LU-08 | required for Control build after LU-08 |

## 5. Spring Profiles

Initial allowed values for `SPRING_PROFILES_ACTIVE`:

- `local`
- `test`
- `ci`

`production` is reserved until deployment rules are written.

Do not create a separate `ADO_APP_ENV` during A1. If a later feature needs an
ADO-specific runtime mode, it must define how it relates to
`SPRING_PROFILES_ACTIVE`.

## 6. Database Configuration

Use these variables as the first database configuration interface:

- `ADO_DATABASE_URL`
- `ADO_DATABASE_USERNAME`
- `ADO_DATABASE_PASSWORD`

Default local example:

```text
ADO_DATABASE_URL=jdbc:postgresql://localhost:5434/ado_platform
ADO_DATABASE_USERNAME=ado
ADO_DATABASE_PASSWORD=ado
```

Reasons:

- it maps cleanly to Spring Boot datasource and Flyway configuration;
- it is easy to pass to Flyway and tests;
- it avoids embedding passwords in URLs.

If the Human Owner wants `POSTGRES_*` variables later, that change must update
this policy and the settings parser.

The parser must reject missing or malformed database configuration in API
local, Worker local, and PostgreSQL-backed CI modes before the process does
real work.

## 7. Spring Profile Files

Initial allowed Spring profiles:

- `local`
- `test`
- `ci`

Profile-specific files may exist only when they contain non-secret defaults.
Secrets belong in environment variables or local `.env`, never in committed
`application-*.yml`.

## 8. Test Database Policy

Unit tests may avoid PostgreSQL only when they do not claim database behavior.

Any test involving these behaviors must use PostgreSQL:

- Flyway migrations;
- row locks;
- `FOR UPDATE SKIP LOCKED`;
- JSON/index behavior;
- queue leasing;
- transaction isolation;
- Spring Batch JobRepository behavior;
- pgvector.

PR summaries must not use H2, SQLite, no-DB, or mock tests as proof of
PostgreSQL behavior.

PostgreSQL-backed tests use Testcontainers by default during A1. A different
isolated PostgreSQL method is allowed only when the Learning Unit explains why
Testcontainers is not appropriate.

## 9. Secret Policy

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

## 10. Settings Failure Policy

The API and Worker should fail before doing real work when required
configuration is missing or invalid.

Fail-fast errors must include the variable name and configuration source
guidance. They must not print secret values.

During learning setup, failures should be explained in plain language:

- which variable was missing;
- where it should be set;
- whether it belongs in `.env` or `.env.example`;
- whether it is safe to commit.

## 11. LU-03 Completion Criteria

LU-03 is complete when:

1. `.env.example` exists with safe values;
2. local `.env` remains untracked;
3. Spring configuration properties can parse database URL, username, and
   password without printing secret values;
4. API and Worker receive config through Spring, not ad hoc shell parsing;
5. the Human Owner can explain which variables are browser-visible.
