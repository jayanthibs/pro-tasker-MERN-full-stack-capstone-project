import express from 'express';
import { authMiddleware } from '../utils/auth.js';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../controllers/projectControllers.js';

const router = express.Router();

router.use(authMiddleware);
//POST /api/projects
router.post('/', createProject);
//GET /api/projects
router.get('/', getProjects);
//GET /api/projects/:id
router.get('/:id', getProject);
//PUT /api/projects/:id 
router.put('/:id', updateProject);
//DELETE /api/projects/:id
router.delete('/:id', deleteProject);

export default router;