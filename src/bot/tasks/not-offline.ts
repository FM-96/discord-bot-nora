import type { Task } from 'command-handler';
import type { ClientUser } from 'discord.js';

const task: Task = {
	disabled: true,
	name: 'botRestart',
	limited: true,
	allowBots: true,
	test: async (message) =>
		message.author.id === '216179498683596802' &&
		Boolean(
			message.content.match(
				RegExp(
					`^Hey <@103255776218345472>, your bot <@!?${(message.client.user as ClientUser).id})> has just gone offline!$`,
				),
			),
		),
	run: async (message, _context) => {
		await message.channel.send("What? No, I'm not");
	},
};

export default task;
