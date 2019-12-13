// TODO test
const strawpoll = require('../strawpoll/strawpoll.js');

module.exports = {
	command: 'strawpoll',
	description: undefined,
	usage: '<"add"|"delete"|"remove"> <poll ID>',
	ownerOnly: false,
	run: async function (message, context) {
		const action = message.content.split(' ')[1];
		const pollId = message.content.split(' ')[2];
		if (action === 'add') {
			return strawpoll.addPoll(pollId, message.channel.id);
		} else if (action === 'delete') {
			return strawpoll.deletePoll(pollId, message.channel.id);
		} else if (action === 'remove') {
			return strawpoll.removePoll(pollId, message.channel.id);
		}
	},
};
