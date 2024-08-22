import type { Command } from 'command-handler';
import got from 'got';

const command: Command = {
	command: 'inspire',
	aliases: [],
	description: undefined,
	usage: undefined,
	ownerOnly: false,
	adminOnly: false,
	inGuilds: true,
	inDms: true,
	allowBots: false,
	botsOnly: false,
	allowSelf: false,
	run: async (message, _context) => {
		const res = await got('http://inspirobot.me/api?generate=true');
		const imgUrl = res.body;
		await message.channel.send({ files: [imgUrl] });
	},
};

export default command;
