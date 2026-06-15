import mongoose, { Schema, Document } from 'mongoose';

export interface IPollingState extends Document {
  sessionCode: string;
  answerData: any;
}

const PollingStateSchema: Schema = new Schema({
  sessionCode: { type: String, required: true, unique: true },
  answerData: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export default mongoose.models['PollingState'] || mongoose.model<IPollingState>('PollingState', PollingStateSchema);
