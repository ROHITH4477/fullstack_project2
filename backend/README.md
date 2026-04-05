# Tourism Backend (Spring Boot)

This backend is created for your tourism frontend app and includes required syllabus features:
- JWT auth + role-based authorization
- OAuth2 login (Google) as SSO entry
- File upload (multipart)
- Swagger + OpenAPI docs
- DTO + ModelMapper + Lombok
- Spring Data JPA with JPQL/derived queries
- Global exception handling
- Email sending (booking confirmation)
- Logging (SLF4J + Logback)
- AOP execution logging

## Tech stack
- Java 17+
- Spring Boot 3.3.4
- Spring Security
- Spring Data JPA + Hibernate
- PostgreSQL/MySQL drivers
- Lombok
- ModelMapper
- Springdoc OpenAPI

## Run steps
1. Open terminal in backend folder.
2. Copy `.env.example` values into your shell environment.
3. Set at minimum `DB_PASSWORD`, `APP_JWT_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
4. Optional: set mail credentials if you want email feature enabled.
5. Run:

```bash
mvn spring-boot:run
```

## Important URLs
- Health: `http://localhost:2026/api/health`
- Swagger UI: `http://localhost:2026/swagger-ui.html`
- OpenAPI JSON: `http://localhost:2026/api-docs`

## Authentication flow
### Local JWT
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- Use `Authorization: Bearer <token>` for protected APIs.

### OAuth2 / SSO (Google)
- Spring endpoint: `/oauth2/authorization/google`
- On success, backend redirects to:
  `http://localhost:5173/oauth2/success?token=<jwt>`

## Key API groups
- `/api/auth/**`
- `/api/homestays/**`
- `/api/bookings/**`
- `/api/attractions/**`
- `/api/guides/**`
- `/api/reviews/**`
- `/api/payments/**`
- `/api/files/upload`, `/api/files/download/{fileName}`

## React integration notes
- Keep frontend base URL in an env variable:
  `VITE_API_BASE_URL=http://localhost:2026`
- Use Axios/Fetch with JWT in Authorization header.
- Store token in LocalStorage or SessionStorage.

## Role examples
- `ROLE_TOURIST`: booking creation
- `ROLE_HOST`: homestay manage
- `ROLE_ADMIN`: full access + admin endpoints

## Notes
- Roles are auto-seeded at startup.
- Uploaded files are saved in backend `uploads` directory.
- Secrets are loaded from environment variables.
- Use `SPRING_PROFILES_ACTIVE=local` for local and `SPRING_PROFILES_ACTIVE=prod` for production.
