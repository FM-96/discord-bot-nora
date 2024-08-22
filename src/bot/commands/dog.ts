import type { Command } from 'command-handler';
import randomAnimal from '../randomAnimal';

const command: Command = {
	command: 'dog',
	aliases: [],
	description: 'Post a random picture of a dog',
	usage: '',
	ownerOnly: false,
	run: async (message, _context) => {
		const dogImage = await randomAnimal('dog');
		await message.channel.send({ files: [dogImage] });
	},
};

export default command;
