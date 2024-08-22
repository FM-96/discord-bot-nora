import type { Task } from 'command-handler';

const task: Task = {
	name: 'pancake',
	limited: false,
	allowBots: true,
	test: async (message) => message.author.id === '197553759151194112',
	run: async (message, _context) => {
		await message.react('🥞');
	},
};

export default task;
