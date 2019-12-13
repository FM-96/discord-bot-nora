module.exports = {
	command: 'tts',
	ownerOnly: false,
	run: async (message, context) => {
		const argText = message.content.substring(context.prefix.length + context.command.length).trim();
		return message.channel.send(argText, {tts: true});
	},
};
