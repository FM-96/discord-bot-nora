import type { Task } from 'command-handler';

const task: Task = {
	name: 'schrampft',
	limited: false,
	allowBots: true,
	test: async (message) => message.author.id === '235081753260326912',
	run: async (message, _context) => {
		const reactions = ['👌', '👍', '❤'];
		await message.react(reactions[Math.floor(Math.random() * reactions.length)]);
	},
};

export default task;
