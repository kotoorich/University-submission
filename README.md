# Full Stack Open — Submission Repository

Structure follows the layout recommended in the course material (part0a — Exercises 1.1-1.2):

```
part1
  courseinfo         exercises 1.1 - 1.5
  unicafe            exercises 1.6 - 1.11
  anecdotes          exercises 1.12 - 1.14
part2
  courseinfo         exercises 2.1 - 2.5  (arbitrary courses/parts, extracted Course module)
  phonebook          exercises 2.6 - 2.17 (CRUD frontend; now points at the part3 backend)
  countries          exercises 2.18 - 2.20 (REST countries search + OpenWeatherMap)
part3
  phonebook-backend  exercises 3.1 - 3.22 (Express + MongoDB backend, serves part2/phonebook's build)
part4
  bloglist-backend   exercises 4.1 - 4.23 (testing with node:test/Supertest, JWT auth, user-blog relations)
part5
  bloglist-frontend  exercises 5.1 - 5.31 (login, CRUD, tests, routing, styled-components)
  bloglist-e2e       exercises 5.17 - 5.23, 5.28 (Playwright end-to-end tests)
```

## Running any frontend app (part1, part2/courseinfo, part2/countries)

Each is an independent Vite project. `cd` into it and run:

```bash
npm install
npm run dev      # start dev server, usually at http://localhost:5173
npm run build    # production build into dist/
npm run lint     # ESLint — should report zero problems
```

### part2/countries — one extra step

Needs a free API key from https://openweathermap.org for the weather feature (exercise 2.20):

```bash
cd part2/countries
npm install
cp .env.example .env
# edit .env and paste your real key in place of the placeholder
npm run dev
```

## Running the phonebook (part2/phonebook + part3/phonebook-backend)

As of Part 3 (exercise 3.9), the phonebook frontend talks to the real
Express/MongoDB backend instead of json-server — via Vite's dev proxy
(`/api` → `http://localhost:3001`, see `part2/phonebook/vite.config.js`).

```bash
cd part3/phonebook-backend
npm install
cp .env.example .env
# edit .env: paste your real MongoDB Atlas connection string
npm run dev              # backend on http://localhost:3001

# in a second terminal, for frontend hot-reload during development:
cd part2/phonebook
npm install
npm run dev               # frontend dev server, proxies /api to the backend
```

The frontend's production build is already copied into
`part3/phonebook-backend/dist` (exercises 3.11/3.21), so once the backend
is running with a real `MONGODB_URI`, visiting `http://localhost:3001/`
alone serves the whole application — no separate frontend server needed.

**Setting up MongoDB Atlas and deploying to Render/Fly.io (exercises
3.10, 3.21) are manual steps** that require your own accounts and can't be
done from inside this environment. Full step-by-step instructions are in
`part3/phonebook-backend/README.md`.

## Running the bloglist backend (part4)

```bash
cd part4/bloglist-backend
npm install
cp .env.example .env
# edit .env: MONGODB_URI, TEST_MONGODB_URI, and any random SECRET string
npm run dev      # http://localhost:3003
npm test         # runs the full test suite against TEST_MONGODB_URI
```

See `part4/bloglist-backend/README.md` for exactly what was and wasn't
verifiable in this sandboxed build environment (short version: pure-logic
tests, JWT/bcrypt, and the auth middleware were all run live and passed;
the full database-backed integration suite needs your own MongoDB Atlas
connection to execute).

## Running the bloglist frontend (part5 — complete)

```bash
cd part5/bloglist-frontend
npm install
npm run dev       # needs part4/bloglist-backend running on :3003
npm test          # 10 tests - actually pass in this environment, no DB needed
```

See `part5/bloglist-frontend/README.md` for the full breakdown of all 31
exercises and exactly what was verified.

## Running the E2E tests (part5/bloglist-e2e)

```bash
cd part5/bloglist-e2e
npm install
npx playwright install    # downloads real browser binaries - can't be done in this sandbox
npm test                  # needs backend (npm run start:test) + frontend (npm run dev) both running
```

See `part5/bloglist-e2e/README.md` — the test files were verified to load
and be structurally correct (`npx playwright test --list`), but actually
running them against real browsers needs your own machine, since this
sandbox's network policy blocks the browser binary download (confirmed
directly, the same way MongoDB's binaries are blocked for the backend
tests).

## Status

- **Part 1 — complete.** All 14 exercises (1.1–1.14). Every app installs, builds, and lints with zero warnings/errors, verified before delivery.
- **Part 2 — complete.** All 20 exercises (2.1–2.20). Every app installs, builds, and lints with zero warnings/errors. The phonebook's full CRUD flow (create, update, delete, duplicate-detection) was verified live against a running json-server at the time.
- **Part 3 — complete**, with one caveat. All 22 exercises (3.1–3.22):
  builds/lints clean; schema validation (7 cases) and error-handling
  middleware (7 cases) were unit-tested directly and all passed; the server
  boots correctly and static frontend serving was verified live (confirmed
  serving `index.html` and JS bundles with correct status codes/content-types).
  **Not verified:** the live MongoDB-backed CRUD routes themselves, since this
  sandboxed build environment has no MongoDB server and can't reach Atlas.
  Test these yourself with the `.rest` files in `part3/phonebook-backend/requests/`
  once you've connected a real database — see that folder's README.
- **Part 4 — complete.** All 23 exercises (4.1–4.23). See
  `part4/bloglist-backend/README.md` for what was verified live in this
  sandbox vs. what needs your own MongoDB Atlas connection to run.
- **Part 5 — complete.** All 31 exercises (5.1–5.31): login, CRUD,
  Vitest/RTL component tests (10 tests, actually run and pass — see
  `part5/bloglist-frontend/README.md`), Playwright E2E tests (structurally
  verified but not run — real browser binaries are blocked in this sandbox,
  see `part5/bloglist-e2e/README.md`), React Router (public blog list,
  public single-blog view, auth-gated create page), and styling with
  styled-components throughout.

Note: `node_modules` is intentionally not included (see each app's
`.gitignore`) — run `npm install` after downloading. The backend's `dist`
folder (the built frontend) *is* included, matching the exercise 3.11
instruction not to `.gitignore` it.
