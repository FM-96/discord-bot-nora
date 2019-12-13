const randomAnimal = require('../randomAnimal.js');

module.exports = {
	command: 'dog',
	description: 'Post a random picture of a dog',
	usage: '',
	ownerOnly: false,
	run: async (message, context) => {
		const dogImage = await randomAnimal('dog');
		return message.channel.send({files: [dogImage]});
	},
};
