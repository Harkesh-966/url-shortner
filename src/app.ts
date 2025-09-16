import express from 'express';
import morgan from 'morgan';
import { securityMiddlewares } from './middlewares/security.js';
import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import { errorHandler } from './middlewares/error.js';
import { redirect } from './controllers/url.controller.js';

const app = express();
app.use(securityMiddlewares());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
// CSRF token fetcher for clients (returns token; cookie is set by csurf)
app.get('/api/csrf', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// redirect route
app.get('/:code', redirect);

// error
app.use(errorHandler);

export default app;
