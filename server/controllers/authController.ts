import { Request, Response } from 'express';
import generateToken from '../utils/generateToken';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Hardcoded auth for DB-less mode
    if (email === 'admin@admin.com' && password === 'admin') {
      res.json({
        _id: '12345',
        name: 'Admin User',
        email: 'admin@admin.com',
        role: 'Admin',
        token: generateToken('12345', 'Admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password (use admin@admin.com / admin)' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user (Admin)
// @route   POST /api/auth/register
// @access  Public (Should be Super Admin in prod)
export const registerUser = async (req: Request, res: Response): Promise<any> => {
  res.status(400).json({ message: 'Registration disabled in memory-only mode' });
};
