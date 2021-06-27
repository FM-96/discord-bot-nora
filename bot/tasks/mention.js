// const cleverbotIoManager = require('../cleverbotIoManager.js');

module.exports = {
	name: 'X-mention',
	limited: true,
	test: async (message) => message.mentions.has(message.client.user.id),
	run: async (message, context) => {
		// if (message.content.toLowerCase().includes('version')) {
		// 	message.channel.send('v' + botVersion);
		// } else {
		// 	message.channel.send('Yo.');
		// }

		// cleverbotIoManager.ask(message).then(response =>
		// 	message.channel.send(response)
		// ).catch(console.error);
	},
};
