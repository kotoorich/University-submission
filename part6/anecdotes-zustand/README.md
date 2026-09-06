# Anecdotes (Zustand) — Full Stack Open Part 6, Exercises 6.2–6.15

## Local setup

```bash
npm install
npm run server    # json-server on http://localhost:3001, seeded from db.json
npm run dev       # in a second terminal
```

## Running the store tests

```bash
npm test
```

**Actually run in this environment — all 9 tests pass**, following the
course material's exact mocking pattern (`vi.mock('./services/anecdotes')`,
`renderHook`/`act` from `@testing-library/react`):
- exercise 6.12: `initialize` loads anecdotes from the (mocked) service
- exercise 6.13: `useAnecdotes` returns anecdotes sorted by votes, descending
- exercise 6.14: `useAnecdotes` returns the correctly filtered list,
  case-insensitively, including the empty-result case
- exercise 6.15: `vote` increases an anecdote's vote count
- plus `create`, `remove`, and `useFilter` for good measure

## What's implemented

- **6.1** is in the sibling `unicafe-zustand` project.
- **6.2–6.5**: voting, adding anecdotes (uncontrolled form), split into
  `AnecdoteList`/`AnecdoteForm` components, sorted descending by votes using
  `Array.toSorted` (never mutates Zustand state).
- **6.6**: filtering via a `Filter` component; the filtering logic lives
  inside the store's own `useAnecdotes` selector, so components don't need
  to know the filter exists.
- **6.7–6.9**: all three actions (`initialize`, `create`, `vote`) are async
  store actions that call `src/services/anecdotes.js` (Fetch API) and only
  update state after the server confirms — **actually verified against a
  live json-server in this environment**: fetched 8 seed anecdotes, created
  one, voted on it, deleted it, confirmed the count returned to 8.
- **6.10**: notifications via a separate Zustand store
  (`notificationStore.js`), shown for 5 seconds on vote/create. Includes a
  correctness guard so an earlier notification's timeout can't clear a
  newer one.
- **6.11**: a "remove" button appears only on zero-vote anecdotes, deleting
  from both the store and the backend.

## Verification performed before delivery

- All 9 Vitest store tests actually run, all pass.
- The Fetch-based service module (`services/anecdotes.js`) was run for
  real against a live `json-server` instance in this sandbox - unlike the
  MongoDB-backed backends in earlier parts, this doesn't need external
  network access, so full CRUD (create/vote/delete) was genuinely verified,
  not just written.
- ESLint: run, zero errors/warnings.
- Production build: run, succeeds.
