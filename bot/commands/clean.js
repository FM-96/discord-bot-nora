module.exports = {
	command: 'clean',
	ownerOnly: false,
	run: async (message, context) => {
		const argText = message.cleanContent.substring(context.prefix.length + context.command.length).trim();
		return message.channel.send('Cleaned message: "' + argText + '"');
	},
};
