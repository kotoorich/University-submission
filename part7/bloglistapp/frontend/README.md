# Bloglist Frontend — Full Stack Open Part 5

**Status: all 31 exercises (5.1–5.31) complete.**

## Local setup

Needs the part4 bloglist-backend running:

```bash
npm install
npm run dev      # http://localhost:5173, proxies /api to http://localhost:3003
```

## Running the component/unit tests

```bash
npm test
```

**Actually run in this build environment — all 10 tests pass:**

- `components/Blog.test.jsx` (4 tests, exercise 5.27): unauthenticated
  users see info+likes but no buttons; a logged-in non-creator sees only
  "like"; the creator sees both "like" and "remove"; clicking "like" twice
  calls the handler twice.
- `components/BlogForm.test.jsx` (1 test, exercise 5.16): submitting calls
  `createBlog` with the exact typed `{ title, author, url }`.
- `tests/App.test.jsx` (5 tests) — routing smoke tests using
  `MemoryRouter` with the blog service mocked: the root path shows the
  public blog list without requiring login; `/login` shows the login
  form; `/blogs/:id` shows that blog's public details; `/blogs/new`
  redirects an unauthenticated visitor to `/login`; clicking a blog's
  title in the list actually navigates to its detail page. These don't
  need a real backend, so they could be genuinely verified here.

## What's implemented

- **5.1–5.12**: login persisted to `localStorage`, blog CRUD, notifications,
  sort-by-likes, delete-if-creator, ESLint per the exercise's exact config.
- **5.13–5.16**: Vitest + React Testing Library component tests (see above).
- **5.17–5.23, 5.28**: Playwright E2E tests in the sibling
  `part5/bloglist-e2e` project — see that folder's own README for what was
  verified (test discovery/structure) vs. what needs your own machine to
  actually run (real browser binaries).
- **5.24–5.26**: React Router — `/` (public blog list), `/login`,
  `/blogs/:id` (public single-blog view), `/blogs/new` (auth-gated).
  Creating or deleting a blog redirects back to `/`.
- **5.27**: `Blog.jsx`'s visibility rules rewritten and retested for the
  routed single-blog view (see `Blog.test.jsx` above).
- **5.29–5.31**: styled with `styled-components` throughout — the nav bar,
  blog list, single-blog view, and both forms all have real component-level
  styles (colors, spacing, hover states) rather than one global stylesheet.

## Verification performed before delivery

- All 10 Vitest tests actually run, all pass (details above).
- ESLint: run, zero errors/warnings, across every change including the
  routing rewrite and the styled-components pass.
- Production build (`npm run build`): run, succeeds, at every stage of
  the rewrite (routing, then styling) rather than only at the end — so
  each change was validated before building on top of it.
- **Not possible to verify here:** actually navigating the running app in
  a real browser (this sandbox has no display/browser), and the Playwright
  E2E suite's real execution (see `part5/bloglist-e2e/README.md`). The
  Vitest routing tests (`App.test.jsx`) exist specifically to cover as much
  of that gap as is honestly possible without a real browser.
