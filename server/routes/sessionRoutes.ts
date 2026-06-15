import express from 'express';
import { createSession, getSessions, getSessionHistory, getSessionStats, sendAnswer, getCurrentAnswer } from '../controllers/sessionController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, admin, createSession)
  .get(protect, admin, getSessions);

router.get('/global/history', getSessionHistory);
router.get('/global/stats', protect, admin, getSessionStats);
router.post('/global/send', sendAnswer);
router.get('/global/current', getCurrentAnswer);

export default router;
