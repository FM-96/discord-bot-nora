import type { Task } from 'command-handler';

const task: Task = {
	name: 'gay',
	limited: false,
	allowBots: true,
	allowSelf: true,
	test: async (message) => /\bgay\b/i.test(message.content),
	run: async (message, _context) => {
		await message.react('🏳️‍🌈');
	},
};

export default task;
