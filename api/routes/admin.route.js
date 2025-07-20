import express from 'express';
import {
  getAllUsers,
  toggleBlockUser,
} from '../controllers/admin.controller.js';

import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.put('/block/:id', verifyToken, verifyAdmin, toggleBlockUser);

export default router;
