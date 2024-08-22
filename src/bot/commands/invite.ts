import type { Command } from 'command-handler';
import type { Guild, GuildMember } from 'discord.js';

const command: Command = {
	command: 'invite',
	aliases: [],
	ownerOnly: false,
	run: async (message, _context) => {
		let targetId: string;
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 2) {
			await message.channel.send('Error: Please specify a bot.');
			return;
		}
		const match = /^<@!?(\d+)>$|^(\d+)$/.exec(msgSplit[1]);
		if (!match) {
			await message.channel.send('Error: Invalid user ID or mention.');
			return;
		}
		targetId = match[1] || match[2];

		let targetMember: GuildMember;
		try {
			targetMember = await (message.guild as Guild).members.fetch(targetId);
		} catch (err) {
			await message.channel.send(`Error: ${err instanceof Error ? err.message : err}`);
			return;
		}
		if (!targetMember) {
			await message.channel.send('Error: User not found in this server.');
			return;
		}
		if (!targetMember.user.bot) {
			await message.channel.send('Error: User is not a bot.');
			return;
		}
		const managedRole = targetMember.roles.cache.filter((e) => e.managed).first();
		if (!managedRole) {
			await message.channel.send("Error: Bot doesn't have a managed role.");
			return;
		}
		await message.channel.send(
			`Invite link for __${targetMember.user.username}__:\n<https://discordapp.com/oauth2/authorize?client_id=${targetMember.user.id}&permissions=${managedRole.permissions}&scope=bot>`,
		);
	},
};

export default command;
