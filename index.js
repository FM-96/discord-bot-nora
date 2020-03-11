require('dotenv').config();

// load npm modules
const express = require('express');
const later = require('later');
// const argv = require('minimist')(process.argv.slice(2));
const mongoose = require('mongoose');

// use native promises for mongoose
mongoose.Promise = Promise;

// load node modules
const path = require('path');

// load own modules
const egsCheck = require('./bot/egsCheck.js');
const globalStorage = require('./bot/globalStorage.js');
const routes = require('./app/routes.js');
const showpact = require('./app/showpact/showpact.controller.js');
const strawpoll = require('./bot/strawpoll/strawpoll.js');
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
const twiceHourlySchedule = later.parse.recur().on(5, 35).minute();
// const dailySchedule = later.parse.recur().on(0).hour();
// const weeklySchedule = later.parse.recur().first().dayOfWeek();
const stanleyParableMonthly = later.parse.recur().on(7).dayOfMonth().on('06:45:28').time();

later.setInterval(showpact.checkForUpdates, twiceHourlySchedule);
// later.setInterval(showpact.sendReminders, dailySchedule);
later.setInterval(strawpoll.processAllPolls, hourlySchedule);
// later.setInterval(remindOfPancake, weeklySchedule);
later.setInterval(stanleyParableCountdown, stanleyParableMonthly);
later.setInterval(egsCheck.check, hourlySchedule);

/* functions */
// function remindOfPancake() {
// 	if (!client.instance.guilds.get('138404620128092160').members.get('197553759151194112')) {
// 		client.instance.channels.get('138404620128092160').sendMessage('Hey <@103267161757204480>, you still haven\'t readded Pancake yet!').catch(
// 			function (err) {
// 				console.error(err);
// 			}
// 		);
// 	}
// }

function stanleyParableCountdown() {
	// The Stanley Parable last played: 1383806728 (Unix Timestamp)
	const remainingMonths = later.schedule(stanleyParableMonthly).next(60, Date.now() + 10000, new Date(1541573138000));
	let message;
	if (remainingMonths.length > 0) {
		message = `Another month done. Only ${remainingMonths.length} month${remainingMonths.length === 1 ? '' : 's'} remaining until you've earned the *Go Outside* achievement.`;
	} else {
		message = `:tada: **You did it!** You didn't play *The Stanley Parable* for 5 years! :tada:`;
	}
	client.instance.channels.get('133750021861408768').send(message).catch(console.error);
}
