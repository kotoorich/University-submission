# Bloglist Backend — Full Stack Open Part 4

Covers exercises 4.1–4.23: project structure, unit tests (`list_helper`),
integration tests (Supertest against `/api/blogs` and `/api/users`), user
creation with bcrypt, and JWT-based authentication/authorization.

## Local setup

```bash
npm install
cp .env.example .env
# edit .env: paste real MongoDB Atlas connection strings (dev + test) and
# pick any random string for SECRET
npm run dev     # http://localhost:3003, auto-restarts on file changes
```

## Running the tests

```bash
npm test
```

This runs with `NODE_ENV=test` (so `utils/config.js` points at
`TEST_MONGODB_URI` instead of your real database) and
`--test-concurrency=1` (so test files sharing the same database don't run
concurrently and clobber each other's data — see exercise 4.16's note).

**Setting up MongoDB Atlas is a manual step only you can do** — see
`part3/phonebook-backend/README.md` for step-by-step instructions (same
process, just create a second cluster/database, or reuse the same cluster
with different database names for `MONGODB_URI` vs `TEST_MONGODB_URI`).

## What each test file covers

- `tests/list_helper.test.js` — exercises 4.3–4.7 (dummy, totalLikes,
  favoriteBlog, mostBlogs, mostLikes). Pure functions, no database needed.
- `tests/blog_api.test.js` — exercises 4.8–4.14, 4.19, 4.21, 4.23. Full CRUD
  via Supertest, ID field naming, missing-likes default, missing-title/url
  validation, delete-only-by-creator, 401 without a token.
- `tests/user_api.test.js` — exercises 4.15–4.16. User creation, duplicate
  username rejection, password never exposed in responses, minimum-length
  validation for both username and password.

## Verification performed before delivery

- **`list_helper.test.js` (13 tests): actually run, all passed** — these are
  pure functions, no database required.
- **bcrypt hashing/comparison and JWT sign/verify: actually run in
  isolation, all passed** — correct password matches, wrong password
  rejected, tampered/wrong-secret tokens correctly rejected.
- **Server boot and auth middleware: actually run live** — confirmed
  `POST /api/blogs` and `DELETE /api/blogs/:id` correctly return
  `401 { error: 'token missing' }` when no Authorization header is sent,
  _before_ any database call is attempted (exercise 4.23's requirement).
  Unknown routes correctly return 404.
- **ESLint: run, zero errors/warnings.**
- **Not possible to verify here:** `blog_api.test.js` and `user_api.test.js`
  as full integration suites, since they need a real MongoDB to actually
  persist and query data — this sandboxed environment has no MongoDB server,
  can't reach Atlas, and mongodb-memory-server's own binary download is
  blocked by this environment's network policy (confirmed by testing it
  directly). Once you have a real `TEST_MONGODB_URI` in your `.env`, run
  `npm test` yourself — the test logic follows the exact patterns from the
  course material (`beforeEach` seeding, `supertest`, `helper.blogsInDb()`
  etc.) that are demonstrated working throughout part 4's text.
