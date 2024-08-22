import type { Request, Response } from 'express';
import client from '../../bot/client';

function changePlaying(req: Request, res: Response) {
	if (!client.instance) {
		res.status(500).send('Client not logged in');
		return;
	}
	if (req.body.playing) {
		client.instance.user?.setActivity(req.body.playing);
	} else {
		client.instance.user?.setActivity(undefined);
	}
	res.status(204).send();
}

function postMessage(req: Request, res: Response) {
	if (!client.instance) {
		res.status(500).send('Client not logged in');
		return;
	}
	if (req.body.channel && req.body.message) {
		const sendChannel = client.instance.channels.cache.get(req.body.channel);
		if (sendChannel?.isText()) {
			sendChannel.send(req.body.message).catch((error) => {
				console.error(error);
			});
		}
	}
	res.status(204).send();
}

function reconnect(_req: Request, res: Response) {
	client
		.resetClient()
		.then(() => {
			res.sendStatus(204);
		})
		.catch((error) => {
			res.status(500).send(error);
		});
}

function restart(_req: Request, res: Response) {
	console.log('Restarted via web interface');
	res.sendStatus(204);
	process.exit(2);
}

export default {
	changePlaying,
	postMessage,
	reconnect,
	restart,
};
