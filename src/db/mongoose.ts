import mongoose from 'mongoose';
import env from '../config/env.js';
import { log } from '../config/logger.js';

export const connectDB = async (): Promise<void> => {
    await mongoose.connect(env.MONGODB_URI);
    log.info('MongoDB connected');
};
