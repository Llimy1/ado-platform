# OpenAPI Project API Progress

Date: 2026-07-04

## Current Branch

```text
ado/openapi-project-api
```

Base state:

```text
integrate
Merge pull request #11 from Llimy1/ado/project-key-db-constraint-mapping
```

## Already Merged Before This Branch

The project API foundation has already been split and merged through smaller branches:

1. PostgreSQL/Flyway and Spring API persistence foundation
2. `POST /v1/projects` duplicate `projectKey` application-level conflict handling
3. `GET /v1/projects/{id}` detail lookup and project not found handling
4. Common `ErrorCode` enum and `BusinessException`
5. Database unique constraint violation mapping for `projectKey`

Current API behavior before OpenAPI work:

- `GET /v1/projects`
- `GET /v1/projects/{id}`
- `POST /v1/projects`
- Common response wrapper: `ApiResponse<T>`
- Validation error response: `VALIDATION_FAILED`
- Duplicate project key response: `PROJECT_KEY_ALREADY_EXISTS`
- Project not found response: `PROJECT_NOT_FOUND`

## Current Branch Scope

This branch adds backend OpenAPI documentation support and prepares the API for typed frontend client generation.

### Springdoc Dependency

Added Springdoc WebMVC UI dependency:

```groovy
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.17'
```

Expected local endpoints after `bootRun`:

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/swagger-ui/index.html
http://localhost:8080/v3/api-docs
http://localhost:8080/v3/api-docs.yaml
```

### OpenAPI Config

Added:

```text
apps/api/src/main/java/com/ado/platform/api/common/api/config/OpenApiConfig.java
```

Current metadata:

- Title: `ADO Platform API`
- Version: `v1`
- Description: `Agent Development Orchestrator API`

The previous lowercase/misplaced config file was replaced:

```text
apps/api/src/main/java/com/ado/platform/api/common/config/openApiConfig.java
```

### CORS Config

Added:

```text
apps/api/src/main/java/com/ado/platform/api/common/api/config/CorsConfig.java
```

Purpose:

- Allow the control UI origin to call `/v1/**`
- Default local origin: `http://localhost:3000`

Configuration:

```properties
ado.control-ui.origin=${ADO_CONTROL_UI_ORIGIN:http://localhost:3000}
```

Environment example:

```text
ADO_CONTROL_UI_ORIGIN=http://localhost:3000
```

### Schema Annotations

Added `@Schema` descriptions/examples to:

```text
apps/api/src/main/java/com/ado/platform/api/common/api/response/ApiResponse.java
apps/api/src/main/java/com/ado/platform/api/common/api/response/ApiFieldError.java
apps/api/src/main/java/com/ado/platform/api/project/api/dto/AdoProjectCreateRequest.java
apps/api/src/main/java/com/ado/platform/api/project/api/dto/AdoProjectResponse.java
```

Important convention:

- Domain DTOs do not extend `ApiResponse`.
- Domain DTOs are documented as the `data` payload inside `ApiResponse<T>`.

### Controller Documentation

Updated:

```text
apps/api/src/main/java/com/ado/platform/api/project/api/AdoProjectController.java
```

Current approach:

- Keep endpoint-specific `@Operation` on controller methods.
- Use custom docs annotations for repeated response documentation.

Reason:

- `@Operation` summary/description is endpoint-specific and still readable in the controller.
- Repeated response annotations are extracted to reduce noise.
- Endpoint-level composed annotations can be considered later if controller docs become too large.

### Custom Docs Annotations

Common response annotations:

```text
apps/api/src/main/java/com/ado/platform/api/common/api/docs/OkResponse.java
apps/api/src/main/java/com/ado/platform/api/common/api/docs/CreatedResponse.java
apps/api/src/main/java/com/ado/platform/api/common/api/docs/ValidationErrorResponse.java
```

Project response annotations:

```text
apps/api/src/main/java/com/ado/platform/api/project/api/docs/ProjectNotFoundResponse.java
apps/api/src/main/java/com/ado/platform/api/project/api/docs/ProjectKeyConflictResponse.java
```

Design decision:

- Use small custom annotations for repeated OpenAPI response metadata.
- Do not create endpoint-level docs annotations yet.

## Frontend Client Direction

The desired frontend direction is:

```text
Spring Boot /v3/api-docs
-> openapi-typescript generated schema
-> typed low-level client
-> domain wrapper client
-> UI components use only domain client functions
```

Preferred UI usage:

```ts
const projects = await projectClient.listProjects();

const created = await projectClient.createProject({
  projectKey: "ado-test",
  name: "ADO Test",
});
```

The UI should avoid:

- Repeating URL strings like `/v1/projects` in components
- Calling low-level `GET`/`POST` directly from components
- Unwrapping `ApiResponse<T>` in every component

Expected wrapper responsibility:

- Call typed OpenAPI client
- Unwrap `ApiResponse<T>`
- Throw a frontend API error for failed ADO responses
- Return the domain payload directly

## Verification Done So Far

Already passed during this branch:

```bash
git diff --check
./gradlew :apps:api:test
```

Remaining verification before PR:

```bash
./gradlew :apps:api:bootRun
curl http://localhost:8080/actuator/health
curl http://localhost:8080/v3/api-docs
curl http://localhost:8080/swagger-ui.html
curl http://localhost:8080/v1/projects
```

Need to confirm in `/v3/api-docs`:

- `Projects` tag appears
- `GET /v1/projects` appears
- `GET /v1/projects/{id}` appears
- `POST /v1/projects` appears
- `ApiResponse` schema appears
- Project request/response schemas appear
- Response codes `200`, `201`, `400`, `404`, `409` appear where expected

## Documentation Rules

The OpenAPI documentation rules are now recorded in:

```text
docs/OPENAPI_DOCUMENTATION_RULES.md
```

Current decisions:

- Success responses use `useReturnTypeSchema = true`.
- Error responses explicitly document `application/json` content with the common `ApiResponse` schema.
- Error responses include representative examples with real ADO error codes.
- Controller methods keep endpoint-specific `@Operation` metadata.
- Repeated response metadata stays in custom docs annotations.
- Endpoint-level docs annotations remain deferred.

## Remaining Work On This Branch

1. Verify Swagger UI and `/v3/api-docs` output with running API server.
2. Confirm generated OpenAPI output includes response codes and error content schemas.
3. Commit and push `ado/openapi-project-api`.
4. Create PR into `integrate`.
5. Merge after review/checks.
6. Start frontend OpenAPI client integration with Claude Code.

## Deferred Decisions

### Endpoint-Level Docs Annotations

Possible later shape:

```java
@FindProjectsDocs
@GetMapping
public ApiResponse<List<AdoProjectResponse>> findProjects() {
    ...
}
```

Current decision:

- Do not introduce yet.
- Keep `@Operation` visible in the controller.
- Revisit when more endpoints make the controller too noisy.

### OpenAPI Client Packaging

Current recommendation:

- Keep generated client inside the UI repo first.

Deferred option:

```text
@ado-platform/api-client
```

This can be introduced later if multiple frontends or external consumers need the same client.
