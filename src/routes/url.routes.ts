import { Router } from 'express';
import { z } from 'zod';
import * as Controller from '../controllers/url.controller.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import { anonRateLimit } from '../middlewares/rateLimit.js';

const router = Router();

const createSchema = z.object({
    body: z.object({
        originalUrl: z.string().url(),
        expiresAt: z.string().datetime().optional()
    })
});

const bulkSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            originalUrl: z.string().url(),
            expiresAt: z.string().datetime().optional()
        })).min(1).max(100)
    })
});

router.post('/', anonRateLimit, validate(createSchema), Controller.create);
router.post('/bulk', requireAuth, validate(bulkSchema), Controller.bulk);
router.get('/:id/analytics', requireAuth, Controller.analytics);
router.get('/:id/qr', Controller.qr);

export default router;
