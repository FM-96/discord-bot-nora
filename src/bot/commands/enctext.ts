import base65536 from 'base65536';
import type { Command } from 'command-handler';

const command: Command = {
	command: 'enctext',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		// TODO also allow attachments
		const plainText = message.content.split(' ').slice(1).join(' ');
		const encodedText = base65536.encode(Buffer.from(plainText));
		await message.channel.send(encodedText);
	},
};

export default command;
