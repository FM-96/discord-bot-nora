import { type Command, getGuildPrefixes, setGuildPrefixes } from 'command-handler';
import type { Guild } from 'discord.js';
import yargsParser from 'yargs-parser';

const command: Command = {
	command: 'prefix',
	aliases: [],
	description: 'Manage the prefixes for this guild',
	usage: '[command]',
	ownerOnly: false,
	inDms: false,
	run: async (message, context) => {
		const argv = yargsParser(
			message.content
				.slice((context.prefix + context.command).length)
				.trim()
				.replace(/\n/g, ' '),
			{
				alias: {
					add: ['a'],
					clear: ['c'],
					get: ['g', 'show'],
					set: ['s'],
				},
				array: ['add', 'set'],
				boolean: ['clear', 'get'],
				configuration: {
					'parse-numbers': false,
					'duplicate-arguments-array': false,
				},
			},
		);

		const argNum = Boolean(argv.add) + argv.clear + argv.get + Boolean(argv.set);
		if (argNum > 1) {
			await message.channel.send(
				'The `add`, `clear`, `get` and `set` arguments are mutually exclusive.',
			);
			return;
		}
		if (argNum === 0) {
			await message.channel.send('One of `add`, `clear`, `get` or `set` must be present.');
			return;
		}

		try {
			let currentPrefixes: string[] = [];
			if (argv.add) {
				const oldPrefixes = getGuildPrefixes((message.guild as Guild).id);
				oldPrefixes.push(...argv.add);
				currentPrefixes = setGuildPrefixes((message.guild as Guild).id, oldPrefixes);
			} else if (argv.clear) {
				currentPrefixes = setGuildPrefixes((message.guild as Guild).id, []);
			} else if (argv.get) {
				currentPrefixes = getGuildPrefixes((message.guild as Guild).id);
			} else if (argv.set) {
				currentPrefixes = setGuildPrefixes((message.guild as Guild).id, argv.set);
			}
			await message.channel.send(
				`There ${currentPrefixes.length === 1 ? 'is 1 prefix' : `are ${currentPrefixes.length} prefixes`} for this guild${currentPrefixes.length === 0 ? '.' : ':\n'}${currentPrefixes.map((e) => `• ${e}`).join('\n')}`,
			);
		} catch (err) {
			await message.channel.send(
				`There has been an error: ${err instanceof Error ? err.message : err}`,
			);
		}
	},
};

export default command;
