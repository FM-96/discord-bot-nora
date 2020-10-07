const yargsParser = require('yargs-parser');

const commandHandler = require('command-handler');

module.exports = {
	command: 'prefix',
	description: 'Manage the prefixes for this guild',
	usage: '[command]',
	ownerOnly: false,
	inDms: false,
	run: async (message, context) => {
		const argv = yargsParser(message.content.slice((context.prefix + context.command).length).trim().replace(/\n/g, ' '), {
			alias: {
				add: ['a'],
				clear: ['c'],
				get: ['g', 'show'],
				set: ['s'],
			},
			array: [
				'add',
				'set',
			],
			boolean: [
				'clear',
				'get',
			],
			configuration: {
				'parse-numbers': false,
				'duplicate-arguments-array': false,
			},
		});

		const argNum = Boolean(argv.add) + argv.clear + argv.get + Boolean(argv.set);
		if (argNum > 1) {
			return message.channel.send('The `add`, `clear`, `get` and `set` arguments are mutually exclusive.');
		} else if (argNum === 0) {
			return message.channel.send('One of `add`, `clear`, `get` or `set` must be present.');
		}

		try {
			let currentPrefixes;
			if (argv.add) {
				const oldPrefixes = commandHandler.getGuildPrefixes(message.guild.id);
				oldPrefixes.push(...argv.add);
				currentPrefixes = commandHandler.setGuildPrefixes(message.guild.id, oldPrefixes);
			} else if (argv.clear) {
				currentPrefixes = commandHandler.setGuildPrefixes(message.guild.id, null);
			} else if (argv.get) {
				currentPrefixes = commandHandler.getGuildPrefixes(message.guild.id);
			} else if (argv.set) {
				currentPrefixes = commandHandler.setGuildPrefixes(message.guild.id, argv.set);
			}
			return message.channel.send(`There ${currentPrefixes.length === 1 ? 'is 1 prefix' : `are ${currentPrefixes.length} prefixes`} for this guild${currentPrefixes.length === 0 ? '.' : ':\n'}${currentPrefixes.map(e => '• ' + e).join('\n')}`);
		} catch (err) {
			return message.channel.send(`There has been an error: ${err.message}`);
		}
	},
};
