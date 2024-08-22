import type { Command } from 'command-handler';

const command: Command = {
	command: 'echo',
	aliases: [],
	ownerOnly: false,
	run: async (message, context) => {
		const argText = message.content
			.substring(context.prefix.length + context.command.length)
			.trim();
		// biome-ignore lint/style/useTemplate: code fences look much worse with template literals
		await message.channel.send('```\n' + argText + '\n```');
	},
};

export default command;
