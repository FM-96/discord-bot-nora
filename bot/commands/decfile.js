const base65536 = require('base65536');

module.exports = {
	command: 'decfile',
	ownerOnly: false,
	run: async (message, context) => {
		// TODO also allow encoded file as attachment
		// TODO test
		const encodedFile = message.content.split(' ').slice(1).join(' ');
		let decodedFile;
		try {
			decodedFile = base65536.decode(encodedFile);
			return message.channel.send({files: [{attachment: decodedFile}]});
		} catch (err) {
			return message.channel.send(`Could not decode file: ${err.message}`);
		}
	},
};
