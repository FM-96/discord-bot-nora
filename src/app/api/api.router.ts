import { Router } from 'express';
import apiController from './api.controller';

const router = Router();

router.post('/message', apiController.postMessage);
router.post('/playing', apiController.changePlaying);
router.post('/reconnect', apiController.reconnect);
router.post('/restart', apiController.restart);

export default router;
