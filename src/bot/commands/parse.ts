import type { Command } from 'command-handler';
import yargsParser from 'yargs-parser';

const command: Command = {
	command: 'parse',
	aliases: ['yargsTest'],
	ownerOnly: false,
	run: async (message, _context) => {
		const argv = yargsParser(message.content.split(' ').slice(1).join(' '));

		// biome-ignore lint/style/useTemplate: code fences look much worse with template literals
		await message.channel.send('```json\n' + JSON.stringify(argv, null, '\t') + '\n```');
	},
};

export default command;
