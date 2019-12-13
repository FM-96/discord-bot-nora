const web = require('../../webserver.js');

module.exports = (messages) => {
	const messagesArray = messages.array();
	for (const message of messagesArray) {
		const socketMessage = {
			id: message.id,
		};
		web.io.emit('messageDelete', socketMessage);
	}
};
