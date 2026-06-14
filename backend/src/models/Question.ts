import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  answer: string;
  explanation?: string;
  example?: string;
  keywords: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  technology: string;
  category: Types.ObjectId;
}

const QuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  explanation: { type: String },
  example: { type: String },
  keywords: [{ type: String }],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  technology: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

// Add index for searching
QuestionSchema.index({ question: 'text', answer: 'text', keywords: 'text' });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
