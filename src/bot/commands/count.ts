// syntax: §count ['*'|'all'|USER_ID]
import type { Command } from 'command-handler';
import type { ClientUser, TextChannel } from 'discord.js';
import { getChannelMessages } from '../bulkMessages';

const command: Command = {
	command: 'count',
	aliases: [],
	ownerOnly: true,
	run: async (message, _context) => {
		let user: string | null;
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
				await message.channel.send('Error: Invalid user ID or mention.');
				return;
			}
			user = match[1] || match[2];
		}

		let username: string | undefined;
		let countSelf: boolean;
		if (user) {
			countSelf = user === (message.client.user as ClientUser).id;
			username = message.client.users.cache.get(user)?.username ?? `user with ID ${user}`;
		} else {
			countSelf = true;
		}

		await message.delete();
		const resultMessage = await message.channel.send(
			`Counting messages ${user !== null ? `from ${username} ` : ''}in this channel...`,
		);
		const messages = await getChannelMessages(
			message.channel as TextChannel,
			user,
			null,
			resultMessage.id,
		);
		const isSingleMessage = messages.length === 1;
		await resultMessage.edit(
			`There ${isSingleMessage ? 'is' : 'are'} **${messages.length}** message${isSingleMessage ? '' : 's'} ${user !== null ? `from ${username} ` : ''}in this channel${countSelf ? ' (excluding this one)' : ''}.`,
		);
	},
};

export default command;
