import type { Command } from 'command-handler';

const command: Command = {
	command: 'tts',
	aliases: [],
	ownerOnly: false,
	run: async (message, context) => {
		const argText = message.content
			.substring(context.prefix.length + context.command.length)
			.trim();
		await message.channel.send(argText, { tts: true });
	},
};

export default command;
