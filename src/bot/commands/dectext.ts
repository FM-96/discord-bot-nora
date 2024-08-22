import base65536 from 'base65536';
import type { Command } from 'command-handler';

const command: Command = {
	command: 'dectext',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		// TODO also allow encoded text as attachment
		const encodedText = message.content.split(' ').slice(1).join(' ');
		let decodedText: string;
		try {
			decodedText = base65536.decode(encodedText).toString();
			await message.channel.send(decodedText);
		} catch (err) {
			await message.channel.send(
				`Could not decode text: ${err instanceof Error ? err.message : err}`,
			);
		}
	},
};

export default command;
