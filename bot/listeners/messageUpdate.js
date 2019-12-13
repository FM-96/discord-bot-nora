const web = require('../../webserver.js');

module.exports = (oldMessage, newMessage) => {
	if (oldMessage.content !== newMessage.content) {
		const socketMessage = {
			id: newMessage.id,
			content: newMessage.cleanContent,
		};
		web.io.emit('messageUpdate', socketMessage);
	}
};
