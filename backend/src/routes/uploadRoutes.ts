import express from 'express';
import { upload, uploadQuestions } from '../controllers/uploadController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, admin, upload.single('file'), uploadQuestions);

export default router;
