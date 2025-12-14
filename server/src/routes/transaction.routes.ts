import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDate,
} from '../controllers/transaction.controller';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = express.Router();

// Validation rules
const transactionValidation = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('account')
    .notEmpty()
    .withMessage('Account is required')
    .isMongoId()
    .withMessage('Invalid account ID'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),
];

// Routes
router.get('/', getTransactions);
router.get('/by-date', getTransactionsByDate);
router.get('/:id', getTransactionById);
router.post('/', transactionValidation, validate, createTransaction);
router.put('/:id', transactionValidation, validate, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;

