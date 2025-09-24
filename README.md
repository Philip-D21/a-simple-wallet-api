# Remittra Starter (Node.js + TypeScript + PostgreSQL)

## Setup

- Install deps: `npm install`
- Create a `.env` file with the variables below (optional; defaults work for server health)
- Dev server: `npm run dev`
- Build + start: `npm run build && npm start`
 - Apply DB migrations: `npm run migrate`
 - Open API docs: visit `http://localhost:3000/docs`
 - Postman docs: visit `https://documenter.getpostman.com/view/20202295/2sB3QCRspt#a44e08be-199a-46e0-8113-183ed8269f77`

## .env example
```
PORT=3000
NODE_ENV=development
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=postgres
PGSSL=false
JWT_SECRET=super_secret_change_me
```

## Endpoints

Base URL: `http://localhost:${PORT}` (default 3000)

- Health
  - GET `/health` — service health
  - GET `/db-health` — database connectivity check

- Auth
  - POST `/auth/signup` — body: `{ email, password }` → returns `{ token, user }`
  - POST `/auth/login` — body: `{ email, password }` → returns `{ token, user }`

- Wallet
  - GET `/wallet/balance` — header: `Authorization: Bearer <token>` → returns `{ balance }`
  - POST `/wallet/credit` — header: `Authorization: Bearer <token>`, body: `{ amount }`
  - POST `/wallet/debit` — header: `Authorization: Bearer <token>`, body: `{ amount }`

- Transactions
  - GET `/transactions` — header: `Authorization: Bearer <token>` → returns `{ transactions: [...] }`

## Swagger / API Docs

Swagger UI is hosted at `/docs`. It includes request/response schemas and JWT auth via the Authorize button (choose Bearer and paste the token returned from login/signup).

## Development Notes

- Passwords are hashed with `bcryptjs`.
- JWTs are signed with `jsonwebtoken` using `JWT_SECRET`. Default expiry is 1 day.
- PostgreSQL schema is applied from `src/db/migrations.sql` via `npm run migrate`.



## Docker (optional)

Build and run with Docker Compose:

```
docker compose up --build
```


