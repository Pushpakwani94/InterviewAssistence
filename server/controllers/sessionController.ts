import { Request, Response } from 'express';

// In-Memory state for Vercel/Local Serverless deployments
const memoryState = new Map<string, any>();
const memoryHistory = new Map<string, any[]>();

// Helper function to generate random 6-character alphanumeric code with optional prefix
const generateSessionCode = (technology: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return technology ? `${technology.toUpperCase()}-${result}` : result;
};

// @desc    Get all active sessions
// @route   GET /api/sessions
// @access  Public
export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json([]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Public
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: "Database disabled." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Public
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, technology, difficulty, maxCandidates } = req.body;
    res.status(201).json({ message: "Database disabled" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Public
export const updateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: "Database disabled" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Public
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Session removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session history
// @route   GET /api/sessions/global/history
// @access  Public
export const getSessionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionCode = 'GLOBAL';
    const history = memoryHistory.get(sessionCode) || [];
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get basic statistics about global session
// @route   GET /api/sessions/global/stats
// @access  Public
export const getSessionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionCode = 'GLOBAL';
    const history = memoryHistory.get(sessionCode) || [];
    
    res.json({
      activeQuestion: memoryState.has(sessionCode),
      questionsSentCount: history.length,
      connectedCount: 1 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a new question to a session
// @route   POST /api/sessions/global/send
// @access  Public (should be Admin in prod)
export const sendAnswer = async (req: Request, res: Response): Promise<any> => {
  try {
    const sessionCode = 'GLOBAL';
    const { answerData } = req.body;
    
    // Save to memory
    memoryState.set(sessionCode, answerData);
    
    // Save to history
    if (!memoryHistory.has(sessionCode)) {
      memoryHistory.set(sessionCode, []);
    }
    
    const hist = memoryHistory.get(sessionCode)!;
    if (!hist.length || hist[hist.length - 1].question !== answerData.question) {
      hist.push({
        ...answerData,
        sentAt: new Date()
      });
    }
    
    res.json({ message: 'Answer sent successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the current active question for a session
// @route   GET /api/sessions/global/current
// @access  Public
export const getCurrentAnswer = async (req: Request, res: Response): Promise<any> => {
  try {
    const sessionCode = 'GLOBAL';
    if (memoryState.has(sessionCode)) {
      res.json(memoryState.get(sessionCode));
    } else {
      res.json(null);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
