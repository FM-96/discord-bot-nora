import type { Command } from 'command-handler';
import randomAnimal from '../randomAnimal';

const command: Command = {
	command: 'cat',
	aliases: [],
	description: 'Post a random picture of a cat',
	usage: '',
	ownerOnly: false,
	run: async (message, _context) => {
		const catImage = await randomAnimal('cat');
		await message.channel.send({ files: [catImage] });
	},
};

export default command;
