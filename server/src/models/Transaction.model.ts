import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'income' | 'expense';

export interface ITransaction extends Document {
  date: Date;
  amount: number;
  type: TransactionType;
  category: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  note?: string;
  importBatchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Account is required'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    importBatchId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ account: 1, date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ importBatchId: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

