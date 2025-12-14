import mongoose, { Document, Schema } from 'mongoose';

export type CategoryType = 'income' | 'expense' | 'both';

export interface ICategory extends Document {
  name: string;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'both'],
      required: [true, 'Category type is required'],
      default: 'both',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);

