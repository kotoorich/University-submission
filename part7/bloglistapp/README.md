# Bloglist App — Full Stack Open Part 7, Exercises 7.7–7.20

The Part 4/5 blog list app, restructured into a single repository and
extended with error handling, routing polish, Zustand state management,
users views, and comments.

## Structure

```
bloglistapp/
  backend/    Express + MongoDB (exercises 4.x, 7.7, 7.18)
  frontend/   React + Zustand + React Router (exercises 5.x, 7.8-7.20)
```

## Local setup

```bash
cd backend
npm install
cp .env.example .env    # paste a real MongoDB Atlas URI + a SECRET string
npm run dev              # http://localhost:3003

cd ../frontend            # in a second terminal
npm install
npm run dev                # http://localhost:5173, proxies /api to :3003
```

### Building for production (exercise 7.7)

```bash
cd backend
npm run build:ui    # builds the frontend and copies dist/ in here
npm start             # serves the whole app from :3003
```

## What's implemented

- **7.7**: single repository, separate `package.json`s, `build:ui` script,
  backend serves the frontend's `dist` via `express.static`.
- **7.8**: `ErrorBoundary` (a class component, as React requires) wraps the
  routed content in `App.jsx` — the nav bar stays outside it, so a
  rendering error anywhere in a route still leaves navigation usable.
- **7.9**: an unmatched path renders `NotFound` via React Router's splat
  route (`path="*"`).
- **7.10**: Prettier configured for both `backend` and `frontend`
  (`npm run format` in either).
- **7.11–7.14**: state management rewritten with **Zustand** (chosen over
  the React Query + Context alternative):
  - `notificationStore` — success/error messages, auto-clearing after 5s
    with a guard against a stale timeout clearing a newer message
  - `userStore` — login state, persisted via `persistentUser` (7.15),
    wiring the auth token into the blog service on both login and startup
  - `blogStore` — fetch/create/like/delete/comment, all through
    `services/blogs.js`
- **7.15**: `services/persistentUser.js` extracts all `localStorage`
  access; `hooks/useField.js` is used in both `LoginForm` and `BlogForm`.
- **7.16, 7.17**: `UsersView` (a table of every user and their blog count,
  each name linking to...) and `UserView` (that user's individual blogs).
- **7.18, 7.19**: comments are anonymous (no auth) — a `comments: [String]`
  array on the backend `Blog` model, `POST /api/blogs/:id/comments`
  (validated non-empty, tested), and a comment form + list in `Blog.jsx`.
- **7.20**: styled throughout with `styled-components` (carried over and
  extended from part 5) — nav bar, forms, blog cards, and the new users
  table all have real component-level styles.

## Verification performed before delivery

- **Frontend**: production build succeeds; ESLint clean; **all 13 tests
  actually run and pass** — `Blog.test.jsx`, `BlogForm.test.jsx`, and
  `App.test.jsx` were rewritten to mock the new Zustand stores (via
  `vi.mock` on the store modules) rather than prop-based callbacks, and
  extended with new tests for the 404 page and the users-nav-link.
- **Backend**: installs and lints clean after the comment-model/route
  additions; a new `describe('commenting on a blog', ...)` block covers
  success, empty-comment rejection, and a nonexistent blog id. The server
  was booted live in this sandbox and the empty-comment validation and
  unknown-route 404 were confirmed to respond correctly *before* touching
  the database.
- **Not possible to verify here**: the full MongoDB-backed integration
  tests, for the same reason as part 4 — this sandbox has no MongoDB
  server and can't reach Atlas. See `backend/README.md` (carried over from
  part 4) for what to run yourself once you have a real connection string.
