"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getQuestions = void 0;
const express_1 = require("express");
const Question_1 = __importDefault(require("../models/Question"));
const Category_1 = __importDefault(require("../models/Category"));
// @desc    Get all questions (with optional filters)
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res) => {
    try {
        const { category, technology, difficulty, search } = req.query;
        let query = {};
        if (category)
            query.category = category;
        if (technology)
            query.technology = technology;
        if (difficulty)
            query.difficulty = difficulty;
        if (search) {
            query.$text = { $search: search };
        }
        const questions = await Question_1.default.find(query).populate('category', 'name technology');
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQuestions = getQuestions;
// @desc    Get a single question
// @route   GET /api/questions/:id
// @access  Private
const getQuestionById = async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id).populate('category', 'name technology');
        if (question) {
            res.json(question);
        }
        else {
            res.status(404).json({ message: 'Question not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQuestionById = getQuestionById;
// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
    try {
        const { question, answer, explanation, example, keywords, difficulty, technology, categoryId } = req.body;
        // Verify category exists
        const categoryExists = await Category_1.default.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const newQuestion = await Question_1.default.create({
            question,
            answer,
            explanation,
            example,
            keywords,
            difficulty,
            technology,
            category: categoryId
        });
        res.status(201).json(newQuestion);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createQuestion = createQuestion;
// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedQuestion) {
            res.json(updatedQuestion);
        }
        else {
            res.status(404).json({ message: 'Question not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateQuestion = updateQuestion;
// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findByIdAndDelete(req.params.id);
        if (question) {
            res.json({ message: 'Question removed' });
        }
        else {
            res.status(404).json({ message: 'Question not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteQuestion = deleteQuestion;
//# sourceMappingURL=questionController.js.map