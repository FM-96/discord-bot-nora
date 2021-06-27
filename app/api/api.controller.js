module.exports.changePlaying = changePlaying;
module.exports.postMessage = postMessage;
module.exports.reconnect = reconnect;
module.exports.restart = restart;

const client = require('../../bot/client.js');

function changePlaying(req, res) {
	if (req.body.playing) {
		client.instance.user.setActivity(req.body.playing);
	} else {
		client.instance.user.setActivity(null);
	}
	res.status(204).send();
}

function postMessage(req, res) {
	if (req.body.channel && req.body.message) {
		const sendChannel = client.instance.channels.cache.get(req.body.channel);
		if (sendChannel) {
			sendChannel.send(req.body.message).catch(function (error) {
				console.error(error);
			});
		}
	}
	res.status(204).send();
}

function reconnect(req, res) {
	client.resetClient().then(
		result => {
			res.sendStatus(204);
		}
	).catch(
		error => {
			res.status(500).send(error);
		}
	);
}

function restart(req, res) {
	console.log('Restarted via web interface');
	res.sendStatus(204);
	process.exit(2);
}
