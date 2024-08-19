const express = require('express');
const router = express.Router();

const apiController = require('./api.controller.js');

router.post('/message', apiController.postMessage);
router.post('/playing', apiController.changePlaying);
router.post('/reconnect', apiController.reconnect);
router.post('/restart', apiController.restart);

module.exports = router;
