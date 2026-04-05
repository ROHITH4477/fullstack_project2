# Syllabus Mapping to Implementation

## Git / Version control
- Use branch workflow with commit/push/pull/merge for backend folder changes.

## Maven
- Implemented in `pom.xml` with dependencies, plugins, and Spring Boot build lifecycle.

## ORM / JPA / Hibernate / CRUD
- Entities: User, Role, Homestay, Booking, UploadedFile.
- Repositories provide CRUD operations.

## HQL/JPQL + parameters + aggregate + paging + sorting
- JPQL queries in `HomestayRepository` (`search`, `averagePrice`).
- Paging/sorting via `Pageable` in Homestay search endpoint.

## Generator classes
- AUTO: Booking
- IDENTITY: User/Role/UploadedFile
- SEQUENCE: Homestay

## Spring / IoC / DI / Autowiring
- Constructor DI across config/service/controller layers.

## Spring Boot config
- `application.properties` + `application.yml` (profile demo).

## Spring Boot MVC flow
- Controllers -> Services -> Repositories -> DB.

## MVC annotations
- `@RestController`, `@RequestMapping`, `@PostMapping`, `@GetMapping`, `@RequestBody`.

## Spring Data JPA architecture
- DAO/Repository + Service layer implemented.

## REST web services + ResponseEntity
- All controller methods return `ResponseEntity`.

## Derived query methods
- `findBy...`, `countBy...`, `deleteBy...` in repositories.

## Exception handling
- Global handler via `@ControllerAdvice`.

## React integration + CORS
- CORS configured in `SecurityConfig` with frontend URL.

## LocalStorage / SessionStorage
- JWT token strategy documented for frontend integration.

## State management
- Backend supports centralized auth/user state consumption by Context API/Redux.

## JPA relationships + cascade + fetch
- One-to-many, many-to-one, many-to-many in entities.
- Cascade and fetch types used in mappings.

## DTO + ModelMapper + Lombok
- DTO packages added.
- ModelMapper bean + mapping in services.
- Lombok annotations used widely.

## Email sending
- `EmailServiceImpl` via `JavaMailSender`.

## Full-stack integration
- React-ready API endpoints with JWT/OAuth2 security.

## Spring Security + JWT + role-based auth
- JWT service/filter + method/route authorization.

## SSO / JWT vs OAuth
- OAuth2 login route configured as SSO entrypoint.
- JWT issued for API access after auth.

## File upload / multipart
- Multipart upload endpoint and secure storage service.

## Logging
- SLF4J + Logback config and file appender.

## Swagger / OpenAPI
- Springdoc integration with bearer auth definition.

## Spring AOP
- Execution-time logging aspect for service layer.

## Modern architecture concepts
- Current design is API-driven and can be split into microservices later.
