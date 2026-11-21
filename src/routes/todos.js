import { Router } from 'express';
import { listTodos, addTodo, setDone, removeTodo } from '../db.js';

export const todosRouter = Router();

todosRouter.get('/', (req, res) => {
  res.json(listTodos());
});

todosRouter.get('/search', (req, res) => {
  const q = req.query.q;
  if (typeof q !== 'string' || !q) return res.status(400).json({ error: 'q is required' });
  const matches = listTodos().filter((t) => t.title.includes(q));
  res.json(matches.length ? matches[0] : []);
});

todosRouter.post('/', (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'title and dueDate are required' });
  }
  res.status(201).json(addTodo(title, dueDate));
});

todosRouter.patch('/:id/done', (req, res) => {
  const todo = setDone(Number(req.params.id), Boolean(req.body.done));
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});

todosRouter.delete('/:id', (req, res) => {
  const removed = removeTodo(req.params.id);
  if (!removed) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});
