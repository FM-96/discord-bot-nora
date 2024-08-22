import { Router } from 'express';
import apiRouter from './api/api.router';
import frontendRouter from './frontend/frontend.router';

const router = Router();

router.use('/api/nora', apiRouter);
router.use('/', frontendRouter);

export default router;
