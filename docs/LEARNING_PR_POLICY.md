# Learning PR Policy

## 1. Purpose

This document defines how pull requests should be shaped while ADO Platform is
rebuilt through Learning Units.

The PR should prove both code progress and learning progress.

## 2. PR Size

Default rule:

```text
one Learning Unit = one PR
```

Exceptions are allowed only when:

- the Human Owner explicitly asks to combine units;
- the combined units are tightly coupled;
- the PR body explains why they were combined.

## 3. Commit Shape

Prefer one or two commits per Learning Unit:

1. setup or implementation;
2. docs/checkpoint update if needed.

Avoid large mixed commits that combine:

- framework setup;
- dependency changes;
- database changes;
- frontend UI;
- Worker behavior;
- cleanup.

## 4. Branch Naming

Use the `ado/` prefix.

Recommended branch names:

```text
ado/lu-01-python-uv-baseline
ado/lu-02-django-project-shell
ado/lu-03-configuration-policy
ado/lu-04-django-ninja-health
```

## 5. PR Body Template

```md
## Learning Unit

LU-XX: Title

## Goal

...

## What changed

- ...

## What I should be able to explain

- ...

## Verification

- [ ] command

## Evidence

Important output or summary:

```text
...
```

## Not included

- ...

## Follow-up

- ...
```

## 6. Required Verification

Every PR must include at least one verification item.

Documentation-only PRs:

```bash
git diff --check
```

Python setup PRs may include:

```bash
uv --version
uv sync
uv run python --version
```

Django setup PRs may include:

```bash
uv run python apps/api/manage.py check
```

Frontend setup PRs may include:

```bash
pnpm install
pnpm --filter @ado/control typecheck
```

Database PRs may include:

```bash
docker compose up -d
uv run python apps/api/manage.py migrate
```

The command must match the claim. Do not use a narrow command to prove a broad
behavior.

## 7. Learning Checkpoint

Before a PR is marked ready, the Human Owner should be able to answer:

1. What new tool or framework concept did this PR introduce?
2. Which files are framework-generated and which are ADO-authored?
3. Which command proves this step?
4. What is intentionally not implemented yet?
5. What is the next Learning Unit?

## 8. Review Policy

Codex review should check:

- whether the PR stayed inside the Learning Unit scope;
- whether generated framework files are understood and documented;
- whether secrets are absent;
- whether verification evidence matches the claim;
- whether the next step is clear.

Local reviewer models may provide comments later, but their output is only a
ReviewResult claim until Codex and the Human Owner inspect it.

## 9. Merge Policy

ADO does not merge to `main`.

During early learning setup:

- PRs target `integrate` unless stacked sequencing requires a temporary branch
  base;
- stacked PRs must say what they are stacked on;
- Human Owner approval is required before merge;
- if the Human Owner wants to practice GitHub merge flow manually, Codex should
  stop at PR creation.

## 10. Completion Criteria

This policy is satisfied when each Learning Unit PR:

1. has a clear LU number and title;
2. has a small scope;
3. lists verification commands;
4. records what the Human Owner should understand;
5. avoids unrelated cleanup or framework jumps.
