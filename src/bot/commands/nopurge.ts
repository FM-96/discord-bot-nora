import type { Command } from 'command-handler';
import purges from '../purges';

const command: Command = {
	command: 'nopurge',
	aliases: [],
	description: 'Stop a scheduled purge',
	usage: '',
	ownerOnly: true,
	run: async (message, _context) => {
		await message.delete();
		if (purges[message.channel.id]) {
			clearTimeout(purges[message.channel.id]);
			delete purges[message.channel.id];
			await message.channel.send('Purge aborted.');
		} else {
			await message.channel.send(
				`Well... there wasn't any purge for this channel scheduled anyway, but okay. I won't purge this channel.`,
			);
		}
	},
};

export default command;
