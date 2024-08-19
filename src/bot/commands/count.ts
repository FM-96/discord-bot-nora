// syntax: §count ['*'|'all'|USER_ID]
const bulkMessages = require('../bulkMessages.js');

module.exports = {
	command: 'count',
	ownerOnly: true,
	run: async (message, context) => {
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
		let countSelf;
		if (user) {
			countSelf = user === message.client.user.id;
			try {
				username = message.client.users.cache.get(user).username;
			} catch (err) {
				username = 'user with ID ' + user;
			}
		} else {
			countSelf = true;
		}

		await message.delete();
		const resultMessage = await message.channel.send(`Counting messages ${user !== null ? `from ${username} ` : ''}in this channel...`);
		const messages = await bulkMessages.getChannelMessages(message.channel, user, null, resultMessage.id);
		const isSingleMessage = messages.length === 1;
		return resultMessage.edit(`There ${isSingleMessage ? 'is' : 'are'} **${messages.length}** message${isSingleMessage ? '' : 's'} ${user !== null ? `from ${username} ` : ''}in this channel${countSelf ? ' (excluding this one)' : ''}.`);
	},
};
