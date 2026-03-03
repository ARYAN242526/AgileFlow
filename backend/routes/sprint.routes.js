import express from 'express';
import {
    createSprint,
    getProjectSprints,
    startSprint,
    completeSprint,
    deleteSprint,
} from '../controllers/sprint.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// create sprint inside a project
router.post("/:projectId/sprints" , authenticate, createSprint);

// get all sprints for a project
router.get("/:projectId/sprints" , authenticate, getProjectSprints);

// start sprint
router.patch('/:sprintId/start' , authenticate, startSprint);

// complete sprint
router.patch('/:sprintId/complete', authenticate, completeSprint);

// delete sprint
router.delete('/:sprintId', authenticate, deleteSprint);

export default router;