import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { parseStatementWithAI, suggestCategoryWithAI } from '../services/ai.service';
import Transaction from '../models/Transaction.model';
import Category from '../models/Category.model';
import { randomUUID } from 'crypto';

/**
 * Parse uploaded bank statement file
 */
export const parseStatement = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const file = req.file;
    let fileContent = '';

    // Extract content based on file type
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      fileContent = file.buffer.toString('utf-8');
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.xls')
    ) {
      // Parse Excel file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      fileContent = XLSX.utils.sheet_to_csv(sheet);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file format. Please upload CSV or Excel file.',
      });
    }

    // Parse with AI
    const parsedTransactions = await parseStatementWithAI(fileContent, file.originalname);

    if (!parsedTransactions || parsedTransactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No transactions found in the file. Please check the file format.',
      });
    }

    // Get all categories for suggestion
    const categories = await Category.find({});
    const categoryList = categories.map((c) => ({ name: c.name, type: c.type }));

    // Suggest categories for each transaction
    const transactionsWithCategories = await Promise.all(
      parsedTransactions.map(async (txn) => {
        const suggestedCategory = await suggestCategoryWithAI(
          txn.description,
          txn.amount,
          txn.type,
          categoryList
        );

        return {
          ...txn,
          suggestedCategory,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        transactions: transactionsWithCategories,
        count: transactionsWithCategories.length,
      },
    });
  } catch (error: any) {
    console.error('Parse statement error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse statement',
    });
  }
};

/**
 * Detect duplicate transactions
 */
export const detectDuplicates = async (req: Request, res: Response) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transactions data',
      });
    }

    // Check each transaction for duplicates
    const transactionsWithDuplicateFlags = await Promise.all(
      transactions.map(async (txn: any) => {
        // Exact match: same date, amount, and similar description
        const existingTransaction = await Transaction.findOne({
          date: new Date(txn.date),
          amount: txn.amount,
          type: txn.type,
        });

        return {
          ...txn,
          isDuplicate: !!existingTransaction,
          duplicateId: existingTransaction?._id,
        };
      })
    );

    const duplicateCount = transactionsWithDuplicateFlags.filter((t) => t.isDuplicate).length;

    return res.status(200).json({
      success: true,
      data: {
        transactions: transactionsWithDuplicateFlags,
        duplicateCount,
      },
    });
  } catch (error: any) {
    console.error('Detect duplicates error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to detect duplicates',
    });
  }
};

/**
 * Bulk save transactions
 */
export const bulkSaveTransactions = async (req: Request, res: Response) => {
  try {
    const { transactions, accountId } = req.body;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No transactions to save',
      });
    }

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'Account ID is required',
      });
    }

    // Generate a unique batch ID for this import
    const importBatchId = randomUUID();

    // Get all categories
    const categories = await Category.find({});
    const categoryMap = new Map(categories.map((c) => [c.name, c._id]));

    // Prepare transactions for insertion
    const transactionsToInsert = transactions
      .filter((txn: any) => !txn.isDuplicate || txn.forceImport) // Skip duplicates unless forced
      .map((txn: any) => {
        const categoryId = categoryMap.get(txn.category);

        if (!categoryId) {
          throw new Error(`Category not found: ${txn.category}`);
        }

        return {
          date: new Date(txn.date),
          amount: txn.amount,
          type: txn.type,
          category: categoryId,
          account: accountId,
          note: txn.description,
          importBatchId,
        };
      });

    if (transactionsToInsert.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No transactions to import (all are duplicates)',
      });
    }

    // Bulk insert
    const savedTransactions = await Transaction.insertMany(transactionsToInsert);

    return res.status(201).json({
      success: true,
      data: {
        importedCount: savedTransactions.length,
        skippedCount: transactions.length - savedTransactions.length,
        importBatchId,
      },
      message: `Successfully imported ${savedTransactions.length} transactions`,
    });
  } catch (error: any) {
    console.error('Bulk save error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to save transactions',
    });
  }
};

