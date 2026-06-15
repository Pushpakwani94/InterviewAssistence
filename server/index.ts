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

import { Server } from 'socket.io';

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Candidate joins a session room
  socket.on('join_session', (sessionCode) => {
    socket.join(sessionCode);
    console.log(`Socket ${socket.id} joined session ${sessionCode}`);
    
    // Send the last known state from memory if available
    if (memoryState.has(sessionCode)) {
      socket.emit('receive_answer', memoryState.get(sessionCode));
    }
  });

  // Admin sends a question
  socket.on('send_answer', async ({ sessionCode, answerData }) => {
    console.log(`Received answer for session ${sessionCode}`);
    
    // Broadcast to everyone in the room
    io.to(sessionCode).emit('receive_answer', answerData);
    
    // Save to Memory
    memoryState.set(sessionCode, answerData);

    // Save to DB asynchronously if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await PollingState.findOneAndUpdate(
          { sessionCode },
          { answerData },
          { upsert: true, new: true }
        );
        console.log(`Saved answer for session ${sessionCode} to MongoDB`);
      } catch (error) {
        console.error('Error saving session to DB:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
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
