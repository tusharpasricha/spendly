import { Request, Response } from 'express';
import Transaction from '../models/Transaction.model';
import Account from '../models/Account.model';
import Category from '../models/Category.model';
import { createError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

// Get all transactions with filters
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { account, category, type, startDate, endDate } = req.query;

    const filter: any = {};

    if (account) filter.account = account;

    // Handle category filter - can be either ObjectId or category name
    if (category) {
      // Check if it's a valid ObjectId (24 hex characters)
      const isValidObjectId = mongoose.Types.ObjectId.isValid(category as string) &&
                              /^[0-9a-fA-F]{24}$/.test(category as string);

      if (isValidObjectId) {
        filter.category = category;
      } else {
        // It's a category name, look up the category ID
        const categoryDoc = await Category.findOne({ name: category as string });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          // Category not found, return empty results
          return res.status(200).json({
            success: true,
            data: { transactions: [] },
          });
        }
      }
    }

    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(filter)
      .populate('account', 'name')
      .populate('category', 'name type')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { transactions },
    });
  } catch (error: any) {
    throw createError(500, error.message || 'Failed to fetch transactions');
  }
};

// Get transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('account', 'name')
      .populate('category', 'name type');

    if (!transaction) {
      throw createError(404, 'Transaction not found');
    }

    res.status(200).json({
      success: true,
      data: { transaction },
    });
  } catch (error: any) {
    throw createError(error.statusCode || 500, error.message || 'Failed to fetch transaction');
  }
};

// Create new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { date, amount, type, category, account, note } = req.body;

    // Verify account exists
    const accountDoc = await Account.findById(account);
    if (!accountDoc) {
      throw createError(404, 'Account not found');
    }

    // Create transaction
    const transaction = await Transaction.create({
      date: date || new Date(),
      amount,
      type,
      category,
      account,
      note,
    });

    // Update account balance
    if (type === 'income') {
      accountDoc.balance += amount;
    } else {
      accountDoc.balance -= amount;
    }
    await accountDoc.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('account', 'name')
      .populate('category', 'name type');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction: populatedTransaction },
    });
  } catch (error: any) {
    throw createError(error.statusCode || 400, error.message || 'Failed to create transaction');
  }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { date, amount, type, category, account, note } = req.body;

    const oldTransaction = await Transaction.findById(req.params.id);
    if (!oldTransaction) {
      throw createError(404, 'Transaction not found');
    }

    // Revert old transaction effect on account balance
    const oldAccount = await Account.findById(oldTransaction.account);
    if (oldAccount) {
      if (oldTransaction.type === 'income') {
        oldAccount.balance -= oldTransaction.amount;
      } else {
        oldAccount.balance += oldTransaction.amount;
      }
      await oldAccount.save();
    }

    // Update transaction
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { date, amount, type, category, account, note },
      { new: true, runValidators: true }
    ).populate('account', 'name').populate('category', 'name type');

    // Apply new transaction effect on account balance
    const newAccount = await Account.findById(account);
    if (newAccount) {
      if (type === 'income') {
        newAccount.balance += amount;
      } else {
        newAccount.balance -= amount;
      }
      await newAccount.save();
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction },
    });
  } catch (error: any) {
    throw createError(error.statusCode || 400, error.message || 'Failed to update transaction');
  }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      throw createError(404, 'Transaction not found');
    }

    // Revert transaction effect on account balance
    const account = await Account.findById(transaction.account);
    if (account) {
      if (transaction.type === 'income') {
        account.balance -= transaction.amount;
      } else {
        account.balance += transaction.amount;
      }
      await account.save();
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error: any) {
    throw createError(error.statusCode || 500, error.message || 'Failed to delete transaction');
  }
};

// Get transactions grouped by date (for daily view)
export const getTransactionsByDate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const filter: any = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          transactions: { $push: '$$ROOT' },
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { groupedTransactions: transactions },
    });
  } catch (error: any) {
    throw createError(500, error.message || 'Failed to fetch transactions by date');
  }
};

