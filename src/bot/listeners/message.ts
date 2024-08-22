import path from 'node:path';
import {
	checkCommand,
	checkTasks,
	registerCommandsFolder,
	registerTasksFolder,
	setGlobalPrefixes,
	setOwnerId,
} from 'command-handler';
import type { Message } from 'discord.js';

setOwnerId(process.env.OWNER_ID as string);
setGlobalPrefixes('§');

// register commands
try {
	const registerResults = registerCommandsFolder(path.join(__dirname, '..', 'commands'));
	console.log(`${registerResults.registered} commands registered`);
	console.log(`${registerResults.disabled} commands disabled`);
} catch (err) {
	console.error('Error while registering commands:');
	console.error(err);
	process.exit(1);
}

// register tasks
try {
	const registerResults = registerTasksFolder(path.join(__dirname, '..', 'tasks'));
	console.log(`${registerResults.registered} tasks registered`);
	console.log(`${registerResults.disabled} tasks disabled`);
} catch (err) {
	console.error('Error while registering tasks:');
	console.error(err);
	process.exit(1);
}

export default async (message: Message) => {
	if (message.channel.type !== 'text') {
		return;
	}

	// explicit commands
	let commandMatch = false;
	try {
		const commandResults = await checkCommand(message);
		commandMatch = commandResults.match;
	} catch (err) {
		console.error('Error while checking commands:');
		console.error(err);
	}

	// tasks (i.e. context commmands)
	try {
		await checkTasks(message, commandMatch);
	} catch (err) {
		console.error('Error while checking tasks:');
		console.error(err);
	}
};
