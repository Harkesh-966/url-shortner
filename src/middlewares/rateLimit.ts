import { Request, Response, NextFunction } from 'express';

type Bucket = { tokens: number; last: number };
const buckets: Record<string, Bucket> = {};
const RATE = 10; // tokens
const PER_MS = 60 * 1000; // per minute

export const anonRateLimit = (req: Request, res: Response, next: NextFunction) => {
    // authenticated users are not rate-limited here
    if (req.userId) return next();
    const key = req.ip || 'unknown';
    const now = Date.now();
    const bucket = buckets[key] || { tokens: RATE, last: now };
    const elapsed = now - bucket.last;
    const refill = (elapsed / PER_MS) * RATE;
    bucket.tokens = Math.min(RATE, bucket.tokens + refill);
    bucket.last = now;
    if (bucket.tokens < 1) {
        res.status(429).json({ error: 'Too many requests' });
        buckets[key] = bucket;
        return;
    }
    bucket.tokens -= 1;
    buckets[key] = bucket;
    next();
};
