const CleverbotIo = require('./cleverbotIoClass.js');

const cleverbotInstances = new Map();

const API_USER = process.env.CLEVERBOTIO_API_USER;
const API_KEY = process.env.CLEVERBOTIO_API_KEY;

module.exports = {
	ask,
};

async function ask(message) {
	const instance = await getInstance(message.channel.id);
	const sanitizedText = sanitizeMessageText(message);
	return instance.ask(sanitizedText);
}

async function getInstance(channelId) {
	if (!cleverbotInstances.has(channelId)) {
		// TODO make instance expire
		// no instance for this channel at all
		const instanceData = {
			instance: new CleverbotIo(API_USER, API_KEY),
		};
		instanceData.nick = await instanceData.instance.create();
		cleverbotInstances.set(channelId, instanceData);
		return instanceData.instance;
	} else if (cleverbotInstances.get(channelId).instance !== null) {
		// TODO make instance expire
		// instance for this channel has expired; make a new one
		const instanceData = cleverbotInstances.get(channelId);
		instanceData.instance = new CleverbotIo(API_USER, API_KEY, instanceData.nick);
		await instanceData.instance.create();
		cleverbotInstances.set(channelId, instanceData);
		return instanceData.instance;
	} else {
		// TODO reset instance expiration counter
		// instance for this channel is available
		return cleverbotInstances.get(channelId).instance;
	}
}

function sanitizeMessageText(message) {
	// TODO
	let sanitizedText;
	if (message.content.startsWith(message.client.user.toString())) {
		sanitizedText = message.cleanContent.slice(message.client.user.username.length + 1).trim();
	} else {
		sanitizedText = message.cleanContent;
	}

	return sanitizedText;
}
