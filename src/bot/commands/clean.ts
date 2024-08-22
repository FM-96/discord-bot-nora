import type { Command } from 'command-handler';

const command: Command = {
	command: 'clean',
	aliases: [],
	ownerOnly: false,
	run: async (message, context) => {
		const argText = message.cleanContent
			.substring(context.prefix.length + context.command.length)
			.trim();
		await message.channel.send(`Cleaned message: "${argText}"`);
	},
};

export default command;
