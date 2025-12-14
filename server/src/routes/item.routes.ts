import { Router } from 'express';
import { body } from 'express-validator';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/item.controller';
import { validate } from '../middleware/validator';

const router = Router();

// Validation rules
const createItemValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

const updateItemValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
];

// Routes
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', validate(createItemValidation), createItem);
router.put('/:id', validate(updateItemValidation), updateItem);
router.delete('/:id', deleteItem);

export default router;

