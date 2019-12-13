module.exports = {
	command: 'invite',
	ownerOnly: false,
	run: async (message, context) => {
		let targetId;
		const msgSplit = message.content.split(' ');
		if (msgSplit.length < 2) {
			return message.channel.send('Error: Please specify a bot.');
		} else {
			const match = /^<@!?(\d+)>$|^(\d+)$/.exec(msgSplit[1]);
			if (!match) {
				return message.channel.send('Error: Invalid user ID or mention.');
			}
			targetId = match[1] || match[2];
		}

		let targetMember;
		try {
			targetMember = await message.guild.fetchMember(targetId);
		} catch (err) {
			return message.channel.send(`Error: ${err.message}`);
		}
		if (targetMember) {
			if (!targetMember.user.bot) {
				return message.channel.send('Error: User is not a bot.');
			}
			const managedRole = targetMember.roles.filter(e => e.managed).first();
			if (!managedRole) {
				return message.channel.send('Error: Bot doesn\'t have a managed role.');
			}
			return message.channel.send(`Invite link for __${targetMember.user.username}__:\n<https://discordapp.com/oauth2/authorize?client_id=${targetMember.user.id}&permissions=${managedRole.permissions}&scope=bot>`);
		} else {
			return message.channel.send('Error: User not found in this server.');
		}
	},
};
