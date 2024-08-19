const express = require('express');
const router = express.Router();

const apiRouter = require('./api/api.router.js');
const frontendRouter = require('./frontend/frontend.router.js');

router.use('/api/nora', apiRouter);
router.use('/', frontendRouter);

module.exports = router;
