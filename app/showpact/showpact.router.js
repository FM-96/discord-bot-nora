const express = require('express');
const router = express.Router();

const showpactController = require('./showpact.controller.js');

router.post('/add', showpactController.addPact);
router.post('/delete', showpactController.deletePact);
router.get('/list', showpactController.list);

module.exports = router;
