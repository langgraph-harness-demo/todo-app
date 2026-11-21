import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { todosRouter } from './todos.js';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/todos', todosRouter);
  return app;
}

test('GET /todos returns the seeded list', async () => {
  const server = makeApp().listen(0);
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/todos`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(await res.json()));
  server.close();
});

test('POST /todos requires a title and dueDate', async () => {
  const server = makeApp().listen(0);
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'missing due date' }),
  });
  assert.equal(res.status, 400);
  server.close();
});

test('PATCH /todos/:id/done rejects non-boolean done values', async () => {
  const server = makeApp().listen(0);
  const { port } = server.address();
  const cases = [
    { done: 'no' },
    { done: 'true' },
    { done: 1 },
    { done: 0 },
    { done: null },
    { done: {} },
    { done: [] },
  ];
  for (const body of cases) {
    const res = await fetch(`http://localhost:${port}/todos/1/done`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    assert.equal(res.status, 400, `expected 400 for done=${JSON.stringify(body.done)}`);
  }
  server.close();
});

test('PATCH /todos/:id/done accepts true and false', async () => {
  const server = makeApp().listen(0);
  const { port } = server.address();
  for (const val of [true, false]) {
    const res = await fetch(`http://localhost:${port}/todos/1/done`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: val }),
    });
    assert.equal(res.status, 200, `expected 200 for done=${val}`);
    const todo = await res.json();
    assert.equal(todo.done, val);
  }
  server.close();
});
