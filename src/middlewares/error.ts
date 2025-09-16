import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = (err as any).status || 500;
    const message = (err as any).message || 'Internal Server Error';
    return res.status(status).json({ error: message });
};
