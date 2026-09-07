# Routed Anecdotes — Full Stack Open Part 7, Exercises 7.1–7.6

Based on the official starter repo
(https://github.com/fullstack-hy2020/routed-anecdotes), cloned directly in
this build environment (its git history was removed per the exercise's own
instruction) rather than reconstructed from memory, so the starting point
matches exactly what a student cloning it themselves would get.

## Local setup

```bash
npm install
npm run server    # json-server on http://localhost:3001
npm run dev         # in a second terminal
```

## What's implemented

- **7.1**: `src/hooks/useField.js` — a custom hook managing one input's
  state, returning `{ type, value, onChange, reset }`; used via
  `<input {...content} />` in `CreateNew`.
- **7.2**: a reset button clears all three fields via each field's
  `reset()`.
- **7.3**: the console warning from spreading a `reset` prop onto a plain
  `<input>` DOM element is fixed by destructuring `reset` out of each field
  *at the point of use*, immediately before spreading the rest onto the
  input — this keeps `useField`'s return shape exactly matching exercise
  7.1's spec (a flat object with `type`/`value`/`onChange`) rather than
  restructuring the hook itself.
- **7.4–7.6**: `src/hooks/useAnecdotes.js` encapsulates all server
  communication (fetch on mount, create, delete). Since exercise 7.6
  requires `AnecdoteList` and `CreateNew` to each call `useAnecdotes()`
  directly instead of receiving anecdotes/callbacks as props, a plain
  `useState` inside the hook would give each component its own
  disconnected copy of the list. Instead the anecdote list lives in module
  scope with a small listener-list so every hook instance stays in sync —
  the same problem `useSyncExternalStore` is designed for, solved by hand
  since this chapter comes before any state-management library is
  introduced. `services/anecdotes.js` also gained a `remove` function,
  which the starter repo's description says is intentionally missing.

## Verification performed before delivery

- ESLint: run, zero errors/warnings.
- Production build: run, succeeds.
- **The tricky cross-component sync behavior was actually tested, not just
  reasoned about**: a temporary integration test (`@testing-library/react`
  + `user-event`) rendered the real `App`, navigated to `/create`, filled
  in and submitted the form against a live `json-server` instance, and
  confirmed the new anecdote appeared back on `/` (i.e., a *different*
  component's independent `useAnecdotes()` call saw the update) — then a
  second test confirmed deleting removed it again. Both passed. This test
  was temporary (it isn't part of what the exercises ask for, and this repo
  has no test tooling installed), so it was removed after confirming the
  design works, along with the test dependencies used only to run it.
