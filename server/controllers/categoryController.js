"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getCategories = void 0;
const express_1 = require("express");
const Category_1 = __importDefault(require("../models/Category"));
// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.find({});
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, technology } = req.body;
    try {
        const categoryExists = await Category_1.default.findOne({ name, technology });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists under this technology' });
        }
        const category = await Category_1.default.create({ name, technology });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createCategory = createCategory;
//# sourceMappingURL=categoryController.js.map