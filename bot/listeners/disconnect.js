const client = require('../client.js');

module.exports = (closeEvent) => {
	console.log('Disconnected, attempting to reconnect');
	client.resetClient().then(
		function (result) {
			return client.instance.channels.get('133750021861408768').send('Disconnected and reconnected.'); // Robotest#general
		}
	).catch(
		function (err) {
			console.error('Error while trying to reconnect:');
			console.error(err);
		}
	);
};
