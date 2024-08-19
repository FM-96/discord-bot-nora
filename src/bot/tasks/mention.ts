const botVersion = require('../../package.json').version + (process.env.NODE_ENV === 'development' ? '-dev' : ''); // eslint-disable-line global-require

module.exports = {
	name: 'X-mention',
	limited: true,
	test: async (message) => message.mentions.has(message.client.user.id),
	run: async (message, context) => {
		if (message.content.toLowerCase().includes('version')) {
			return message.channel.send('v' + botVersion);
		} else {
			return message.channel.send('Yo.');
		}
	},
};
