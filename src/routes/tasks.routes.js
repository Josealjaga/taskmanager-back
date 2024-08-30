import { Router } from "express";

import { getAllTask, getTaskById, createTask, updateTask, deleteTask } from "./../controllers/tasks.controller.js";

const tasksRouter = Router();

tasksRouter.get('/', getAllTask);
tasksRouter.get('/:id', getTaskById);
tasksRouter.post('/', createTask);
tasksRouter.put('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;