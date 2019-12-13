const path = require('path');

const client = require('../client.js');
const commandHandler = require('../command-handler.js');
const web = require('../../webserver.js');

const userId = require('../../config/user_ids.js');

// const botVersion = process.env.npm_package_version ? process.env.npm_package_version : require('../../package.json').version;

commandHandler.setOwnerId(userId.fm96);
commandHandler.setGlobalPrefixes('§');

// register commands
try {
	const registerResults = commandHandler.registerCommandsFolder(path.join(__dirname, '..', 'commands'));
	console.log(`${registerResults.registered} commands registered`);
	console.log(`${registerResults.disabled} commands disabled`);
} catch (err) {
	console.error('Error while registering commands:');
	console.error(err);
	process.exit(1);
}

// register tasks
try {
	const registerResults = commandHandler.registerTasksFolder(path.join(__dirname, '..', 'tasks'));
	console.log(`${registerResults.registered} tasks registered`);
	console.log(`${registerResults.disabled} tasks disabled`);
} catch (err) {
	console.error('Error while registering tasks:');
	console.error(err);
	process.exit(1);
}

module.exports = async (message) => {
	if (message.channel.type !== 'text') {
		return;
	}

	// TODO convert to task (requires "message.author.id === client.instance.user.id" check as command permission; update: I have that now, so do it!)
	if (message.guild.id !== '133750021861408768') {
		const socketMessage = {
			id: message.id,
			author: message.author.username,
			authorBot: message.author.bot,
			authorSelf: (message.author.id === client.instance.user.id),
			channel: message.channel.name,
			server: message.guild.name,
			content: message.cleanContent,
		};
		web.io.emit('message', socketMessage);
	}

	// explicit commands
	let commandMatch = false;
	try {
		const commandResults = await commandHandler.checkCommand(message);
		commandMatch = commandResults.match;
	} catch (err) {
		console.error('Error while checking commands:');
		console.error(err);
	}

	// tasks (i.e. context commmands)
	try {
		await commandHandler.checkTasks(message, commandMatch);
	} catch (err) {
		console.error('Error while checking tasks:');
		console.error(err);
	}
};
