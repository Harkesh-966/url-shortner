import { NextFunction, Request, Response } from 'express';
import * as Auth from '../services/auth.service.js';
import env from '../config/env.js';

const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.COOKIE_SECURE,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as { email: string; password: string };
        const user = await Auth.register(email, password);
        res.status(201).json({ id: user._id, email: user.email });
    } catch (error) {
        next(error)
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as { email: string; password: string };
        const { user, token } = await Auth.login(email, password);
        res.cookie('token', token, cookieOpts);
        res.json({ id: user._id, email: user.email });
    } catch (error) {
        next(error)
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: env.COOKIE_SECURE });
    res.status(204).send();
};
