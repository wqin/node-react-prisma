## Plan: Run Project Locally

TL;DR - Start PostgreSQL with a `librarydb` database and `library` user, run the backend with Maven (Java 17), then run the frontend with `npm`/`pnpm` using Vite.

**Steps**

1. Install prerequisites: Java 17+, Maven, Node.js (18+), and PostgreSQL.
2. Create PostgreSQL database and user matching `backend/src/main/resources/application.properties`.
3. Start backend: use `mvn spring-boot:run` in `backend/` or build jar and run it.
4. Start frontend: install dependencies in `frontend/` and run `npm run dev` (or `pnpm`/`yarn`).
5. Verify backend on `http://localhost:8080` and frontend on Vite dev URL (usually `http://localhost:5173`).

**Relevant files**

- `backend/src/main/resources/application.properties` — datasource and MyBatis mapper-locations.
- `backend/pom.xml` — Java version and Maven run/build.
- `frontend/package.json` — dev/start scripts.

**Verification**

1. Confirm PostgreSQL is reachable at `jdbc:postgresql://localhost:5432/librarydb` using `library` user.
2. Backend logs show Spring Boot started on port 8080.
3. Frontend connects successfully to backend APIs and loads pages.

**Decisions / Assumptions**

- Use local PostgreSQL instance as configured in `application.properties`.
- No additional environment variables are required unless you override `application.properties`.

**Further Considerations**

1. If you prefer in-memory DB for quick dev, switch JPA datasource to H2 and update properties.
2. If exposing the frontend to a different port, adjust proxy or frontend API base URL accordingly.

**Runtime: View Logs & Change Logging Level**

TL;DR - Tail log files for live output; run backend in console for immediate logs; use Spring Boot Actuator `loggers` endpoint to change levels at runtime without restart.

**Steps**

1. Tail combined backend+frontend logs (script uses these files):

```bash
# from repo root
chmod +x start.sh
./start.sh
# or if already running, just follow logs
tail -f backend.log frontend.log
```

2. Run backend in foreground to see logs in console:

```bash
cd backend
mvn -DskipTests spring-boot:run
```

3. Check frontend dev server output (Vite) in console or `frontend.log` (when using `start.sh`).

4. Change log level at runtime with Spring Boot Actuator (recommended):

- Add dependency to `backend/pom.xml`:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

- Expose `loggers` endpoint in `backend/src/main/resources/application.properties`:

```
management.endpoints.web.exposure.include=health,info,loggers
management.endpoint.loggers.enabled=true
```

- Restart backend (once) to load actuator. Then change level at runtime:

```bash
# set DEBUG for package
curl -i -X POST -H "Content-Type: application/json" \
  -d '{"configuredLevel":"DEBUG"}' \
  http://localhost:8080/actuator/loggers/com.example.library

# verify
curl http://localhost:8080/actuator/loggers/com.example.library
```

- Revert to INFO:

```bash
curl -i -X POST -H "Content-Type: application/json" \
  -d '{"configuredLevel":"INFO"}' \
  http://localhost:8080/actuator/loggers/com.example.library
```

**Notes & Safety**

- Actuator endpoints may require security; in production restrict access.
- `log.debug(...)` messages only appear when level <= DEBUG; SLF4J parameterized logging avoids unnecessary string formatting when DEBUG is off.
- Avoid logging sensitive data at DEBUG level.

**Verification**

1. After changing level to DEBUG, `backend.log` (or console) should show controller debug lines like `GET /api/books - page=...`.
2. After reverting, debug lines stop appearing.

**Files referenced**

- `start.sh` — starts processes and writes `backend.log` / `frontend.log`.
- `backend/src/main/resources/application.properties` — existing logging config `logging.level.com.example.library=DEBUG` can be adjusted.
