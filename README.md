# node-ecommerce-api

E-commerce REST API for learning Node.js from a Laravel background. The code stays small on purpose: one resource, one in-memory store, and the same layering you will keep when the database arrives.

## Goal

Ship a JSON API a storefront can call: products, then (later) auth, cart, and orders. This repository is the backend only. Phase 1 is the Node project itself — process entry, config, routing, and a first CRUD — plus a few scripts that show how Node differs from PHP.

## Tech stack

| Piece    | Choice                            | When    |
| -------- | --------------------------------- | ------- |
| Runtime  | Node.js 20+ LTS (developed on 22) | now     |
| HTTP     | Express 5                         | now     |
| Config   | dotenv                            | now     |
| Database | Prisma + MySQL                    | Phase 4 |
| Auth     | JWT                               | Phase 5 |

There is **no `prisma/` folder yet**. Prisma is installed in Phase 4, and that is when `DATABASE_URL` in `.env` starts to matter. The products you create now live in an array inside `src/services/product.service.js` and disappear when the process exits. `npm run dev` uses `node --watch`, which restarts the process on save and clears that array too.

## Phase roadmap

- [x] **Phase 1 — Setup & fundamentals.** Tooling, folder layout, health check, in-memory products CRUD, error middleware, learning scripts.
- [ ] **Phase 2 — Routing & controllers.** More resources, query filters, and route organization on top of the Phase 1 layering.
- [ ] **Phase 3 — Validation & errors.** Move the inline checks into `src/validators/` (Form Requests) and tighten the error shape.
- [ ] **Phase 4 — Prisma + MySQL.** Add `prisma/schema.prisma`, migrations, and replace the in-memory product service. `DATABASE_URL` is the commented placeholder in `.env.example`.
- [ ] **Phase 5 — Auth JWT.** Register, login, and protected routes.
- [ ] **Phase 6 — Cart & orders.**
- [ ] **Phase 7 — Testing & deploy.** Supertest against `src/app.js` (no listening socket), then a production start path.

## Install and run

```bash
cp .env.example .env   # optional — defaults are PORT 3000 and NODE_ENV=development
npm install
npm run dev            # node --watch src/server.js
```

Production-style start (no file watcher):

```bash
npm start
```

Lint and format:

```bash
npm run lint
npm run format
```

The server logs `Server listening on http://localhost:3000 (development)`.

## Endpoints

Resource responses use one envelope: `{ "success": true, "data": ... }`. Lists add `meta.count`. Errors use `{ "success": false, "message": "..." }` and, outside production, a `stack` on 500s. `GET /api/health` is the exception: it is a probe, not a resource.

| Method | Path                   | Status          | Notes                                         |
| ------ | ---------------------- | --------------- | --------------------------------------------- |
| GET    | `/api/health`          | 200             | `{ status, uptime, timestamp }`               |
| GET    | `/api/v1/products`     | 200             | Seeded with two products                      |
| GET    | `/api/v1/products/:id` | 200 / 404       |                                               |
| POST   | `/api/v1/products`     | 201 / 400       | `name` and `price` required                   |
| PUT    | `/api/v1/products/:id` | 200 / 400 / 404 | Full write of name, price, description, stock |
| PATCH  | `/api/v1/products/:id` | 200 / 400 / 404 | Only the fields you send                      |
| DELETE | `/api/v1/products/:id` | 204 / 404       | Empty body                                    |

```bash
curl -s http://localhost:3000/api/health

curl -s http://localhost:3000/api/v1/products

curl -s http://localhost:3000/api/v1/products/1

curl -s -X POST http://localhost:3000/api/v1/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Wool Scarf","price":32,"stock":8}'

curl -s -X PUT http://localhost:3000/api/v1/products/3 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Wool Scarf","description":"Soft stripe","price":36,"stock":8}'

curl -s -X PATCH http://localhost:3000/api/v1/products/3 \
  -H 'Content-Type: application/json' \
  -d '{"stock":5}'

curl -s -o /dev/null -w '%{http_code}\n' -X DELETE http://localhost:3000/api/v1/products/3
```

Unknown routes return 404 JSON. A non-integer id returns 400. The two seeded rows come back after every restart: Canvas Tote (`id` 1) and Ceramic Mug (`id` 2).

## Why `app.js` and `server.js` are split

`src/app.js` registers middleware and routes and exports the Express app. `src/server.js` calls `listen`. Tests in Phase 7 import the app and pass it to Supertest, which sends fake requests in-process. If `listen` lived in the same file as the routes, importing the app in a test would try to bind port 3000.

Express 5 sends async errors to `src/middlewares/errorHandler.js` on its own. Express 4 did not, so most tutorials wrap handlers in a helper called `asyncHandler`. This project does not: the comment in `src/routes/v1/product.routes.js` is the note to remember when you read older code.

## Laravel → this project

| Laravel                                | This project                                                |
| -------------------------------------- | ----------------------------------------------------------- |
| `routes/api.php`                       | `src/routes/`                                               |
| `app/Http/Controllers`                 | `src/controllers/`                                          |
| Service / Action class                 | `src/services/`                                             |
| `app/Http/Middleware`                  | `src/middlewares/`                                          |
| `app/Http/Requests` (Form Requests)    | `src/validators/` (Phase 3)                                 |
| `app/Exceptions/Handler.php`           | `src/middlewares/errorHandler.js`                           |
| `config/*.php` and `.env`              | `src/config/env.js` and `.env`                              |
| `public/index.php` and `artisan serve` | `src/server.js`                                             |
| HTTP kernel (`bootstrap/app.php`)      | `src/app.js`                                                |
| Eloquent models                        | Prisma models (Phase 4)                                     |
| `database/migrations`                  | `prisma/migrations` (Phase 4 — not created yet)             |
| `abort(404)`                           | `throw new ApiError(404, '...')` in `src/utils/ApiError.js` |
| `helpers.php`                          | `src/utils/`                                                |

A few Node habits that do not exist in Laravel:

- Relative imports end in `.js` (`import app from './app.js'`). There is no class autoloader.
- `"type": "module"` in `package.json` means `import`/`export`. A `.cjs` file is how you opt into `require`. See `learning/`.
- `async` route handlers return Promises. A `throw` inside one rejects that Promise; Express 5 forwards it to the error middleware.

## Learning scripts

Standalone. They do not boot Express.

```bash
node learning/01-event-loop.js
node learning/02-callbacks-promises-async.js
node learning/03-raw-http-server.js    # curl http://localhost:3001/  then Ctrl+C
node learning/04-esm.js
node learning/04-commonjs.cjs
```

| File                                      | What it shows                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `learning/01-event-loop.js`               | ESM: Promise then `nextTick`, then timers. Inside I/O: `nextTick`, Promise, `setImmediate`, `setTimeout` |
| `learning/02-callbacks-promises-async.js` | Callback → `new Promise` → `util.promisify` → `fs/promises` → `async/await`                              |
| `learning/03-raw-http-server.js`          | `node:http`, the API Express wraps                                                                       |
| `learning/04-esm.js`                      | `import`, `import.meta.url`, no `__dirname`                                                              |
| `learning/04-commonjs.cjs`                | `require`, `module.exports`, `__filename`                                                                |

## Project layout

```
src/
  app.js            Express app (middleware + routes)
  server.js         listen()
  config/env.js     dotenv + defaults
  routes/           URL map, versioned under /api/v1
  controllers/      HTTP in, HTTP out
  services/         in-memory products (Prisma later)
  middlewares/      404 and centralized errors
  validators/       empty until Phase 3
  utils/ApiError.js throw-to-status helper
learning/           runnable Node fundamentals
```
