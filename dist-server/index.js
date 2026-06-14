"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
// Load environment variables
dotenv_1.default.config();
// Connect to Database
// connectDB(); // Commented out to prevent crash when Mongo is not installed
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // For development, allow all origins
        methods: ['GET', 'POST']
    }
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/questions', questionRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/sessions', sessionRoutes_1.default);
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
