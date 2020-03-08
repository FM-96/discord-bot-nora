module.exports = {
	command: 'botposts',
	aliases: [],
	description: null,
	usage: null,
	ownerOnly: false,
	adminOnly: false,
	modOnly: false,
	inGuilds: true,
	inDms: false,
	allowBots: false,
	botsOnly: false,
	allowSelf: false,
	run: async (message, context) => {
		const arg = Number(message.content.slice(context.argsOffset).trim());
		if (!arg) {
			await message.reply('missing message ID.');
			return;
		}
		const messages = await message.channel.fetchMessages({after: arg - 1, limit: 100});
		const links = messages.array().filter(e => e.author.bot).reverse().map((e, i) => `${i + 1} (${e.embeds[0].url})`).join('\n');
		await message.channel.send(`\`\`\`\n${links}\n\`\`\``);
	},
};
