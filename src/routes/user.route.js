import express from 'express';
import * as userController from '../controllers/user.controller';
import { roleMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/user/register', roleMiddleware, userController.registerUser);
router.post('/admin/register', roleMiddleware, userController.registerUser);
router.post('/login', userController.loginUser);

export default router;
