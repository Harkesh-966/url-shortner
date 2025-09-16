import { Url, IUrl } from '../models/Url.js';
import { Click } from '../models/Click.js';
import { generateShortCode } from '../utils/shortcode.js';
import { ApiError } from '../middlewares/error.js';
import crypto from 'crypto';

export const createShortUrl = async (originalUrl: string, owner?: string, expiresAt?: Date): Promise<IUrl> => {
    // check duplicates for owner or anonymous
    const existing = await Url.findOne({ originalUrl, owner: owner || null });
    if (existing) return existing;
    let code = generateShortCode();
    for (let i = 0; i < 5; i++) {
        const conflict = await Url.findOne({ code });
        if (!conflict) break;
        code = generateShortCode();
    }
    const url = await Url.create({ originalUrl, code, owner: owner || undefined, expiresAt });
    return url;
};

export const recordClick = async (url: IUrl, meta: { referrer?: string; country?: string; ip?: string; ua?: string; }) => {
    const ipHash = meta.ip ? crypto.createHash('sha256').update(meta.ip).digest('hex') : undefined;
    await Click.create({
        url: url._id,
        referrer: meta.referrer,
        country: meta.country,
        userAgent: meta.ua,
        ipHash
    });
};

export const findByCode = async (code: string) => {
    const url = await Url.findOne({ code });
    if (!url) throw new ApiError(404, 'Short URL not found');
    if (url.expiresAt && url.expiresAt.getTime() < Date.now()) throw new ApiError(410, 'URL expired');
    return url;
};

export const getAnalytics = async (urlId: string) => {
    const [agg] = await Click.aggregate([
        { $match: { url: new (await import('mongoose')).default.Types.ObjectId(urlId) } },
        {
            $facet: {
                daily: [
                    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                weekly: [
                    { $group: { _id: { $isoWeek: "$date", year: { $isoWeekYear: "$date" } }, count: { $sum: 1 } } },
                    { $sort: { "_id.year": 1, "_id": 1 } }
                ],
                monthly: [
                    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                countries: [
                    { $group: { _id: "$country", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ],
                referrers: [
                    { $group: { _id: "$referrer", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]
            }
        }
    ]);
    return agg || { daily: [], weekly: [], monthly: [], countries: [], referrers: [] };
};
