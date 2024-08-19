module.exports = {
	disabled: true,
	name: 'botRestart',
	limited: true,
	allowBots: true,
	test: async (message) => message.author.id === '216179498683596802' && message.content.match(RegExp(`^Hey <@103255776218345472>, your bot <@!?${message.client.user.id})> has just gone offline!$`)),
	run: async (message, context) => { // eslint-disable-line arrow-body-style
		return message.channel.send('What? No, I\'m not');
	},
};
