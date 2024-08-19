module.exports = {
	name: 'fuckyou',
	limited: true,
	test: async (message) => message.content.toLowerCase().includes('fuck you') && !message.author.bot,
	run: async (message, context) => message.channel.send('Fuck *you*, ' + message.author.username + '! Meatbags like you are nothing but a waste of oxygen.'),
};
