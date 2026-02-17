import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getMe,
    getUserById,
    updateProfile,
    updateUserRole,
} from '../controllers/user.controller.js';

// middlewares
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/me' , authenticate , getMe);
router.put('/me' , authenticate , updateProfile);

router.get('/', authenticate , authorizeRoles("Admin") , getAllUsers);
router.get('/:id', authenticate , authorizeRoles("Admin") , getUserById);
router.put('/:id/role', authenticate , authorizeRoles("Admin") , updateUserRole);
router.delete('/:id' , authenticate , authorizeRoles("Admin") , deleteUser)

export default router;