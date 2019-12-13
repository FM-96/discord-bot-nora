module.exports = {
	name: 'pancake',
	limited: false,
	allowBots: true,
	test: async (message) => message.author.id === '197553759151194112',
	run: async (message, context) => message.react('🥞'),
};
