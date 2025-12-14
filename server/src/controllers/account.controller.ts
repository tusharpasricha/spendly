import { Request, Response, NextFunction } from 'express';
import Account from '../models/Account.model';
import Transaction from '../models/Transaction.model';
import { createError } from '../middleware/errorHandler';

// Get all accounts
export const getAccounts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { accounts },
    });
  } catch (error: any) {
    next(createError(500, error.message || 'Failed to fetch accounts'));
  }
};

// Get account by ID
export const getAccountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return next(createError(404, 'Account not found'));
    }

    res.status(200).json({
      success: true,
      data: { account },
    });
  } catch (error: any) {
    next(createError(error.statusCode || 500, error.message || 'Failed to fetch account'));
  }
};

// Create new account
export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, balance, description } = req.body;

    const account = await Account.create({
      name,
      balance: balance || 0,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { account },
    });
  } catch (error: any) {
    next(createError(400, error.message || 'Failed to create account'));
  }
};

// Update account
export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, balance, description } = req.body;

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { name, balance, description },
      { new: true, runValidators: true }
    );

    if (!account) {
      return next(createError(404, 'Account not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      data: { account },
    });
  } catch (error: any) {
    next(createError(error.statusCode || 400, error.message || 'Failed to update account'));
  }
};

// Delete account
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if account has transactions
    const transactionCount = await Transaction.countDocuments({ account: req.params.id });

    if (transactionCount > 0) {
      return next(createError(400, 'Cannot delete account with existing transactions'));
    }

    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return next(createError(404, 'Account not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    next(createError(error.statusCode || 500, error.message || 'Failed to delete account'));
  }
};

// Get total balance across all accounts
export const getTotalBalance = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await Account.find();
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    res.status(200).json({
      success: true,
      data: { totalBalance },
    });
  } catch (error: any) {
    next(createError(500, error.message || 'Failed to calculate total balance'));
  }
};

