const base65536 = require('base65536');

module.exports = {
	command: 'dectext',
	ownerOnly: false,
	run: async (message, context) => {
		// TODO also allow encoded text as attachment
		const encodedText = message.content.split(' ').slice(1).join(' ');
		let decodedText;
		try {
			decodedText = base65536.decode(encodedText).toString();
			return message.channel.send(decodedText);
		} catch (err) {
			return message.channel.send(`Could not decode text: ${err.message}`);
		}
	},
};
