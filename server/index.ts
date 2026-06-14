import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
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
const io = new Server(server, {
  cors: {
    origin: '*', // For development, allow all origins
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sessions', sessionRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_session', (sessionCode) => {
    socket.join(sessionCode);
    console.log(`Socket ${socket.id} joined session ${sessionCode}`);
  });

  socket.on('send_answer', (data) => {
    // Expected data format: { sessionCode, answerData }
    const { sessionCode, answerData } = data;
    console.log(`Sending answer to session ${sessionCode}:`, answerData.question);
    io.to(sessionCode).emit('receive_answer', answerData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('AI Interview Assistant API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
