const base65536 = require('base65536');

const utilityFunctions = require('../../utilityFunctions.js');

module.exports = {
	command: 'encfile',
	ownerOnly: false,
	run: async (message, context) => {
		// TODO also allow links to files
		// TODO test
		if (!message.attachments.size) {
			return message.channel.send('No file found.');
		}
		const buffer = await utilityFunctions.httpRequest(message.attachments.first().proxyURL);
		return message.channel.send(base65536.encode(buffer));
	},
};
