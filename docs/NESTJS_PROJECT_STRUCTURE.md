# NestJS Project Structure

## 1. Purpose

This document defines the target NestJS + TypeORM structure for ADO Platform.
It is used when LU-02 starts creating the actual TypeScript workspace and Nest
applications.

No framework files should be generated before the Human Owner has reviewed the
structure and command sequence.

## 2. Naming

Applications:

```text
@ado/api
@ado/worker
@ado/control
```

Shared packages:

```text
@ado/domain
@ado/application
@ado/persistence
@ado/contracts
@ado/config
@ado/runtime
@ado/testkit
```

## 3. Initial Target Tree

LU-02 starts small:

```text
apps/
  api/
    src/
      main.ts
      app.module.ts
      health/
  worker/
    src/
      main.ts
  control/
    src/
packages/
  contracts/
    src/
  config/
    src/
```

Do not create all future orchestration modules in LU-02. Add them when the
Learning Unit actually needs them.

## 4. Package Direction

Allowed direction:

```text
control -> contracts
api -> contracts -> application -> domain
worker -> application -> domain
application -> ports only
persistence -> domain
runtime -> domain
config -> no app imports
```

Forbidden:

- controllers importing TypeORM repositories directly;
- entities calling services, local LLMs, Git, or GitHub;
- `domain` importing NestJS, TypeORM, Next.js, HTTP clients, or child-process
  utilities;
- frontend code importing backend services or entities.

## 5. Nest Module Layout

Feature modules eventually use this shape when needed:

```text
src/{module_name}/
  api/
  application/
  domain/
  infrastructure/
  worker/
  tests/
```

Meanings:

- `api/`: controllers, DTOs, transport-only validation;
- `application/`: use cases, commands, queries, policies;
- `domain/`: pure vocabulary and invariants;
- `infrastructure/`: TypeORM repositories or external adapters;
- `worker/`: handler wiring for Worker process only.

Do not create folders just to satisfy the template.

## 6. TypeORM Layout

TypeORM persistence owns:

```text
packages/persistence/
  src/
    data-source.ts
    entities/
    migrations/
    repositories/
    queries/
```

Rules:

- `data-source.ts` reads typed config from `@ado/config`;
- migrations are committed TypeScript files;
- `synchronize` is always false;
- Worker lease queries live in `queries/` or named repository methods;
- PostgreSQL-specific behavior gets a short comment explaining why the ORM
  abstraction is not enough.

## 7. Comment Policy

Code comments are written in Korean by default.

Use comments for:

- why a module boundary exists;
- why a transaction or lock is required;
- why external commands run outside DB transactions;
- why local LLM output is only a claim.

Do not comment obvious assignments or framework boilerplate.

## 8. First Nest Checkpoint

LU-02 is complete only when:

1. `package.json`, `pnpm-workspace.yaml`, and TypeScript config exist;
2. `apps/api` can start or pass a basic Nest check;
3. `apps/worker` has an entrypoint that can run once without leasing real work;
4. `apps/control` is reserved for Next.js setup;
5. the Human Owner can explain app vs package vs module.
