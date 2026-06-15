import { Request, Response } from 'express';
import Question from '../models/Question';
import Category from '../models/Category';

// @desc    Get all questions (with optional filters)
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, technology, difficulty, search } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (technology) query.technology = technology;
    if (difficulty) query.difficulty = difficulty;
    
    if (search) {
      query.$text = { $search: search as string };
    }

    const questions = await Question.find(query).populate('category', 'name technology');
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single question
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const question = await Question.findById(req.params['id']).populate('category', 'name technology');
    if (question) {
      res.json(question);
      return;
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { question, answer, explanation, example, keywords, difficulty, technology, categoryId } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newQuestion = await Question.create({
      question,
      answer,
      explanation,
      example,
      keywords,
      difficulty,
      technology,
      category: categoryId
    });

    res.status(201).json(newQuestion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params['id'], req.body, { new: true });
    if (updatedQuestion) {
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const question = await Question.findByIdAndDelete(req.params['id']);
    if (question) {
      res.json({ message: 'Question removed' });
      return;
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
