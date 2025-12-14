import { Request, Response } from 'express';
import Transaction from '../models/Transaction.model';
import Account from '../models/Account.model';
import { createError } from '../middleware/errorHandler';

// Get statistics for a given period
export const getStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, period } = req.query;
    
    const filter: any = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    // Get total income and expense
    const totals = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalIncome = totals.find(t => t._id === 'income')?.total || 0;
    const totalExpense = totals.find(t => t._id === 'expense')?.total || 0;
    const balance = totalIncome - totalExpense;

    // Get category breakdown for both income and expense
    const categoryBreakdown = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          category: { $arrayElemAt: ['$categoryDetails.name', 0] },
          type: '$_id.type',
          amount: 1,
          count: 1,
          percentage: {
            $cond: [
              { $eq: ['$_id.type', 'income'] },
              {
                $multiply: [
                  { $divide: ['$amount', totalIncome || 1] },
                  100,
                ],
              },
              {
                $multiply: [
                  { $divide: ['$amount', totalExpense || 1] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    // Get monthly trend
    const monthlyTrend = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$date' } },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          income: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0] },
          },
        },
      },
      {
        $project: {
          month: '$_id',
          income: 1,
          expense: 1,
          balance: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error: any) {
    throw createError(500, error.message || 'Failed to fetch statistics');
  }
};

// Get income vs expense by category
export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    const filter: any = {};
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const categoryStats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          category: { $arrayElemAt: ['$categoryDetails.name', 0] },
          amount: 1,
          count: 1,
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { categoryStats },
    });
  } catch (error: any) {
    throw createError(500, error.message || 'Failed to fetch category statistics');
  }
};

