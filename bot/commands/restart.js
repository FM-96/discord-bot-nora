module.exports = {
	command: 'restart',
	ownerOnly: true,
	run: async (message, context) => {
		console.log('Restarted via command');
		process.exit(2);
	},
};
