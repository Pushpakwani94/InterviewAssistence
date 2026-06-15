import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionHistory extends Document {
  sessionCode: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty: string;
  sentAt: Date;
}

const SessionHistorySchema: Schema = new Schema({
  sessionCode: { type: String, required: true, index: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  explanation: { type: String },
  difficulty: { type: String },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.models.SessionHistory || mongoose.model<ISessionHistory>('SessionHistory', SessionHistorySchema);
