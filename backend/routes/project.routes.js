import express from 'express';
import {
    createProject,
    getAllProjects, 
    getProjectById,
    updateProject, 
    deleteProject
} from '../controllers/project.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/" , authenticate , createProject);
router.get("/" , authenticate , getAllProjects);
router.get('/:projectId' , authenticate , getProjectById);
router.put('/:projectId' , authenticate , updateProject);
router.delete("/:projectId" , authenticate , deleteProject);

export default router;