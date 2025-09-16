# URL Shortener Service (TypeScript + Node.js + MongoDB)

A secure, SOLID-architected backend to shorten URLs and track analytics (clicks, referrers, countries), with JWT-in-cookies auth, Zod validation, and Jest tests.

## Features
- Short code generation with collision retries
- Duplicate URL handling (per-user + anonymous)
- Click analytics: daily/weekly/monthly, countries, referrers
- Anonymous rate limiting (in-memory, IP based)
- Optional: QR code generation
- JWT in **HttpOnly** cookies
- Zod for request validation
- Helmet, CORS (allowlist), CSRF for unsafe methods (cookie-based)
- Postman collection included
- Unit & integration tests (Jest + Supertest)

## Getting Started
1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm i`
3. Dev: `npm run dev` (requires MongoDB)
4. Build: `npm run build`, Start: `npm start`

## API Docs (Summary)
- `POST /api/auth/register` {email, password}
- `POST /api/auth/login` {email, password} → sets JWT cookie
- `POST /api/auth/logout` → clears cookie
- `POST /api/urls` {originalUrl, expiresAt?} → create short URL (auth optional)
- `POST /api/urls/bulk` [{originalUrl,...}] → bulk shorten (auth required)
- `GET /api/urls/:id` → details (owner-only if private)
- `GET /api/urls/:id/analytics` → clicks by period, countries, referrers
- `GET /:code` → redirect and record click
- `GET /api/urls/:id/qr` → QR PNG (base64)

See the **Postman collection** in `postman/collection.json` for complete examples.

## Security Practices
- Helmet, CORS, CSRF (cookie-based), input validation via Zod
- Strong password hashing (bcrypt), JWT rotation on login
- HttpOnly, Secure (in prod), SameSite Lax cookies
- Error handling avoids leaking internals, uses consistent problem responses

## Tests
- Unit: services, helpers
- Integration: auth, URL create/redirect/analytics

## Folder Structure
```
src/
  config/         # env, logger
  db/             # mongoose connection
  middlewares/    # auth, validate, rateLimit, security, error
  models/         # User, Url, Click
  routes/         # auth, url
  controllers/    # auth, url
  services/       # auth, url
  utils/          # jwt, shortcode, qr
  types/          # express augmentation
  app.ts
  server.ts
```

## License
MIT


## CSRF with Postman / Frontends
This API uses cookie-based CSRF protection for all non-GET methods under `/api`.
**Flow**:
1. `GET /api/csrf` — server sets a CSRF cookie and returns `{ csrfToken }`.
2. For any POST/PUT/PATCH/DELETE to `/api/*`, send header: `x-csrf-token: <csrfToken>`.
   Ensure your HTTP client also sends back the cookie from step 1 (Postman does this automatically).

The provided Postman collection includes a **Get CSRF Token** request which saves `{{csrfToken}}` into collection variables and adds the header automatically for write requests.
