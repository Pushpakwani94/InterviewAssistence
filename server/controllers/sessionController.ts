import { Request, Response } from 'express';
import Session from '../models/Session';
import SessionHistory from '../models/SessionHistory';

// Helper function to generate random 6-character alphanumeric code with optional prefix
const generateSessionCode = (technology: string) => {
  const prefix = technology ? technology.substring(0, 3).toUpperCase() + '-' : '';
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomStr}`;
};

// @desc    Create a new interview session
// @route   POST /api/sessions
// @access  Private/Admin
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionName, candidateName, technology, startTime, endTime } = req.body;
    let sessionCode = generateSessionCode(technology);

    // Ensure session code is unique
    while (await Session.findOne({ sessionCode })) {
      sessionCode = generateSessionCode(technology);
    }

    const session = await Session.create({
      sessionName,
      candidateName,
      technology,
      startTime,
      endTime,
      sessionCode,
      createdBy: (req as any).user._id,
    });

    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sessions for the admin
// @route   GET /api/sessions
// @access  Private/Admin
export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await Session.find().populate('createdBy', 'name email').sort('-createdAt');
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Candidate joins a session using session code
// @route   POST /api/sessions/join
// @access  Public
export const joinSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionCode } = req.body;
    const session = await Session.findOne({ sessionCode, isActive: true });

    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ message: 'Invalid or inactive session code' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End an interview session
// @route   PUT /api/sessions/:id/end
// @access  Private/Admin
export const endSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params['id']);

    if (session) {
      session.isActive = false;
      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session history (all questions sent during session)
// @route   GET /api/sessions/:sessionCode/history
// @access  Public
export const getSessionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionCode } = req.params;
    const history = await SessionHistory.find({ sessionCode }).sort('sentAt');
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session stats
// @route   GET /api/sessions/:sessionCode/stats
// @access  Private/Admin
export const getSessionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionCode } = req.params;
    const questionsSentCount = await SessionHistory.countDocuments({ sessionCode });
    const session = await Session.findOne({ sessionCode });
    
    res.json({
      sessionCode,
      questionsSentCount,
      isActive: session ? session.isActive : false
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

