# Phonebook Backend — Full Stack Open Part 3

Covers exercises 3.1–3.22.

**Live deployment:** _add your Render/Fly.io URL here after deploying (exercise 3.10)._

## Local setup

```bash
npm install
cp .env.example .env
# edit .env: paste your real MongoDB Atlas connection string
npm run dev     # http://localhost:3001, auto-restarts on file changes
```

## The command-line tool (exercise 3.12)

```bash
node mongo.js <your-atlas-password>                    # lists everyone
node mongo.js <your-atlas-password> Anna 040-1234556    # adds an entry
```

Edit the hardcoded cluster URL near the top of `mongo.js` to match your own
Atlas cluster address before using it — the placeholder `cluster0.xxxxx...`
will not work as-is.

## Setting up MongoDB Atlas (needed before anything above will actually work)

This is a step only you can do — it requires creating a real account:

1. Go to https://www.mongodb.com/cloud/atlas and create a free account / free
   shared cluster (M0).
2. Under **Database Access**, create a database user with a username and
   password (not your Atlas login password — a separate DB user).
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) —
   fine for this course exercise, not something you'd do for a real production
   system.
4. Click **Connect > Drivers** on your cluster, copy the connection string,
   replace `<password>` with your DB user's password, and add `/phonebook`
   before the `?` so Mongo knows which database to use.
5. Paste that full string into `.env` as `MONGODB_URI` (and into `mongo.js`'s
   `url` if you want to use the command-line tool).

## Deploying (exercises 3.10, 3.21) — also a manual step

Pick either:

- **Render** (https://render.com) — connect your GitHub repo, set the root
  directory to this backend folder, build command `npm install`, start
  command `npm start`. Add `MONGODB_URI` as an environment variable in
  Render's dashboard (do not commit your real `.env`).
- **Fly.io** (https://fly.io) — run `fly launch` from this directory, then
  `fly secrets set MONGODB_URI=...` before deploying.

After deploying, watch the platform's live logs while you test the app with
a browser and Postman/REST client — the exercise explicitly recommends this.

## Adding the frontend (exercises 3.11, 3.21)

Once `part2/phonebook`'s frontend points at this backend's `/api/persons`
instead of json-server, build it and copy the result in here:

```bash
cd ../../part2/phonebook
npm run build
cp -r dist ../../part3/phonebook-backend/
```

The backend already serves `dist` as static files (`app.use(express.static('dist'))`
in `index.js`), so visiting `http://localhost:3001/` locally, or your deployed
URL, will serve the full application. Note `dist` is intentionally **not**
in `.gitignore` here, per the exercise 3.11 note for Render.

## Linting (exercise 3.22)

```bash
npm run lint
```

Runs clean with zero errors/warnings as delivered.

## Verification performed before delivery

- All Mongoose schema validators (name ≥ 3 chars, phone number format,
  minimum length 8) tested directly against 7 cases — all passed.
- Middleware (`unknownEndpoint`, `errorHandler` for CastError/ValidationError/
  unknown errors) unit-tested directly — all passed.
- Server boots successfully and the non-database-dependent routing/middleware
  chain (404 for unknown routes) was confirmed live.
- ESLint runs with zero warnings/errors.
- **Not possible to verify here:** the actual MongoDB-backed routes
  (GET/POST/PUT/DELETE `/api/persons`) against a real database, since this
  sandboxed environment has no MongoDB server and cannot reach MongoDB Atlas.
  Once you plug in a real `MONGODB_URI`, test these yourself with the
  `.rest` files in `requests/` (VS Code REST Client / Postman) — the routes
  follow the exact patterns from the course material and mirror the ones
  already tested at the schema/middleware level above.
