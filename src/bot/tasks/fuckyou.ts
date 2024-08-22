import type { Task } from 'command-handler';

const task: Task = {
	name: 'fuckyou',
	limited: true,
	test: async (message) =>
		message.content.toLowerCase().includes('fuck you') && !message.author.bot,
	run: async (message, _context) => {
		await message.channel.send(
			`Fuck *you*, ${message.author.username}! Meatbags like you are nothing but a waste of oxygen.`,
		);
	},
};

export default task;
