# ADO Control App Agent Bootstrap

Before substantial work in this app, follow the repository-level ADO bootstrap:

```text
/Users/iminhyeog/dev/agent/ado-platform-control-ui/AGENTS.md
```

Use Obsidian MCP to load the shared ADO context. If Obsidian MCP is unavailable, stop and tell the user.

Before implementation, report the startup marker `ADO_BOOTSTRAP_LOADED` and list the bootstrap files, Obsidian notes, ADO specs, and repo-local docs that were read.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
