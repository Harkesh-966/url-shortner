import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { signJwt } from '../utils/jwt.js';
import { ApiError } from '../middlewares/error.js';

export const register = async (email: string, password: string) => {
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, 'Email already registered');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    return user.toObject();
};

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, 'Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, 'Invalid credentials');
    const token = signJwt({ sub: user.id });
    return { user: user.toObject(), token };
};
