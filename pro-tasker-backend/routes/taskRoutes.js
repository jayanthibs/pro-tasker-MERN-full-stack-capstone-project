import express from 'express';
import { authMiddleware } from '../utils/auth.js';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskControllers.js';

const router = express.Router();

router.use(authMiddleware);

//POST /api/projects/:projectId/tasks
router.post('/:projectId/tasks', createTask);

//GET /api/projects/:projectId/tasks
router.get('/:projectId/tasks', getTasks);

//PUT /api/tasks/:taskId
router.put('/:taskId', updateTask);

//DELETE /api/tasks/:taskId
router.delete('/:taskId', deleteTask);

export default router;
