const iamthesenate = require('../iamthesenate.js');

module.exports = {
	command: 'iamnotthesenate',
	ownerOnly: true,
	run: async (message, context) => {
		iamthesenate.deactivate();
	},
};
