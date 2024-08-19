module.exports = {
	command: 'error',
	description: 'Deliberately throw an error inside the command',
	usage: '',
	ownerOnly: true,
	run: async (message, context) => {
		throw new Error('Deliberately induced error');
	},
};
