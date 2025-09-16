import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.js';

export const validate = (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
        return next(new ApiError(400, result.error.flatten().formErrors.join(', ') || 'Validation failed'));
    }
    next();
};
