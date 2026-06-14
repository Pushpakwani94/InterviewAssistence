import express from 'express';
import { createSession, getSessions, joinSession, endSession } from '../controllers/sessionController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, admin, createSession)
  .get(protect, admin, getSessions);

router.post('/join', joinSession);
router.put('/:id/end', protect, admin, endSession);

export default router;
