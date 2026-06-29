# Learning Unit Template

## 1. Purpose

Every learning-first implementation step uses this template. The template
keeps the work small enough to understand and review.

Copy this structure into a new document or PR description when starting a
Learning Unit.

## 2. Template

```md
# LU-XX Title

## Goal

One sentence describing what the Human Owner will understand and what the repo
will gain.

## Concept

Explain the framework or architecture idea in plain language.

## Files Touched

- `path/to/file`: why it exists or changes

## Commands

```bash
command --version
command that creates or verifies the step
```

## Expected Output

Describe the important output, not every line.

## Common Failures

- Symptom: what the Human Owner sees
  Cause: likely reason
  Fix: small next action

## Checkpoint Questions

1. What did this file or command create?
2. Why does this belong in ADO Platform?
3. What would break if this step were skipped?

## Verification Evidence

- command:
- result:
- files changed:
- claim proven:
- claim not proven:

## Commit Boundary

Commit when the Human Owner can answer the checkpoint questions and the
verification command passes.
```

## 3. Rules

1. One Learning Unit should introduce one major concept.
2. Do not combine backend, frontend, database, and Worker setup in one unit
   unless the Human Owner explicitly asks to move faster.
3. The Human Owner should be able to explain every new file at the end of the
   unit.
4. Codex must list touched files before editing.
5. Codex must explain commands before running them.
6. A failed command is useful evidence and should be explained, not hidden.
7. Verification evidence must state the exact claim it proves. A narrow command
   must not be used as proof of broad platform readiness.

## 4. Minimum PR Body For A Learning Unit

```md
## Learning Unit

LU-XX: Title

## What I learned / should be able to explain

- ...

## Files changed

- ...

## Verification

- [ ] command
- Claim proven:
- Claim not proven:

## Follow-up

- ...
```

## 5. Completion Standard

A Learning Unit is complete when:

1. the intended files exist;
2. the verification command has been run;
3. the result is recorded in the PR or final summary;
4. the Human Owner can answer the checkpoint questions;
5. no unexplained framework files were created.
