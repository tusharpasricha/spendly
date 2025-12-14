import { Request, Response, NextFunction } from 'express';
import { Item } from '../models/Item.model';
import { createError } from '../middleware/errorHandler';

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw createError('Item not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Public
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const item = await Item.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Public
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!item) {
      throw createError('Item not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Public
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      throw createError('Item not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

