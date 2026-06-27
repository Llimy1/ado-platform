# Django Project Structure

## 1. Purpose

This document defines the target Django structure for ADO Platform. It is used
when LU-02 starts creating the actual Django project.

No Django files should be generated before the Human Owner has reviewed this
structure.

## 2. Naming

Repository:

```text
ado-platform
```

Django project package:

```text
ado_api
```

ADO Django namespace package:

```text
ado
```

The project package owns Django runtime wiring. The `ado` package owns ADO
domain apps.

## 3. Initial Target Tree

The first Django tree should start small:

```text
apps/
  api/
    manage.py
    ado_api/
      __init__.py
      asgi.py
      urls.py
      wsgi.py
      settings/
        __init__.py
        base.py
        local.py
        test.py
    ado/
      __init__.py
      core/
        __init__.py
        apps.py
        migrations/
          __init__.py
```

Do not create all future domain apps in LU-02. Add them when the Learning Unit
actually needs them.

## 4. Settings Layout

Settings are split by environment:

| File | Purpose |
|---|---|
| `base.py` | shared installed apps, middleware, database parser, timezone, static settings |
| `local.py` | local development defaults |
| `test.py` | fast automated test settings |

Production settings are not created until deployment constraints exist.

## 5. App Layout Rules

Each Django app should eventually follow this shape when needed:

```text
ado/{app_name}/
  __init__.py
  apps.py
  models.py
  services.py
  selectors.py
  admin.py
  tests/
  migrations/
```

Meanings:

- `models.py`: persistence shape only;
- `services.py`: commands and state-changing application behavior;
- `selectors.py`: read/query helpers;
- `admin.py`: inspection/admin wiring;
- `tests/`: app-local tests.

Do not add `services.py` just to satisfy a template. Add it when a real service
exists.

## 6. Domain Apps To Add Later

ADO's eventual Django apps are:

- `core`
- `projects`
- `planning`
- `components`
- `artifacts`
- `execution`
- `verification`
- `reviews`
- `policy`
- `state`
- `audit`
- `integrations`

Only `core` is expected during the first Django project shell.

## 7. Management Commands

Management commands live under the app that owns the behavior:

```text
ado/core/management/commands/
```

Initial commands may include:

- `ado_check_db`
- `ado_worker`
- `export_openapi`

Each command should have a small purpose and a clear verification command.

## 8. Comment Policy

Code comments are written in Korean by default.

Use comments for:

- why a boundary exists;
- why a transaction or lock is required;
- why an external command is outside a DB transaction;
- why a value must not be treated as evidence yet.

Do not comment obvious assignments or framework boilerplate.

## 9. Import Direction

Allowed direction:

```text
views / routers / admin / management commands
  -> services / selectors
  -> models
  -> core primitives
```

Forbidden:

- models calling external tools;
- settings importing domain services;
- Worker command directly mutating state fields;
- browser/frontend code importing Python.

## 10. First Django Checkpoint

LU-02 is complete only when:

1. `apps/api/manage.py` exists;
2. `ado_api` project package exists;
3. `ado.core` app exists;
4. Django can run its project check;
5. the Human Owner can explain project package vs Django app.
