# Demo Todo App

A tiny todo API — not a real product, just a fixture that `langgraph-harness` reviews and resolves issues against for demo screenshots.

## Run

```bash
npm install
npm start   # listens on :4000
```

## Test

```bash
npm test
```

## Where are todos stored?

Todos are kept in an in-memory JavaScript array (`src/db.js`). They do **not** survive a server restart — every time the server starts, it begins with the three seed todos defined in `src/db.js`.
