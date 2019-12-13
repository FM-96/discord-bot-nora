// syntax: §del ('*'|'all'|USER_ID) NUMBER_OF_MESSAGES
const bulkMessages = require('../bulkMessages.js');

module.exports = {
	command: 'del',
	ownerOnly: true,
	run: async (message, context) => {
		await message.delete();
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 3) {
			return;
		}
		let user = msgSplit[1];
		const number = parseInt(msgSplit[2], 10);
		if (isNaN(number)) {
			return;
		}

		let amountDeleted;
		if (user === 'all' || user === '*') {
			amountDeleted = await bulkMessages.cleanup(message.channel, null, number);
		} else {
			const match = /^<@!?(\d+)>$|^(\d+)$/.exec(user);
			if (!match) {
				return message.channel.send('Error: Invalid user ID or mention.');
			}
			user = match[1] || match[2];

			amountDeleted = await bulkMessages.cleanup(message.channel, user, number);
		}

		console.log('done: deleted ' + amountDeleted + ' messages');
	},
};
