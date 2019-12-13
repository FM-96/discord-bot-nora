// syntax: §purge ['*'|'all'|USER_ID]
const bulkMessages = require('../bulkMessages.js');
const purges = require('../purges.js');

module.exports = {
	command: 'purge',
	description: 'Delete all messages in the channel',
	usage: '["*"|"all"|user ID]',
	ownerOnly: true,
	run: async (message, context) => {
		// TODO better security against accidental purge
		let user;
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 2) {
			user = 'all';
		} else {
			user = msgSplit[1];
		}
		if (user === 'all' || user === '*') {
			user = null;
		} else {
			const match = /^<@!?(\d+)>$|^(\d+)$/.exec(user);
			if (!match) {
				return message.channel.send('Error: Invalid user ID or mention.');
			}
			user = match[1] || match[2];
		}

		let username;
		if (user) {
			try {
				username = message.client.users.get(user).username;
			} catch (err) {
				username = 'user with ID ' + user;
			}
		}

		await message.delete();
		const PURGE_DELAY = 10000;
		const warning = await message.channel.send(`__**WARNING**__: Purging this channel in ${PURGE_DELAY / 1000} seconds.\nThis will delete all messages from ${user !== null ? `${username}` : '**all users**'}!`);
		if (purges[message.channel.id]) {
			clearTimeout(purges[message.channel.id]);
		}
		const amountDeleted = await new Promise(function (resolve, reject) {
			purges[message.channel.id] = setTimeout(() => {
				delete purges[message.channel.id];
				resolve(
					warning.delete().then(res =>
						bulkMessages.cleanup(message.channel, user, null)
					)
				);
			}, PURGE_DELAY);
		});
		console.log('done: purged ' + amountDeleted + ' messages');
	},
};
