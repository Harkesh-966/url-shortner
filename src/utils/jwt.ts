import jwt, { type SignOptions } from 'jsonwebtoken';
import env from '../config/env.js';

export type JwtPayload = { sub: string };

export const signJwt = (payload: JwtPayload, options: SignOptions = {}): string => {
    const defaultOpts: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
    return jwt.sign(payload, env.JWT_SECRET as string, { ...defaultOpts, ...options });
};

export const verifyJwt = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
};
