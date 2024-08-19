module.exports = {
	name: 'gay',
	limited: false,
	allowBots: true,
	allowSelf: true,
	test: async (message) => message.content.match(/\bgay\b/i),
	run: async (message, context) => message.react('🏳️‍🌈'),
};
