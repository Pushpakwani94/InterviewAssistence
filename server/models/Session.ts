import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISession extends Document {
  sessionName: string;
  candidateName: string;
  technology: string;
  startTime: Date;
  endTime: Date;
  sessionCode: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
}

const SessionSchema: Schema = new Schema({
  sessionName: { type: String, required: true },
  candidateName: { type: String, required: true },
  technology: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  sessionCode: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);
