import type { Task } from 'command-handler';
import type { ClientUser } from 'discord.js';

const botVersion =
	require('../../../package.json').version + (process.env.NODE_ENV === 'development' ? '-dev' : '');

const task: Task = {
	name: 'X-mention',
	limited: true,
	test: async (message) => message.mentions.has((message.client.user as ClientUser).id),
	run: async (message, _context) => {
		if (message.content.toLowerCase().includes('version')) {
			await message.channel.send(`v${botVersion}`);
		} else {
			await message.channel.send('Yo.');
		}
	},
};

export default task;
