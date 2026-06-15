import { Request, Response } from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Question from '../models/Question';
import Category from '../models/Category';

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
    let questionsData: any[] = [];
    const filename = req.file.originalname;

    if (filename.endsWith('.json')) {
      questionsData = JSON.parse(req.file.buffer.toString());
    } else if (filename.endsWith('.xlsx') || filename.endsWith('.csv')) {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      questionsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res.status(400).json({ message: 'Unsupported file format. Please upload JSON, CSV, or Excel.' });
    }

    let addedCount = 0;

    for (const item of questionsData) {
      // Map item fields: question, answer, explanation, example, keywords (comma separated), difficulty, technology, categoryName
      const { question, answer, explanation, example, keywords, difficulty, technology, categoryName } = item;

      if (!question || !answer || !technology || !categoryName) {
        continue; // skip incomplete rows
      }

      // Check or create category
      let category = await Category.findOne({ name: categoryName, technology });
      if (!category) {
        category = await Category.create({ name: categoryName, technology });
      }

      // Process keywords
      const processedKeywords = keywords ? (typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords) : [];

      await Question.create({
        question,
        answer,
        explanation,
        example,
        keywords: processedKeywords,
        difficulty: difficulty || 'Medium',
        technology,
        category: category._id
      });
      addedCount++;
    }

    res.status(200).json({ message: `Successfully uploaded ${addedCount} questions.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
