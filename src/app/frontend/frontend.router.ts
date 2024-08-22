import path from 'node:path';
import { Router } from 'express';

const router = Router();

const options = {
	root: path.join(__dirname, '..', '..', 'public'),
};

router.get('/', (_req, res) => {
	res.sendFile('index.html', options);
});
router.get('/restart', (_req, res) => {
	res.sendFile('restart.html', options);
});

router.get('/robots.txt', (_req, res) => {
	res.type('txt').send('User-agent: *\nDisallow: /');
});

export default router;
