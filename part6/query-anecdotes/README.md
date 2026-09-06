# Query Anecdotes — Full Stack Open Part 6, Exercises 6.16–6.22

TanStack Query for server state + React Context (with `useReducer`) for
notifications - a deliberately different app from `anecdotes-zustand`,
matching the course's two independent tracks for this part.

## Local setup

This app ships a small custom Express server (`server.cjs`) instead of
plain json-server, because the exercise requires server-side validation
(anecdote content must be at least 5 characters) with a real error
response for exercise 6.21 to handle.

```bash
npm install
npm run server    # custom Express server on http://localhost:3001
npm run dev        # in a second terminal
```

## What's implemented

- **6.16**: anecdotes fetched via `useQuery`; if the server is unreachable,
  only an error message is rendered (`result.isError`), with `retry: 1` so
  the failure surfaces quickly instead of retrying for a while first.
- **6.17**: creating an anecdote via `useMutation`, using
  `queryClient.setQueryData` to update the cache directly (the
  "optimizing performance" approach from the material) rather than
  invalidating and re-fetching.
- **6.18**: voting via the same `setQueryData` pattern.
- **6.19**: the TanStack Query calls live in `requests.js`, kept separate
  from the components.
- **6.20**: notifications via `NotificationContext.jsx` (`createContext` +
  `useReducer`), shown for 5 seconds on create/vote.
- **6.21**: the custom server rejects anecdotes under 5 characters with a
  `400` and an `{ error: "..." }` body; the mutation's `onError` callback
  shows that message as a notification.
- **6.22**: the context lives in its own file, and a custom `useNotify`
  hook (plus a symmetrical `useNotification` for reading the message)
  means components never call `useContext`/`dispatch` directly.

## Verification performed before delivery

- **The custom server was actually run and tested live in this sandbox**
  (this doesn't need external network access, unlike MongoDB): `GET
  /anecdotes` returns the seed data; `POST` with valid content returns
  `201` with a generated id; `POST` with 2-character content correctly
  returns `400` with the exact error message the frontend's `onError`
  handler expects; `PUT` updates votes correctly. Also confirmed the
  connection-refused behavior when the server isn't running, which is what
  drives the `result.isError` error-page branch (exercise 6.16).
- ESLint: run, zero errors/warnings.
- Production build: run, succeeds.
- **Not verified:** the app's behavior in an actual browser (no display in
  this sandbox) - the query/mutation logic follows the exact patterns
  demonstrated working in the course material, and the server-side half of
  every flow was independently confirmed above.
