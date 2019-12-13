const globalStorage = require('../globalStorage.js');

module.exports = {
	command: 'uptime',
	description: 'Show the bot\'s uptime',
	usage: '',
	ownerOnly: false,
	run: async (message, context) => {
		const now = Date.now();
		const timeSinceStartup = formatDuration(now - globalStorage.get('startupTime'));
		const timeSinceLogin = formatDuration(now - globalStorage.get('loginTime'));
		return message.channel.send(`Time since program start: **${timeSinceStartup}**\nTime since last login: **${timeSinceLogin}**`);
	},
};

function formatDuration(duration) {
	const durationTotalSeconds = Math.floor(duration / 1000);

	const durationDisplayDays = Math.floor(durationTotalSeconds / 86400);
	const durationDisplayHours = Math.floor(durationTotalSeconds / 3600) - (durationDisplayDays * 24);
	const durationDisplayMinutes = Math.floor(durationTotalSeconds / 60) - (durationDisplayHours * 60) - (durationDisplayDays * 60 * 24);
	const durationDisplaySeconds = durationTotalSeconds - (durationDisplayMinutes * 60) - (durationDisplayHours * 60 * 60) - (durationDisplayDays * 60 * 60 * 24);

	let durationText = '';
	if (durationDisplayDays > 0) {
		durationText += durationDisplayDays + ' day' + (durationDisplayDays === 1 ? ' ' : 's ');
	}
	if (durationDisplayHours > 0) {
		durationText += durationDisplayHours + ' hour' + (durationDisplayHours === 1 ? ' ' : 's ');
	}
	if (durationDisplayMinutes > 0) {
		durationText += durationDisplayMinutes + ' minute' + (durationDisplayMinutes === 1 ? ' ' : 's ');
	}
	durationText += durationDisplaySeconds + ' second' + (durationDisplaySeconds === 1 ? '' : 's');

	return durationText;
}
