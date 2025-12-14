import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  balance: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
      minlength: [2, 'Account name must be at least 2 characters'],
      maxlength: [50, 'Account name cannot exceed 50 characters'],
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required'],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAccount>('Account', AccountSchema);

