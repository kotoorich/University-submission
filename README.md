# Full Stack Open — Submission Repository

Structure follows the layout recommended in the course material (part0a — Exercises 1.1-1.2):

```
part1
  courseinfo   exercises 1.1 - 1.5
  unicafe      exercises 1.6 - 1.11
  anecdotes    exercises 1.12 - 1.14
part2
  courseinfo   exercises 2.1 - 2.5  (arbitrary courses/parts, extracted Course module)
  phonebook    exercises 2.6 - 2.17 (CRUD against json-server, services module, notifications)
  countries    exercises 2.18 - 2.20 (REST countries search + OpenWeatherMap)
```

### part2/phonebook — running it locally

This app needs its own backend running (a real backend arrives in Part 3; for now it's json-server against `db.json`):

```bash
cd part2/phonebook
npm install
npm run server   # starts json-server on http://localhost:3001
# in a second terminal:
npm run dev      # starts the Vite dev server
```

### part2/countries — running it locally

Needs a free API key from https://openweathermap.org for the weather feature (exercise 2.20):

```bash
cd part2/countries
npm install
cp .env.example .env
# edit .env and paste your real key in place of the placeholder
npm run dev
```

## Running any app

Each app folder is an independent Vite project. `cd` into it and run:

```bash
npm install
npm run dev      # start dev server, usually at http://localhost:5173
npm run build    # production build into dist/
npm run lint     # ESLint — should report zero problems
```

## Status

- **Part 1 — complete.** All 14 exercises (1.1–1.14). Every app installs, builds, and lints with zero warnings/errors, verified before delivery.
- **Part 2 — complete.** All 20 exercises (2.1–2.20). Every app installs, builds, and lints with zero warnings/errors. The phonebook's full CRUD flow (create, update, delete, duplicate-detection) was additionally verified live against a running json-server before delivery.
- Part 3 onward: next.

Note: `node_modules` and `dist` are intentionally not included (see each app's `.gitignore`) — run `npm install` after downloading.
