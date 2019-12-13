const client = require('../client.js');

module.exports = {
	command: 'logout',
	ownerOnly: true,
	run: async (message, context) => {
		await message.channel.send('Logging out...');
		await client.logout();
	},
};
