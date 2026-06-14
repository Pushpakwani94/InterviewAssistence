"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.authUser = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (user && user.password && (await bcrypt_1.default.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user._id, user.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.authUser = authUser;
// @desc    Register a new user (Admin)
// @route   POST /api/auth/register
// @access  Public (Should be Super Admin in prod)
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Admin',
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user._id, user.role),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=authController.js.map