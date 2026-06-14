import express from 'express';
import { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getQuestions)
  .post(protect, admin, createQuestion);

router.route('/:id')
  .get(protect, getQuestionById)
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

export default router;
