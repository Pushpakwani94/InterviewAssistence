import { Request, Response } from 'express';
import multer from 'multer';

// Multer setup (memory storage for processing)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// @desc    Upload Questions via JSON, Excel, or CSV
// @route   POST /api/upload
// @access  Private/Admin
export const uploadQuestions = async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // In db-less mode, we pretend the upload was successful
    res.status(200).json({ message: `Successfully simulated upload in memory-only mode.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
