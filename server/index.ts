import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import questionRoutes from './routes/questionRoutes';
import uploadRoutes from './routes/uploadRoutes';
import sessionRoutes from './routes/sessionRoutes';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB(); // Re-enabled to allow session state on Vercel

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sessions', sessionRoutes);

import PollingState from './models/PollingState';

import mongoose from 'mongoose';

// Fallback memory state for serverless environments where DB connection might fail
const memoryState = new Map<string, any>();

// Polling Routes using MongoDB with memory fallback
app.post('/api/sessions/send', async (req, res) => {
  const { sessionCode, answerData } = req.body;
  if (!sessionCode) {
    return res.status(400).json({ error: 'Session code required' });
  }
  
  try {
    if (mongoose.connection.readyState === 1) {
      await PollingState.findOneAndUpdate(
        { sessionCode },
        { answerData },
        { upsert: true, new: true }
      );
      console.log(`Saved answer for session ${sessionCode} to MongoDB`);
    } else {
      memoryState.set(sessionCode, answerData);
      console.log(`Saved answer for session ${sessionCode} to Memory (DB not connected)`);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving session to DB:', error);
    // Fallback to memory
    memoryState.set(sessionCode, answerData);
    res.json({ success: true, warning: 'Saved to memory due to DB error' });
  }
});

app.get('/api/sessions/receive/:sessionCode', async (req, res) => {
  const sessionCode = req.params.sessionCode;
  
  // Prevent Vercel edge network and browser from caching the polling GET request
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    if (mongoose.connection.readyState === 1) {
      const state = await PollingState.findOne({ sessionCode });
      if (state && state.answerData) {
        return res.json({ data: state.answerData });
      }
    }
    
    // Fallback to memory
    if (memoryState.has(sessionCode)) {
      return res.json({ data: memoryState.get(sessionCode) });
    }
    
    res.json({ data: null });
  } catch (error) {
    console.error('Error reading session from DB:', error);
    // Fallback to memory
    if (memoryState.has(sessionCode)) {
      return res.json({ data: memoryState.get(sessionCode) });
    }
    res.json({ data: null, warning: 'Read from memory due to DB error' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('AI Interview Assistant API is running...');
});

const PORT = process.env['PORT'] || 5000;

if (process.env['VERCEL'] !== '1') {
  server.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server running in ${process.env['NODE_ENV'] || 'development'} mode on port ${PORT}`);
  });
}

export default app;
