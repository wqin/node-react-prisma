My Study Java — Personal Library

This repo contains a minimal Java (Spring Boot) backend and a React + TypeScript frontend (Vite) for a personal library app.

Backend (Spring Boot):

- Location: `backend`
- Run:
  - Build and run with Maven:

```bash
cd my-study-java/backend
mvn spring-boot:run
```

- API endpoints:
  - `GET /api/books` — list books
  - `POST /api/books` — create book (JSON body)
  - `GET /api/books/{id}` — get book
  - `DELETE /api/books/{id}` — delete book

Frontend (React + TypeScript):

- Location: `frontend`
- Run:

```bash
cd my-study-java/frontend
npm install
npm run dev
```

Notes:

- Backend uses in-memory H2 database (data is not persisted between restarts).
- Frontend expects backend at the same origin; when running locally, run backend on port 8080 and frontend on 5173; Vite will proxy API requests during development if configured. For quick dev you can run both and use the browser to access the frontend.
