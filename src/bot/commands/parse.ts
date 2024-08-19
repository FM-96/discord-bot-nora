const yargsParser = require('yargs-parser');

module.exports = {
	command: 'parse',
	aliases: [
		'yargsTest',
	],
	ownerOnly: false,
	run: async (message, context) => {
		const argv = yargsParser(message.content.split(' ').slice(1).join(' '));

		await message.channel.send('```json\n' + JSON.stringify(argv, null, '\t') + '\n```');
	},
};
