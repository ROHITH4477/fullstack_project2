# Full-Stack Functional Checklist

Date: 2026-04-04
Project: StayVista India

## A) Frontend checks
- [x] Lint passes (`npm run lint`)
- [x] Unit tests pass (`npm run test -- --run`)
- [x] Production build passes (`npm run build`)
- [x] Dev server starts on strict port 8080 (`npm run dev -- --host --port 8080 --strictPort`)
- [x] Frontend reachable (`http://localhost:8080` returned HTTP 200)
- [x] Browser title branding is updated to `StayVista India`

## B) Backend checks
- [x] Backend test suite passes (`mvn test`)
- [x] Health endpoint works (`GET /api/health` = 200)
- [x] Swagger UI reachable (`GET /swagger-ui.html` = 200)
- [x] Public listing API works (`GET /api/homestays` = 200)
- [x] Auth signup works (`POST /api/auth/signup` = 200)
- [x] Auth login works (`POST /api/auth/login` = 200)

## C) Security and auth checks
- [x] JWT-based login is functional
- [x] Refresh token flow covered by integration tests
- [x] Role authorization behavior covered by integration tests
- [x] OAuth2 redirect behavior for unauthenticated protected routes covered by integration tests

## D) Data and architecture checks
- [x] DTO + ModelMapper + Lombok in place
- [x] JPA entities/repositories/services/controllers layered architecture in place
- [x] JPQL + derived query methods in repository layer
- [x] Global exception handling via `@ControllerAdvice`
- [x] Logging (SLF4J/Logback) and AOP execution logging configured

## E) Feature checks
- [x] Homestay CRUD APIs present
- [x] Booking APIs present
- [x] Payment APIs present
- [x] Review APIs present
- [x] Attraction APIs present
- [x] Guide APIs present
- [x] File upload/download APIs present
- [x] Email sending service integrated

## F) Notes / Known non-blocking items
- Build warns that main frontend chunk is >500 kB; functional but optimization can be done later.
- Browserslist data warning is informational.
- Mail auth warning may appear in tests when SMTP credentials are not configured; behavior is expected and non-blocking.

## Overall result
- Full-stack functional check: PASS
- Submission readiness: PASS (for implementation/demo scope)
