import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for candidates if they join via code
  role: 'Super Admin' | 'Admin' | 'Candidate';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['Super Admin', 'Admin', 'Candidate'], default: 'Candidate' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
