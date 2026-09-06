# Bloglist E2E Tests (Playwright) — Full Stack Open Part 5

Covers exercises 5.17–5.23. A separate npm project, as the course material
specifies, since E2E tests exercise the whole running system rather than
living inside either the frontend or backend codebase.

## Setup and running

Needs both the backend (in test mode) and frontend dev server running:

```bash
# terminal 1
cd part4/bloglist-backend
npm install
npm run start:test    # NODE_ENV=test, so /api/testing/reset is mounted

# terminal 2
cd part5/bloglist-frontend
npm install
npm run dev

# terminal 3
cd part5/bloglist-e2e
npm install
npx playwright install   # downloads browser binaries - see note below
npm test
```

## What each test covers

- **Login form is shown** (5.17) — username/password fields and the login
  button are visible by default.
- **Login succeeds/fails** (5.18) — correct credentials show
  "X logged in"; wrong credentials show the error notification instead.
- **A new blog can be created** (5.19) — after logging in, creating a blog
  makes it visible in the list.
- **A blog can be liked** (5.20) — clicking "like" increments the shown
  like count.
- **The creator can delete their own blog** (5.21) — including handling
  the `window.confirm` dialog Playwright intercepts via the `page.on('dialog', ...)`
  event.
- **Delete button visibility** (5.22) — a second user is created directly
  via the API, adds a blog as themselves, and the logged-in user (not the
  creator) is asserted to *not* see a remove button on that blog.
- **Blogs ordered by likes** (5.23) — three blogs are created and liked
  different amounts, then the rendered order is asserted to match
  descending like count.

## Verification performed before delivery

- **All 8 tests were confirmed to load and be discovered correctly** via
  `npx playwright test --list`, which parses every test file and resolves
  `describe`/`beforeEach`/`test` nesting without needing a browser at all.
  This caught and fixed a real bug: `@playwright/test`'s ESM build (used
  when `package.json` has `"type": "module"`) only exposes a default
  export in the installed version, so the course material's
  `const { test, describe, ... } = require(...)` pattern needs this
  project to stay CommonJS. Confirmed by inspecting the installed
  package's actual exports directly.
- **Not possible to verify here:** actually *running* the tests against
  real browsers. I tried installing Playwright's browser binaries directly
  in this sandbox — the download is blocked by network policy (same kind
  of restriction that blocks MongoDB's binaries for the backend tests),
  confirmed with a real `npx playwright install chromium` attempt, not
  assumed. Run `npx playwright install` yourself once you're on your own
  machine (or CI runner) — Playwright will fetch Chromium/Firefox/WebKit
  normally there.
