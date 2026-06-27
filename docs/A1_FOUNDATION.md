# A1 Foundation

## Current Status

A1 is intentionally not implemented yet.

The historical NestJS/TypeORM/Turborepo implementation has been removed so the
Human Owner can rebuild the platform from the first framework setup step while
learning Django, Python, PostgreSQL, local LLM integration, and Next.js.

New A1 work must follow:

- `docs/PLATFORM_DJANGO_NEXT_TRANSITION_RULES.md`
- `docs/LEARNING_FIRST_SETUP_PROTOCOL.md`
- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/DJANGO_PROJECT_STRUCTURE.md`
- `docs/CONFIGURATION_POLICY.md`
- `docs/LEARNING_PR_POLICY.md`

## Learning-First Scope

A1 will be rebuilt through Learning Units instead of a generated skeleton:

1. LU-01 Python and `uv` baseline
2. LU-02 Django project creation
3. LU-03 settings and environment
4. LU-04 Django Ninja health API and OpenAPI
5. LU-05 PostgreSQL and migrations
6. LU-06 Python Worker command
7. LU-07 Next Control health screen
8. LU-08 root command surface

Each Learning Unit must explain the concept, list touched files, run a small
verification command, and leave a checkpoint summary before moving on.

## Target A1 Outcome

A1 is complete only when the repository contains a runnable Django + Next
foundation:

- Python `uv` baseline and lockfile
- Django + Django Ninja API with `GET /v1/health`
- Next.js Control app with an API health panel
- Python Worker command with database preflight and graceful shutdown
- PostgreSQL local development profile
- Django migration path
- OpenAPI JSON generation at `apps/api/openapi.json`
- root commands for lint, typecheck, test, integration, Control build,
  migrations, OpenAPI, and generated client checks
- CI baseline for the same gates

Until those Learning Units are completed, commands from the removed historical
implementation must not be treated as current.
