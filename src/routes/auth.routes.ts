import { Router } from 'express';
import { z } from 'zod';
import * as Controller from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

const credSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8)
    })
});

router.post('/register', validate(credSchema), Controller.register);
router.post('/login', validate(credSchema), Controller.login);
router.post('/logout', Controller.logout);

export default router;
