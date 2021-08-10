const path = require('path');

const commandHandler = require('command-handler');

commandHandler.setOwnerId(process.env.OWNER_ID);
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
