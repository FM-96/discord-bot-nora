module.exports = {
	name: 'schrampft',
	limited: false,
	allowBots: true,
	test: async (message) => message.author.id === '235081753260326912',
	run: async (message, context) => {
		const reactions = ['👌', '👍', '❤'];
		return message.react(reactions[Math.floor(Math.random() * reactions.length)]);
	},
};
