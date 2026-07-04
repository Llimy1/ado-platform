# ADO Platform Agent Bootstrap

This repository follows the shared ADO agent context in Obsidian and the ADO source-of-truth specs.

This is a monorepo:

- `apps/api` — Spring Boot backend
- `apps/control` — Next.js Control UI frontend

Before substantial work, use Obsidian MCP and read:

1. `Engineering Conventions/General Conventions.md`
2. `Engineering Conventions/AGENTS.md Template.md` heading `템플릿 본문`
3. `Projects/ADO Control Room/Agent Context.md`
4. Then, depending on which app the task touches:
   - `apps/api/**` -> `Projects/ADO Control Room/Backend Context - Spring API.md`
   - `apps/control/**` -> `Projects/ADO Control Room/Frontend Context - Control UI.md`
   - If the task touches both, or the scope is unclear, read both.

Then read the task-relevant ADO source-of-truth specs from:

```text
/Users/iminhyeog/dev/agent/ADO
```

Important candidates:

```text
/Users/iminhyeog/dev/agent/ADO/ADO_MASTER_SPEC.md
/Users/iminhyeog/dev/agent/ADO/ADO_MASTER_SPEC.ko.md
/Users/iminhyeog/dev/agent/ADO/CODING_STANDARDS.md
/Users/iminhyeog/dev/agent/ADO/TESTING_STRATEGY.md
/Users/iminhyeog/dev/agent/ADO/REPOSITORY_RULES.md
/Users/iminhyeog/dev/agent/ADO/RUNTIME_RULES.md
/Users/iminhyeog/dev/agent/ADO/SECURITY_POLICY.md
/Users/iminhyeog/dev/agent/ADO/MANAGED_PROJECT_FILE_STRUCTURE_POLICY.md
/Users/iminhyeog/dev/agent/ADO/MANAGED_PROJECT_MONOREPO_POLICY.md
```

Backend-specific (`apps/api`) additions:

```text
/Users/iminhyeog/dev/agent/ADO/SERVICE_LAYER_RULES.md
/Users/iminhyeog/dev/agent/ADO/STATE_TRANSITION_RULES.md
/Users/iminhyeog/dev/agent/ADO/POLICY_STATE_CONSTRAINTS.md
```

Context priority:

1. ADO source-of-truth specs in `/Users/iminhyeog/dev/agent/ADO/*.md`
2. Obsidian ADO agent context notes under `Projects/ADO Control Room/`
3. Repo-local docs such as `docs/*.md`
4. Existing code

Startup handshake:

Before implementation, report this exact marker:

```text
ADO_BOOTSTRAP_LOADED
```

Then report:

- Bootstrap files loaded
- Obsidian notes read
- ADO source-of-truth specs read
- Repo-local docs read
- Missing or inaccessible context, if any

Do not start implementation until this startup report is given.

If Obsidian MCP is unavailable, stop and tell the user.
If a required ADO spec cannot be accessed, stop and tell the user.
If rules conflict, stop and ask the user.
Do not continue by guessing.

Learning-first rule:

- If the user says they will implement directly, do not write code for them.
- Explain file locations, structure, examples, and failure causes.
- Only directly edit code when the user explicitly asks the agent to implement or modify code.

API rule:

- ADO API responses use `ApiResponse<T>`.
- Domain DTOs do not extend `ApiResponse`.
- Domain DTOs are placed inside `data`.
- In `apps/control`, UI components should use domain client functions instead of direct low-level API calls.

Verification rule:

- Do not call work complete after typecheck/lint/tests/build only.
- Run the app or API and verify real runtime behavior (or real browser behavior for `apps/control`).
- If the primary verification tool is unavailable, use an equivalent-strength substitute and say exactly what was verified.
