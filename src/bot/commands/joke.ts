const dadJokes = require('../jokes/dadJokes.js');
const mitsukuJokes = require('../jokes/mitsukuJokes.js');

module.exports = {
	command: 'joke',
	description: 'Post a random joke',
	usage: '',
	ownerOnly: false,
	run: async (message, context) => {
		let randomJoke;
		if (Math.random() < 0.7) {
			randomJoke = await dadJokes.getJoke();
		} else {
			randomJoke = await mitsukuJokes.getJoke();
		}
		return message.channel.send(randomJoke);
	},
};
