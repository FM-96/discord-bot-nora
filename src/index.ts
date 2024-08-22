import 'dotenv/config';

import path from 'node:path';
import express from 'express';
import later from 'later';
import mongoose from 'mongoose';
import routes from './app/routes';
import client from './bot/client';
import { check } from './bot/egsCheck';
import globalStorage from './bot/globalStorage';
import web from './webserver';

globalStorage.set('startupTime', Date.now());

// set up express routes
web.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
web.app.use(express.json());
web.app.use(routes);
web.app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
web.app.use((_req, res) => {
	res.sendStatus(404);
});

mongoose
	.connect(process.env.DATABASE as string, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('Successfully connected to database');

		// start webserver
		web.httpServer.listen(process.env.PORT);
	})
	.catch((error) => {
		if (error) {
			console.error(`Error while connecting to database: ${error}`);
			process.exit(1);
		}
	});

// start scheduled tasks
const hourlySchedule = later.parse.recur().on(5).minute();
const stanleyParableMonthly = later.parse.recur().on(7).dayOfMonth().on('06:45:28').time();

later.setInterval(stanleyParableCountdown, stanleyParableMonthly);
later.setInterval(check, hourlySchedule);

/* functions */
function stanleyParableCountdown() {
	// The Stanley Parable last played: 1383806728 (Unix Timestamp)
	const remainingMonths = later
		.schedule(stanleyParableMonthly)
		.next(60, new Date(Date.now() + 10000), new Date(1541573138000)) as Date[];
	let message: string;
	if (remainingMonths.length > 0) {
		message = `Another month done. Only ${remainingMonths.length} month${remainingMonths.length === 1 ? '' : 's'} remaining until you've earned the *Go Outside* achievement.`;
	} else {
		message = `:tada: **You did it!** You didn't play *The Stanley Parable* for 5 years! :tada:`;
	}
	const channel = client.instance?.channels.cache.get('133750021861408768');
	if (channel?.isText()) {
		channel.send(message).catch(console.error);
	} else {
		console.error('Invalid channel');
	}
}
