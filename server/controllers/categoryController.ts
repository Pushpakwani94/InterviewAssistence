import { Request, Response } from 'express';

// In-Memory Categories
let categories = [
  { _id: 'c1', name: 'Angular', technology: 'Frontend' },
  { _id: 'c2', name: 'Node.js', technology: 'Backend' },
  { _id: 'c3', name: 'React', technology: 'Frontend' }
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req: Request, res: Response): Promise<any> => {
  res.json(categories);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response): Promise<any> => {
  const { name, technology } = req.body;
  
  if (categories.some(c => c.name === name && c.technology === technology)) {
    return res.status(400).json({ message: 'Category already exists under this technology' });
  }

  const newCat = {
    _id: 'c' + Date.now(),
    name,
    technology
  };
  
  categories.push(newCat);
  res.status(201).json(newCat);
};
