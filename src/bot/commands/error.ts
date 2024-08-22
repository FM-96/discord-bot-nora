import type { Command } from 'command-handler';

const command: Command = {
	command: 'error',
	aliases: [],
	description: 'Deliberately throw an error inside the command',
	usage: '',
	ownerOnly: true,
	run: async (_message, _context) => {
		throw new Error('Deliberately induced error');
	},
};

export default command;
