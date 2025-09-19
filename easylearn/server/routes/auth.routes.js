import express from 'express';
import {
  getAllUsers,
  loginUser,
  registerUser,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-auth', authenticate, (req, res) =>
  res.status(200).json({
    success: true,
    message: 'Authenticated user',
    data: {
      user: req.user,
    },
  })
);
router.get('/users', getAllUsers);

export default router;
