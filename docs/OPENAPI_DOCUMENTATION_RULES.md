# OpenAPI Documentation Rules

Date: 2026-07-05

## Purpose

ADO API 문서는 Swagger UI 확인과 프론트엔드 OpenAPI client 생성을 함께 만족해야 한다.

OpenAPI 문서화의 우선순위:

1. 실제 API 응답과 문서가 다르지 않아야 한다.
2. 프론트엔드가 `ApiResponse<T>` wrapper를 타입으로 인식할 수 있어야 한다.
3. 컨트롤러는 읽을 수 있는 수준으로 유지한다.

## Common Response Wrapper

모든 ADO API 응답은 공통 wrapper를 사용한다.

```json
{
  "success": true,
  "code": "OK",
  "message": "요청이 성공했습니다.",
  "data": {},
  "errors": []
}
```

규칙:

- Domain DTO는 `ApiResponse<T>`를 상속하지 않는다.
- Domain DTO는 항상 `data` 안에 들어간다.
- 성공 응답의 `data` 타입은 컨트롤러 반환 타입으로 표현한다.
- 실패 응답의 `data`는 `null`이고, `errors`는 빈 배열 또는 필드 오류 배열이다.

## Success Response Documentation

성공 응답은 컨트롤러 메서드의 반환 타입을 OpenAPI schema로 사용한다.

사용 어노테이션:

```java
@OkResponse
@CreatedResponse
```

내부 기준:

```java
@ApiResponse(
        responseCode = "200",
        description = "요청 성공",
        useReturnTypeSchema = true,
        content = @Content(mediaType = "application/json")
)
```

이 방식은 `ApiResponse<List<AdoProjectResponse>>`,
`ApiResponse<AdoProjectResponse>` 같은 반환 타입을 문서에 반영하기 위한 기준이다.

## Error Response Documentation

실패 응답은 실제 응답 바디가 있으므로 response code만 적지 않는다.

필수 기준:

- `content`에 `application/json`을 명시한다.
- schema는 공통 `ApiResponse`를 사용한다.
- 대표 예시에는 실제 `ErrorCode.name()` 값을 넣는다.

예시:

```java
@ApiResponse(
        responseCode = "409",
        description = "프로젝트 키 중복",
        content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(...)
        )
)
```

현재 문서화된 실패 응답:

- `400 VALIDATION_FAILED`
- `404 PROJECT_NOT_FOUND`
- `409 PROJECT_KEY_ALREADY_EXISTS`

## Controller Annotation Rule

컨트롤러에는 endpoint-specific 정보만 남긴다.

컨트롤러에 남기는 것:

- `@Tag`
- `@Operation`
- 필요한 `@Parameter`
- HTTP mapping annotation
- JSON API의 `produces` / `consumes` media type

Media type note:

- Spring MVC는 `@RestController`와 Jackson converter를 통해 보통 명시하지 않아도 JSON으로 응답한다.
- ADO에서는 OpenAPI contract를 명확히 하기 위해 JSON API controller에 `produces = application/json`을 명시한다.
- Request body가 있는 JSON endpoint에는 `consumes = application/json`을 명시한다.

커스텀 문서 어노테이션으로 분리하는 것:

- 반복되는 성공 응답
- 반복되는 validation 응답
- 여러 endpoint에서 재사용 가능한 도메인 오류 응답

현재는 endpoint-level composed annotation을 만들지 않는다.

예를 들어 아래 형태는 아직 도입하지 않는다.

```java
@FindProjectsDocs
@GetMapping
```

이유:

- `@Operation`은 각 endpoint의 의도를 바로 보여준다.
- response metadata만 분리해도 컨트롤러 소음이 충분히 줄어든다.
- endpoint-level annotation은 endpoint 수가 늘어나서 controller docs가 다시 복잡해질 때 검토한다.

## Frontend Client Rule

프론트엔드는 `/v3/api-docs`로 타입을 생성할 수 있다.

권장 흐름:

```text
Spring Boot /v3/api-docs
-> openapi-typescript generated schema
-> typed low-level client
-> domain wrapper client
-> UI components
```

컴포넌트는 low-level OpenAPI client를 직접 호출하지 않는다.

컴포넌트에서 피할 것:

- `/v1/projects` 같은 URL 문자열 반복
- `ApiResponse<T>` unwrap 반복
- `GET`, `POST` 같은 low-level 호출 직접 사용

도메인 client가 담당할 것:

- typed OpenAPI client 호출
- `ApiResponse<T>` unwrap
- 실패 응답을 프론트엔드 API error로 변환
- UI에는 domain payload만 반환

## Verification Checklist

OpenAPI 변경 후 확인한다.

```bash
./gradlew :apps:api:test
./gradlew :apps:api:bootRun
curl http://localhost:8080/v3/api-docs
curl http://localhost:8080/swagger-ui.html
```

`/v3/api-docs`에서 확인할 것:

- `Projects` tag
- `GET /v1/projects`
- `GET /v1/projects/{id}`
- `POST /v1/projects`
- `ApiResponse` schema
- `ApiFieldError` schema
- project request/response schemas
- expected response codes: `200`, `201`, `400`, `404`, `409`
- error responses include `application/json` content and examples
