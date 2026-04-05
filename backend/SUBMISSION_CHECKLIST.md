# Backend Submission Checklist (Monday)

## 1) Run and verify backend
- Set env vars (`DB_PASSWORD`, `APP_JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
- Run backend from `backend` folder:
  - `mvn spring-boot:run`
- Verify:
  - Health: `http://localhost:2026/api/health`
  - Swagger UI: `http://localhost:2026/swagger-ui.html`

## 2) Show mandatory syllabus features live
- SSO/OAuth2: open `http://localhost:2026/oauth2/authorization/google`.
- JWT: call `/api/auth/login`, copy `accessToken`, use Bearer token in Swagger.
- Refresh token: call `/api/auth/refresh` with refresh token.
- File upload: call `/api/files/upload` with multipart file.
- Swagger/OpenAPI: show `/swagger-ui.html` and `/api-docs`.
- DTO + ModelMapper + Lombok:
  - DTO layer under `src/main/java/com/tourism/app/dto`
  - ModelMapper config in `src/main/java/com/tourism/app/config/AppConfig.java`
  - Lombok annotations in entities/services/dtos.

## 3) Demo domain workflow
- Create HOST and TOURIST via `/api/auth/signup`.
- Create homestay as HOST (`/api/homestays`).
- Create booking as TOURIST (`/api/bookings`).
- Create payment (`/api/payments`).
- Create and list review (`/api/reviews`).

## 4) Show security enforcement
- Try protected POST without token to show redirect/denial.
- Try TOURIST token on HOST/ADMIN route to show `403 Forbidden`.

## 5) Run tests before submission
- From `backend`:
  - `mvn test`
- Confirm all tests pass.

## 6) Keep secrets safe
- Do not submit real secrets in screenshots or git commits.
- Use environment variables only.
