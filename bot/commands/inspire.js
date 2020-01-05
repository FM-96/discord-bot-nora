const got = require('got');

module.exports = {
	command: 'inspire',
	aliases: [],
	description: null,
	usage: null,
	ownerOnly: false,
	adminOnly: false,
	inGuilds: true,
	inDms: true,
	allowBots: false,
	botsOnly: false,
	allowSelf: false,
	run: async (message, context) => {
		const res = await got('http://inspirobot.me/api?generate=true');
		const imgUrl = res.body;
		await message.channel.send({files: [imgUrl]});
	},
};
