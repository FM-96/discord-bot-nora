const Discord = require('discord.js');

const fs = require('fs');
const path = require('path');

const globalStorage = require('./globalStorage.js');

module.exports = {
	instance: null,
	logout,
	resetClient,
};

// initial login
resetClient().catch(err => {
	console.error('Error while logging in:');
	console.error(err);
	process.exit(1);
});

function attachListeners(client) {
	try {
		const listeners = fs.readdirSync(path.join(__dirname, 'listeners'));
		for (const listener of listeners) {
			const eventName = listener.slice(0, listener.length - 3); // 3 = '.js'
			client.on(eventName, require('./listeners/' + listener)); // eslint-disable-line global-require
		}
	} catch (err) {
		console.error('Error while attaching listeners:');
		console.error(err);
		process.exit(1);
	}
}

async function logout() {
	// destroy old client
	if (module.exports.instance) {
		const client = module.exports.instance;
		module.exports.instance = undefined;
		// remove all listeners to prevent the disconnect event from firing and *also* logging the bot back in
		client.removeAllListeners();
		await client.destroy();
	}
}

async function resetClient() {
	// destroy old client
	if (module.exports.instance) {
		// remove all listeners to prevent the disconnect event from firing and *also* logging the bot back in
		module.exports.instance.removeAllListeners();
		await module.exports.instance.destroy();
	}

	// create new client
	module.exports.instance = new Discord.Client();
	attachListeners(module.exports.instance);

	// log in
	await module.exports.instance.login(process.env.BOT_TOKEN);
	globalStorage.set('loginTime', Date.now());

	console.log('Successfully logged in');
}
