import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env['MONGO_URI'] || 'mongodb://localhost:27017/interview-assistant');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend will continue running without Database to support Socket.IO features.');
  }
};

export default connectDB;
