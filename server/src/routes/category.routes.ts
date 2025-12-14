import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  initializeDefaultCategories,
} from '../controllers/category.controller';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('type')
    .optional()
    .isIn(['income', 'expense', 'both'])
    .withMessage('Type must be income, expense, or both'),
];

// Routes
router.get('/', getCategories);
router.post('/initialize', initializeDefaultCategories);
router.get('/:id', getCategoryById);
router.post('/', categoryValidation, validate, createCategory);
router.put('/:id', categoryValidation, validate, updateCategory);
router.delete('/:id', deleteCategory);

export default router;

