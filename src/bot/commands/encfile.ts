import base65536 from 'base65536';
import type { Command } from 'command-handler';
import got from 'got';

const command: Command = {
	command: 'encfile',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		// TODO also allow links to files
		// TODO test
		const attachment = message.attachments.first();
		if (!attachment) {
			await message.channel.send('No file found.');
			return;
		}
		const buffer = await got(attachment.proxyURL).buffer();
		await message.channel.send(base65536.encode(buffer));
	},
};

export default command;
