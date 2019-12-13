module.exports = {
	disabled: true, // XXX
	name: 'code',
	limited: true,
	test: async (message) => (message.content.match(/```/g) || []).length >= 2 && message.content.match(/```([a-zA-Z])+\n/),
	run: async (message, context) => message.channel.send('Hey, that\'s code! I\'m made of that!'),
};
