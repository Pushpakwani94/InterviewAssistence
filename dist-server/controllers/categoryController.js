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
exports.createCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find({});
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCategories = getCategories;
// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, technology } = req.body;
    try {
        const categoryExists = yield Category_1.default.findOne({ name, technology });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists under this technology' });
        }
        const category = yield Category_1.default.create({ name, technology });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createCategory = createCategory;
