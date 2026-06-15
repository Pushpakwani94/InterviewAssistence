import { Request, Response } from 'express';

// In-Memory Questions
let questions = [
  {
    _id: 'q1',
    question: 'What is Dependency Injection?',
    answer: 'A design pattern used to implement IoC...',
    explanation: 'Angular uses DI heavily.',
    difficulty: 'Medium',
    technology: 'Angular',
    category: { _id: 'c1', name: 'Angular', technology: 'Frontend' }
  },
  {
    _id: 'q2',
    question: 'What is the Event Loop?',
    answer: 'The mechanism that handles asynchronous callbacks...',
    explanation: 'Node.js is single threaded and relies on it.',
    difficulty: 'Hard',
    technology: 'Node.js',
    category: { _id: 'c2', name: 'Node.js', technology: 'Backend' }
  }
];

// @desc    Get all questions (with optional filters)
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req: Request, res: Response): Promise<any> => {
  res.json(questions);
};

// @desc    Get a single question
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req: Request, res: Response): Promise<any> => {
  const question = questions.find(q => q._id === req.params['id']);
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req: Request, res: Response): Promise<any> => {
  const { question, answer, explanation, example, keywords, difficulty, technology, categoryId } = req.body;

  const newQuestion = {
    _id: 'q' + Date.now(),
    question,
    answer,
    explanation,
    example,
    keywords,
    difficulty,
    technology,
    category: { _id: categoryId, name: 'Custom Category', technology }
  };

  questions.push(newQuestion);
  res.status(201).json(newQuestion);
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req: Request, res: Response): Promise<any> => {
  const index = questions.findIndex(q => q._id === req.params['id']);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...req.body };
    res.json(questions[index]);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req: Request, res: Response): Promise<any> => {
  const index = questions.findIndex(q => q._id === req.params['id']);
  if (index !== -1) {
    questions.splice(index, 1);
    res.json({ message: 'Question removed' });
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};
