require('dotenv').config();

// load npm modules
const express = require('express');
const later = require('later');
const mongoose = require('mongoose');

// load node modules
const path = require('path');

// load own modules
const egsCheck = require('./bot/egsCheck.js');
const globalStorage = require('./bot/globalStorage.js');
const routes = require('./app/routes.js');
const web = require('./webserver.js');

// load configs
const webConfig = require('./config/web.js');

const client = require('./bot/client.js');
globalStorage.set('startupTime', Date.now());

// set up express routes
web.app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
web.app.use(express.json());
web.app.use(routes);
web.app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
web.app.use(function (req, res) {
	res.sendStatus(404);
});

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
	console.log('Successfully connected to database');

	// start webserver
	web.httpServer.listen(webConfig.port);
}).catch(error => {
	if (error) {
		console.error('Error while connecting to database: ' + error);
		process.exit(1);
	}
});

// start scheduled tasks
const hourlySchedule = later.parse.recur().on(5).minute();
const stanleyParableMonthly = later.parse.recur().on(7).dayOfMonth().on('06:45:28').time();

later.setInterval(stanleyParableCountdown, stanleyParableMonthly);
later.setInterval(egsCheck.check, hourlySchedule);

/* functions */
function stanleyParableCountdown() {
	// The Stanley Parable last played: 1383806728 (Unix Timestamp)
	const remainingMonths = later.schedule(stanleyParableMonthly).next(60, Date.now() + 10000, new Date(1541573138000));
	let message;
	if (remainingMonths.length > 0) {
		message = `Another month done. Only ${remainingMonths.length} month${remainingMonths.length === 1 ? '' : 's'} remaining until you've earned the *Go Outside* achievement.`;
	} else {
		message = `:tada: **You did it!** You didn't play *The Stanley Parable* for 5 years! :tada:`;
	}
	client.instance.channels.cache.get('133750021861408768').send(message).catch(console.error);
}
