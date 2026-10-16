import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createMessage } from '../controllers/contactController.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages sent. Please try again in 15 minutes.' },
});

router.post('/', contactLimiter, createMessage);

export default router;
