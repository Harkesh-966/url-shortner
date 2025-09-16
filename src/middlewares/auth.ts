import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = verifyJwt(token);
        req.userId = payload.sub;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
