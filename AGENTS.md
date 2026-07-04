# ADO Control UI Agent Bootstrap

This repository follows the shared ADO agent context in Obsidian and the ADO source-of-truth specs.

Before substantial work, use Obsidian MCP and read:

1. `Engineering Conventions/General Conventions.md`
2. `Engineering Conventions/AGENTS.md Template.md` heading `템플릿 본문`
3. `Projects/ADO Control Room/Agent Context.md`
4. `Projects/ADO Control Room/Frontend Context - Control UI.md`

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

Frontend API rule:

- ADO API responses use `ApiResponse<T>`.
- Domain DTOs do not extend `ApiResponse`.
- Domain DTOs are placed inside `data`.
- UI components should use domain client functions instead of direct low-level API calls.

Verification rule:

- Do not call work complete after typecheck/lint/build only.
- Run the app and verify real browser behavior or use an equivalent-strength substitute.
