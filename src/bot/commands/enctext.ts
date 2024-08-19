const base65536 = require('base65536');

module.exports = {
	command: 'enctext',
	ownerOnly: false,
	run: async (message, context) => {
		// TODO also allow attachments
		const plainText = message.content.split(' ').slice(1).join(' ');
		const encodedText = base65536.encode(Buffer.from(plainText));
		return message.channel.send(encodedText);
	},
};
