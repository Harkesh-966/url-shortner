import helmet from 'helmet';
import cors from 'cors';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import env from '../config/env.js';
import { Router } from 'express';

export const securityMiddlewares = (): Router => {
    const r = Router();
    r.use(cookieParser());
    r.use(helmet());
    r.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true
    } as any));
    // CSRF for state-changing routes only; reading endpoints can be excluded by client
    r.use('/api', csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: env.COOKIE_SECURE } }));
    return r;
};
