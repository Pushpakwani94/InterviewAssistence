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
// connectDB(); // Commented out to prevent crash when Mongo is not installed

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

// HTTP Polling session store
const sessions: Record<string, any> = {};

// Polling Routes
app.post('/api/sessions/send', (req, res) => {
  const { sessionCode, answerData } = req.body;
  if (!sessionCode) {
    return res.status(400).json({ error: 'Session code required' });
  }
  sessions[sessionCode] = answerData;
  console.log(`Saved answer for session ${sessionCode}`);
  res.json({ success: true });
});

app.get('/api/sessions/receive/:sessionCode', (req, res) => {
  const sessionCode = req.params.sessionCode;
  const data = sessions[sessionCode];
  // In a real app, you might want to clear it after reading, but since we are polling, 
  // keeping the latest question allows late-joiners to see the current question.
  if (data) {
    res.json({ data });
  } else {
    res.json({ data: null });
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
