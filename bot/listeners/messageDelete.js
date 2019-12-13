const web = require('../../webserver.js');

module.exports = (message) => {
	const socketMessage = {
		id: message.id,
	};
	web.io.emit('messageDelete', socketMessage);
};
