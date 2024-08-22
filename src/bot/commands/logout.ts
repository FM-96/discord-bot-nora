import type { Command } from 'command-handler';
import client from '../client';

const command: Command = {
	command: 'logout',
	aliases: [],
	ownerOnly: true,
	run: async (message, _context) => {
		await message.channel.send('Logging out...');
		await client.logout();
	},
};

export default command;
