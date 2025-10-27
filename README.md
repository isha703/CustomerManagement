# CustManagement Backend
<img width="1918" height="856" alt="image" src="https://github.com/user-attachments/assets/c7488e98-50ab-42f0-a990-30c82b19f70c" />

Spring Boot backend for customer management with OAuth2 Resource Server (Google) support, PostgreSQL, Flyway, and production-ready configs.

Requirements:
- Java 21
- Maven

Environment variables (examples):

- DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
- SPRING_PROFILES_ACTIVE=prod
- APP_CORS_ALLOWED_ORIGINS

Run locally:


1. Build:
   mvn -DskipTests package

3. Run:
   java -jar target/custmanagement-0.0.1-SNAPSHOT.jar


Security:
- The application is configured as an OAuth2 Resource Server validating JWTs (e.g., from Google). Configure `spring.security.oauth2.resourceserver.jwt.issuer-uri` in your environment or profiles.

Notes:
- CORS is configured to allow http://localhost:8081 by default.
- Use secure environment variables in production and set `spring.profiles.active=prod`.

