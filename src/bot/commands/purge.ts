// syntax: §purge ['*'|'all'|USER_ID]
import type { Command } from 'command-handler';
import type { NewsChannel, TextChannel } from 'discord.js';
import { cleanup, isProtected } from '../bulkMessages';
import purges from '../purges';

const command: Command = {
	command: 'purge',
	aliases: [],
	description: 'Delete all messages in the channel',
	usage: '["*"|"all"|user ID]',
	ownerOnly: true,
	inDms: false,
	run: async (message, _context) => {
		const reaction = await message.react('🛡️');
		if (!isProtected(reaction.message)) {
			await message.channel.send('**ABORT: MESSAGE PROTECTION NOT WORKING**');
			return;
		}
		// TODO better security against accidental purge
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
		if (user) {
			username = message.client.users.cache.get(user)?.username ?? `user with ID ${user}`;
		}

		await message.delete();
		const PURGE_DELAY = 10000;
		const warning = await message.channel.send(
			`__**WARNING**__: Purging this channel in ${PURGE_DELAY / 1000} seconds.\nThis will delete all messages from ${user !== null ? `${username}` : '**all users**'}!`,
		);
		if (purges[message.channel.id]) {
			clearTimeout(purges[message.channel.id]);
		}
		const amountDeleted = await new Promise((resolve, _reject) => {
			purges[message.channel.id] = setTimeout(() => {
				delete purges[message.channel.id];
				resolve(
					warning
						.delete()
						.then(() => cleanup(message.channel as TextChannel | NewsChannel, user, null)),
				);
			}, PURGE_DELAY);
		});
		console.log(`done: purged ${amountDeleted} messages`);
	},
};

export default command;
