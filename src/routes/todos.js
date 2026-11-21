import { Router } from 'express';
import { listTodos, addTodo, setDone, removeTodo } from '../db.js';
export const todosRouter = Router();
todosRouter.get('/', (req, res) => {
  res.json(listTodos());
});
todosRouter.post('/', (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'title and dueDate are required' });
  }
  res.status(201).json(addTodo(title, dueDate));
});
todosRouter.patch('/:id/done', (req, res) => {
  const done = req.body.done;
  if (typeof done !== 'boolean') {
    return res.status(400).json({ error: 'done must be a boolean' });
  }
  const todo = setDone(Number(req.params.id), done);
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});
todosRouter.delete('/:id', (req, res) => {
  const removed = removeTodo(Number(req.params.id));
  if (!removed) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});
