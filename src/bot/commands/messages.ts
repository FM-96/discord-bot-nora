// syntax: §messages NUMBER_OF_MESSAGES [MESSAGE_TEXT]

module.exports = {
	command: 'messages',
	description: 'Send multiple messages',
	usage: '<number of messages> [message text]',
	ownerOnly: true,
	run: async (message, context) => {
		await message.delete();
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 2) {
			return;
		}
		const amount = parseInt(msgSplit[1], 10);
		if (isNaN(amount)) {
			return;
		}

		const messageText = msgSplit.slice(2).join(' ');

		for (let i = 0; i < amount; ++i) {
			await message.channel.send(messageText || i + 1);
		}
		console.log('done: sent ' + amount + ' messages');
	},
};
