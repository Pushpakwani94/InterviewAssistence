import { Request, Response } from 'express';
import Category from '../models/Category';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req: Request, res: Response): Promise<any> => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response): Promise<any> => {
  const { name, technology } = req.body;

  try {
    const categoryExists = await Category.findOne({ name, technology });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists under this technology' });
    }

    const category = await Category.create({ name, technology });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
