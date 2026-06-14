import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  technology: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  technology: { type: String, required: true },
}, { timestamps: true });

// Prevent duplicate categories under the same technology
CategorySchema.index({ name: 1, technology: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);
