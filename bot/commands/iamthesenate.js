const iamthesenate = require('../iamthesenate.js');

module.exports = {
	command: 'iamthesenate',
	ownerOnly: true,
	run: async (message, context) => {
		iamthesenate.activate();
	},
};
