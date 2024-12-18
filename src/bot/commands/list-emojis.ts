import type { Command } from 'command-handler';
import type { Guild } from 'discord.js';
import EMOJI_LIMITS from '../../constants/emojiLimits';

const command: Command = {
	command: 'list-emojis',
	aliases: [],
	description: 'List all custom emojis of the server.',
	usage: '',
	ownerOnly: false,
	adminOnly: false,
	modOnly: false,
	inGuilds: true,
	inDms: false,
	allowBots: false,
	botsOnly: false,
	allowSelf: false,
	run: async (message, _context) => {
		const placeholder = message.client.emojis.cache.get(process.env.PLACEHOLDER_EMOJI as string);
		const locked = message.client.emojis.cache.get(process.env.LOCKED_EMOJI as string);

		const maxEmojis =
			EMOJI_LIMITS[String((message.guild as Guild).premiumTier) as '0' | '1' | '2' | '3'];

		const guildEmojis = (message.guild as Guild).emojis.cache.filter((e) => !e.animated);
		const guildAniEmojis = (message.guild as Guild).emojis.cache.filter((e) => e.animated);

		const emojis = guildEmojis
			.array()
			.map((e) => (e.available ? e : locked))
			.concat(new Array(Math.max(maxEmojis - guildEmojis.size, 0)).fill(placeholder))
			.map((e) => String(e));
		const aniEmojis = guildAniEmojis
			.array()
			.map((e) => (e.available ? e : locked))
			.concat(new Array(Math.max(maxEmojis - guildAniEmojis.size, 0)).fill(placeholder))
			.map((e) => String(e));

		await message.channel.send(`__**Emojis**__\n${guildEmojis.size}/${maxEmojis} used`);
		for (let i = 0; i < emojis.length; i += 20) {
			await message.channel.send(
				`${emojis.slice(i, i + 10).join('')}\n${emojis.slice(i + 10, i + 20).join('')}`,
			);
		}

		await message.channel.send(`__**Animated Emojis**__\n${guildAniEmojis.size}/${maxEmojis} used`);
		for (let i = 0; i < aniEmojis.length; i += 20) {
			await message.channel.send(
				`${aniEmojis.slice(i, i + 10).join('')}\n${aniEmojis.slice(i + 10, i + 20).join('')}`,
			);
		}
	},
};

export default command;
