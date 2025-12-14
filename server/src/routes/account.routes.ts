import express from 'express';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getTotalBalance,
} from '../controllers/account.controller';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = express.Router();

// Validation rules
const accountValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Account name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Account name must be between 2 and 50 characters'),
  body('balance')
    .optional()
    .isNumeric()
    .withMessage('Balance must be a number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

// Routes
router.get('/', getAccounts);
router.get('/total-balance', getTotalBalance);
router.get('/:id', getAccountById);
router.post('/', accountValidation, validate, createAccount);
router.put('/:id', accountValidation, validate, updateAccount);
router.delete('/:id', deleteAccount);

export default router;

