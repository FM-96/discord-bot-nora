import type { Command } from 'command-handler';
import { getJoke as getDadJoke } from '../jokes/dadJokes';
import { getJoke as getMitsukuJoke } from '../jokes/mitsukuJokes';

const command: Command = {
	command: 'joke',
	aliases: [],
	description: 'Post a random joke',
	usage: '',
	ownerOnly: false,
	run: async (message, _context) => {
		let randomJoke: string;
		if (Math.random() < 0.7) {
			randomJoke = await getDadJoke();
		} else {
			randomJoke = await getMitsukuJoke();
		}
		await message.channel.send(randomJoke);
	},
};
export default command;
