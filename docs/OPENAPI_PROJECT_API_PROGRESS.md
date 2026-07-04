# OpenAPI Project API Summary

Date: 2026-07-05

## Merge Status

```text
PR #12 Document project API with OpenAPI
https://github.com/Llimy1/ado-platform/pull/12
```

Status:

```text
Merged into integrate
```

Merge commit:

```text
fec53fd Merge pull request #12 from Llimy1/ado/openapi-project-api
```

Branch commits:

```text
70fba45 Add ADO agent bootstrap docs
a72dd87 Document project API with OpenAPI
```

## Already Merged Before OpenAPI

The project API foundation has already been split and merged through smaller branches:

1. PostgreSQL/Flyway and Spring API persistence foundation
2. `POST /v1/projects` duplicate `projectKey` application-level conflict handling
3. `GET /v1/projects/{id}` detail lookup and project not found handling
4. Common `ErrorCode` enum and `BusinessException`
5. Database unique constraint violation mapping for `projectKey`

API behavior before OpenAPI work:

- `GET /v1/projects`
- `GET /v1/projects/{id}`
- `POST /v1/projects`
- Common response wrapper: `ApiResponse<T>`
- Validation error response: `VALIDATION_FAILED`
- Duplicate project key response: `PROJECT_KEY_ALREADY_EXISTS`
- Project not found response: `PROJECT_NOT_FOUND`

## Implemented Scope

This work added backend OpenAPI documentation support and prepared the API for typed frontend client generation.

### Springdoc Dependency

Added Springdoc WebMVC UI dependency:

```groovy
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.17'
```

Local documentation endpoints after `bootRun`:

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
- Declare JSON media types on the controller mapping.

Reason:

- `@Operation` summary/description is endpoint-specific and still readable in the controller.
- Repeated response annotations are extracted to reduce noise.
- `produces = application/json` and `consumes = application/json` make the HTTP/OpenAPI contract explicit.
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
- Success responses use the controller return type schema with `application/json`.
- Error responses document `application/json` content, common `ApiResponse` schema, and representative examples.
- Do not create endpoint-level docs annotations yet.

Documented response codes:

- `GET /v1/projects`: `200`
- `GET /v1/projects/{id}`: `200`, `404`
- `POST /v1/projects`: `201`, `400`, `409`

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

## Verification Completed

Completed before merge:

```bash
git diff --check
./gradlew :apps:api:test
docker compose --env-file .env -f infra/docker/compose.local.yml ps
./gradlew :apps:api:flywayInfo
./gradlew :apps:api:flywayMigrate
./gradlew :apps:api:bootRun
curl http://localhost:8080/actuator/health
curl http://localhost:8080/v1/projects
curl http://localhost:8080/swagger-ui.html
curl http://localhost:8080/v3/api-docs
curl -X POST http://localhost:8080/v1/projects \
  -H 'Content-Type: application/json' \
  -d '{"projectKey":"ado-test","name":"ADO Test"}'
```

Confirmed runtime results:

- PostgreSQL compose service was `healthy`.
- Flyway schema version was `3`.
- API health returned `{"status":"UP"}`.
- `GET /v1/projects` returned `ApiResponse<List<AdoProjectResponse>>`.
- Swagger UI redirected from `/swagger-ui.html` to `/swagger-ui/index.html`.
- Duplicate `projectKey` POST returned `409 PROJECT_KEY_ALREADY_EXISTS`.

Confirmed in `/v3/api-docs`:

- `Projects` tag appears
- `GET /v1/projects` appears
- `GET /v1/projects/{id}` appears
- `POST /v1/projects` appears
- `ApiResponse` schema appears
- `ApiFieldError` schema appears
- Project request/response schemas appear
- Response codes `200`, `201`, `400`, `404`, `409` appear where expected
- Success and error responses use `application/json`
- Error responses include examples for `VALIDATION_FAILED`, `PROJECT_NOT_FOUND`, and `PROJECT_KEY_ALREADY_EXISTS`

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

## Next Work

1. Frontend OpenAPI client integration in the control UI.
2. Domain wrapper client rule: UI components should call domain client functions, not low-level generated methods directly.
3. Error handling rule for generated client responses.
4. Decide whether endpoint-level docs annotations are needed after more APIs are added.
5. Start the next backend domain design, likely Roadmap table/API or Job/Worker state model.

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
