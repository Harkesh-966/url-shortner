import dotenv from 'dotenv';
dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '4000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/url_shortener',
    JWT_SECRET: process.env.JWT_SECRET || 'change-me',
    JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as string | undefined) ?? '7d',
    COOKIE_SECURE: (process.env.COOKIE_SECURE || 'false') === 'true',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
} as const;

export default env;
