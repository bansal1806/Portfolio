import { Router } from 'express';
import { isDBConnected } from '../config/db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    database: isDBConnected() ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

export default router;
