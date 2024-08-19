const express = require('express');
const router = express.Router();

const path = require('path');

const options = {
	root: path.join(__dirname, '..', '..', 'public'),
};

router.get('/', function (req, res) {
	res.sendFile('index.html', options);
});
router.get('/restart', function (req, res) {
	res.sendFile('restart.html', options);
});

router.get('/robots.txt', function (req, res) {
	res.type('txt').send('User-agent: *\nDisallow: /');
});

module.exports = router;
