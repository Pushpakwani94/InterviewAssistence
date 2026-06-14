"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQuestions = exports.upload = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const Question_1 = __importDefault(require("../models/Question"));
const Category_1 = __importDefault(require("../models/Category"));
// Multer setup (memory storage for processing)
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
// @desc    Upload Questions via JSON, Excel, or CSV
// @route   POST /api/upload
// @access  Private/Admin
const uploadQuestions = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        let questionsData = [];
        const filename = req.file.originalname;
        if (filename.endsWith('.json')) {
            questionsData = JSON.parse(req.file.buffer.toString());
        }
        else if (filename.endsWith('.xlsx') || filename.endsWith('.csv')) {
            const workbook = xlsx_1.default.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            questionsData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }
        else {
            return res.status(400).json({ message: 'Unsupported file format. Please upload JSON, CSV, or Excel.' });
        }
        let addedCount = 0;
        for (const item of questionsData) {
            // Map item fields: question, answer, explanation, example, keywords (comma separated), difficulty, technology, categoryName
            const { question, answer, explanation, example, keywords, difficulty, technology, categoryName } = item;
            if (!question || !answer || !technology || !categoryName) {
                continue; // skip incomplete rows
            }
            // Check or create category
            let category = await Category_1.default.findOne({ name: categoryName, technology });
            if (!category) {
                category = await Category_1.default.create({ name: categoryName, technology });
            }
            // Process keywords
            const processedKeywords = keywords ? (typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords) : [];
            await Question_1.default.create({
                question,
                answer,
                explanation,
                example,
                keywords: processedKeywords,
                difficulty: difficulty || 'Medium',
                technology,
                category: category._id
            });
            addedCount++;
        }
        res.status(200).json({ message: `Successfully uploaded ${addedCount} questions.` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.uploadQuestions = uploadQuestions;
//# sourceMappingURL=uploadController.js.map