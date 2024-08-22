// syntax: §del ('*'|'all'|USER_ID) NUMBER_OF_MESSAGES
import type { Command } from 'command-handler';
import type { TextChannel } from 'discord.js';
import { cleanup, isProtected } from '../bulkMessages';

const command: Command = {
	command: 'del',
	aliases: [],
	ownerOnly: true,
	run: async (message, _context) => {
		const reaction = await message.react('🛡️');
		if (!isProtected(reaction.message)) {
			await message.channel.send('**ABORT: MESSAGE PROTECTION NOT WORKING**');
			return;
		}
		await message.delete();
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 3) {
			return;
		}
		let user = msgSplit[1];
		const number = Number.parseInt(msgSplit[2], 10);
		if (Number.isNaN(number)) {
			return;
		}

		let amountDeleted: number;
		if (user === 'all' || user === '*') {
			amountDeleted = await cleanup(message.channel as TextChannel, null, number);
		} else {
			const match = /^<@!?(\d+)>$|^(\d+)$/.exec(user);
			if (!match) {
				await message.channel.send('Error: Invalid user ID or mention.');
				return;
			}
			user = match[1] || match[2];

			amountDeleted = await cleanup(message.channel as TextChannel, user, number);
		}

		console.log(`done: deleted ${amountDeleted} messages`);
	},
};

export default command;
