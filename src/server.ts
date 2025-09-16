import env from './config/env.js';
import { connectDB } from './db/mongoose.js';
import { log } from './config/logger.js';
import app from './app.js';

const start = async () => {
    await connectDB();
    app.listen(env.PORT, () => log.info(`Server running on :${env.PORT}`));
};

start().catch(err => {
    log.error('Startup failed', err);
    process.exit(1);
});
