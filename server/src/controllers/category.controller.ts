import { Request, Response } from 'express';
import Category from '../models/Category.model';
import Transaction from '../models/Transaction.model';
import { createError } from '../middleware/errorHandler';

// Get all categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error: any) {
    throw createError(500, error.message || 'Failed to fetch categories');
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw createError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error: any) {
    throw createError(error.statusCode || 500, error.message || 'Failed to fetch category');
  }
};

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;

    const category = await Category.create({
      name,
      type: type || 'both',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error: any) {
    throw createError(400, error.message || 'Failed to create category');
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, type },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw createError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error: any) {
    throw createError(error.statusCode || 400, error.message || 'Failed to update category');
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    // Check if category has transactions
    const transactionCount = await Transaction.countDocuments({ category: req.params.id });
    
    if (transactionCount > 0) {
      throw createError(400, 'Cannot delete category with existing transactions. Please reassign them first.');
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw createError(404, 'Category not found');
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    throw createError(error.statusCode || 500, error.message || 'Failed to delete category');
  }
};

// Initialize default categories
export const initializeDefaultCategories = async (_req: Request, res: Response) => {
  try {
    const defaultCategories = [
      { name: 'Food', type: 'expense' },
      { name: 'Rent', type: 'expense' },
      { name: 'Travel', type: 'expense' },
      { name: 'Shopping', type: 'expense' },
      { name: 'Bills', type: 'expense' },
      { name: 'Salary', type: 'income' },
      { name: 'Freelance', type: 'income' },
      { name: 'Others', type: 'both' },
    ];

    const existingCount = await Category.countDocuments();

    if (existingCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Categories already initialized',
      });
      return;
    }

    await Category.insertMany(defaultCategories);

    res.status(201).json({
      success: true,
      message: 'Default categories initialized successfully',
    });
  } catch (error: any) {
    throw createError(500, error.message || 'Failed to initialize categories');
  }
};

