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

// Polling Routes using MongoDB
app.post('/api/sessions/send', async (req, res) => {
  const { sessionCode, answerData } = req.body;
  if (!sessionCode) {
    return res.status(400).json({ error: 'Session code required' });
  }
  
  try {
    await PollingState.findOneAndUpdate(
      { sessionCode },
      { answerData },
      { upsert: true, new: true }
    );
    console.log(`Saved answer for session ${sessionCode} to MongoDB`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving session to DB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sessions/receive/:sessionCode', async (req, res) => {
  const sessionCode = req.params.sessionCode;
  
  try {
    const state = await PollingState.findOne({ sessionCode });
    if (state && state.answerData) {
      res.json({ data: state.answerData });
    } else {
      res.json({ data: null });
    }
  } catch (error) {
    console.error('Error reading session from DB:', error);
    res.status(500).json({ error: 'Internal server error' });
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
