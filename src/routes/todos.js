import { Router } from 'express';
import { listTodos, addTodo, setDone, removeTodo, renameTodo } from '../db.js';

export const todosRouter = Router();

todosRouter.get('/', (req, res) => {
  const todos = listTodos();
  if (req.query.overdue === 'true') {
    const now = new Date();
    return res.json(todos.filter((t) => !t.done && t.dueDate < now));
  }
  res.json(todos);
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

todosRouter.patch('/:id/title', (req, res) => {
  const todo = renameTodo(req.params.id, req.body.title);
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});
