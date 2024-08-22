import fs from 'node:fs';
import path from 'node:path';
import { Client, Intents } from 'discord.js';
import globalStorage from './globalStorage';

interface InstanceData {
	instance?: Client;
	logout: typeof logout;
	resetClient: typeof resetClient;
}

const instanceData: InstanceData = {
	instance: undefined,
	logout,
	resetClient,
};

// initial login
resetClient().catch((err) => {
	console.error('Error while logging in:');
	console.error(err);
	process.exit(1);
});

function attachListeners(client: Client) {
	try {
		const listeners = fs.readdirSync(path.join(__dirname, 'listeners'));
		for (const listener of listeners) {
			const eventName = listener.slice(0, listener.length - 3); // 3 = '.ts'
			client.on(eventName, require(`./listeners/${listener}`).default);
		}
	} catch (err) {
		console.error('Error while attaching listeners:');
		console.error(err);
		process.exit(1);
	}
}

function logout() {
	// destroy old client
	if (instanceData.instance) {
		const client = instanceData.instance;
		instanceData.instance = undefined;
		// remove all listeners to prevent the disconnect event from firing and *also* logging the bot back in
		client.removeAllListeners();
		client.destroy();
	}
}

async function resetClient() {
	// destroy old client
	if (instanceData.instance) {
		// remove all listeners to prevent the disconnect event from firing and *also* logging the bot back in
		instanceData.instance.removeAllListeners();
		instanceData.instance.destroy();
	}

	// create new client
	instanceData.instance = new Client({
		ws: {
			intents: Intents.ALL,
		},
	});
	attachListeners(instanceData.instance);

	// log in
	await instanceData.instance.login(process.env.BOT_TOKEN);
	globalStorage.set('loginTime', Date.now());

	console.log('Successfully logged in');
}

export default instanceData;
