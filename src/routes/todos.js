import { Router } from 'express';
import { listTodos, addTodo, setDone, removeTodo, getTodo } from '../db.js';

export const todosRouter = Router();

todosRouter.get('/', (req, res) => {
  res.json(listTodos());
});

todosRouter.get('/overdue', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.json(listTodos().filter((t) => !t.done && t.dueDate < today));
});

todosRouter.patch('/:id', (req, res) => {
  const todo = getTodo(Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'not found' });
  const { title, dueDate } = req.body;
  if (title !== undefined) todo.title = title;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  res.json(todo);
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
  const removed = removeTodo(Number(req.params.id));
  if (!removed) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});
