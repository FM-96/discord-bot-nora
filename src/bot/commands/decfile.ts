import base65536 from 'base65536';
import type { Command } from 'command-handler';

const command: Command = {
	command: 'decfile',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		// TODO also allow encoded file as attachment
		// TODO test
		const encodedFile = message.content.split(' ').slice(1).join(' ');
		let decodedFile: Buffer;
		try {
			decodedFile = base65536.decode(encodedFile);
			await message.channel.send({ files: [{ attachment: decodedFile }] });
		} catch (err) {
			await message.channel.send(
				`Could not decode file: ${err instanceof Error ? err.message : err}`,
			);
		}
	},
};

export default command;
