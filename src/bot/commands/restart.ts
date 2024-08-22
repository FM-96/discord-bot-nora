import type { Command } from 'command-handler';

const command: Command = {
	command: 'restart',
	aliases: [],
	ownerOnly: true,
	run: async (_message, _context) => {
		console.log('Restarted via command');
		process.exit(2);
	},
};

export default command;
