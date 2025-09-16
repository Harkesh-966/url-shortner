import { NextFunction, Request, Response } from 'express';
import * as UrlService from '../services/url.service.js';
import { Url } from '../models/Url.js';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { originalUrl, expiresAt } = req.body as { originalUrl: string; expiresAt?: string };
        const owner = req.userId;
        const url = await UrlService.createShortUrl(originalUrl, owner, expiresAt ? new Date(expiresAt) : undefined);
        res.status(201).json({ id: url.id, code: url.code, originalUrl: url.originalUrl, shortUrl: `${req.protocol}://${req.get('host')}/${url.code}`, expiresAt: url.expiresAt });
    } catch (error) {
        next(error)
    }
};

export const bulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = req.body.items as { originalUrl: string; expiresAt?: string }[];
        const results = await Promise.all(items.map(i => UrlService.createShortUrl(i.originalUrl, req.userId, i.expiresAt ? new Date(i.expiresAt) : undefined)));
        res.status(201).json(results.map(url => ({ id: url.id, code: url.code, originalUrl: url.originalUrl })));
    } catch (error) {
        next(error)
    }
};

export const redirect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.params;
        const url = await UrlService.findByCode(code);
        const country = (req.headers['cf-ipcountry'] as string) || (req.headers['x-country'] as string) || 'unknown';
        const ref = req.get('referer') || 'direct';
        await UrlService.recordClick(url, { country, referrer: ref, ip: req.ip, ua: req.get('user-agent') || '' });
        res.redirect(302, url.originalUrl);
    } catch (error) {
        next(error)
    }
};

export const analytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = await Url.findById(req.params.id);
        if (!url) return res.status(404).json({ error: 'Not found' });
        if (url.owner && url.owner.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });
        const data = await UrlService.getAnalytics(url.id);
        res.json(data);
    } catch (error) {
        next(error)
    }
};

export const qr = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = await Url.findById(req.params.id);
        if (!url) return res.status(404).json({ error: 'Not found' });
        const { generateQrPngBase64 } = await import('../utils/qr.js');
        const pngBase64 = await generateQrPngBase64(`${req.protocol}://${req.get('host')}/${url.code}`);
        res.type('image/png');
        res.send(Buffer.from(pngBase64, 'base64'));
    } catch (error) {
        next(error)
    }
};
