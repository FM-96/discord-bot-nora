import type { Command } from 'command-handler';

const command: Command = {
	command: 'color',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		await message.channel.send('#f1a8cb');
	},
};

export default command;
