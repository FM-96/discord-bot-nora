const purges = require('../purges.js');

module.exports = {
	command: 'nopurge',
	description: 'Stop a scheduled purge',
	usage: '',
	ownerOnly: true,
	run: async (message, context) => {
		await message.delete();
		if (purges[message.channel.id]) {
			clearTimeout(purges[message.channel.id]);
			delete purges[message.channel.id];
			return message.channel.send(`Purge aborted.`);
		} else {
			return message.channel.send(`Well... there wasn't any purge for this channel scheduled anyway, but okay. I won't purge this channel.`);
		}
	},
};
