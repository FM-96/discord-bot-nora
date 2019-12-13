const randomAnimal = require('../randomAnimal.js');

module.exports = {
	command: 'cat',
	description: 'Post a random picture of a cat',
	usage: '',
	ownerOnly: false,
	run: async (message, context) => {
		const catImage = await randomAnimal('cat');
		return message.channel.send({files: [catImage]});
	},
};
