// syntax: §messages NUMBER_OF_MESSAGES [MESSAGE_TEXT]

import type { Command } from 'command-handler';

const command: Command = {
	command: 'messages',
	aliases: [],
	description: 'Send multiple messages',
	usage: '<number of messages> [message text]',
	ownerOnly: true,
	run: async (message, _context) => {
		await message.delete();
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 2) {
			return;
		}
		const amount = Number.parseInt(msgSplit[1], 10);
		if (Number.isNaN(amount)) {
			return;
		}

		const messageText = msgSplit.slice(2).join(' ');

		for (let i = 0; i < amount; ++i) {
			await message.channel.send(messageText || i + 1);
		}
		console.log(`done: sent ${amount} messages`);
	},
};

export default command;
