"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endSession = exports.joinSession = exports.getSessions = exports.createSession = void 0;
const Session_1 = __importDefault(require("../models/Session"));
// Helper function to generate random 6-character alphanumeric code
const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
// @desc    Create a new interview session
// @route   POST /api/sessions
// @access  Private/Admin
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionName, candidateName, technology, startTime, endTime } = req.body;
        let sessionCode = generateSessionCode();
        // Ensure session code is unique
        while (yield Session_1.default.findOne({ sessionCode })) {
            sessionCode = generateSessionCode();
        }
        const session = yield Session_1.default.create({
            sessionName,
            candidateName,
            technology,
            startTime,
            endTime,
            sessionCode,
            createdBy: req.user._id,
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createSession = createSession;
// @desc    Get all sessions for the admin
// @route   GET /api/sessions
// @access  Private/Admin
const getSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessions = yield Session_1.default.find().populate('createdBy', 'name email').sort('-createdAt');
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSessions = getSessions;
// @desc    Candidate joins a session using session code
// @route   POST /api/sessions/join
// @access  Public
const joinSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionCode } = req.body;
        const session = yield Session_1.default.findOne({ sessionCode, isActive: true });
        if (session) {
            res.json(session);
        }
        else {
            res.status(404).json({ message: 'Invalid or inactive session code' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.joinSession = joinSession;
// @desc    End an interview session
// @route   PUT /api/sessions/:id/end
// @access  Private/Admin
const endSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield Session_1.default.findById(req.params.id);
        if (session) {
            session.isActive = false;
            const updatedSession = yield session.save();
            res.json(updatedSession);
        }
        else {
            res.status(404).json({ message: 'Session not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.endSession = endSession;
