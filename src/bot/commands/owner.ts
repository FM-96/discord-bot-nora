import type { Command } from 'command-handler';

const command: Command = {
	command: 'owner',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		const app = await message.client.fetchApplication();
		await message.channel.send(`My owner is ${app.owner}.`);
	},
};

export default command;
