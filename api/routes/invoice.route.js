import express from 'express';
import { sendInvoice } from '../controllers/invoice.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/send', verifyToken, sendInvoice);

export default router;
