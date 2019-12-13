// TODO store bot token in JSON file
const fs = require('fs');
const path = require('path');

const argv = require('minimist')(process.argv.slice(2));

let botToken = null;
const tokenFile = path.join(__dirname, '..', 'discord_bot_token.txt');
if (argv.token) {
	botToken = argv.token;
} else if (argv.t) {
	botToken = argv.t;
} else {
	// create file if it doesn't exist
	if (!fileExists(tokenFile)) {
		fs.closeSync(fs.openSync(tokenFile, 'w'));
	}
	// read token from file
	botToken = fs.readFileSync(tokenFile, 'utf8');
}
if (!botToken) {
	console.log('No bot token found.');
	console.log('Save the token in discord_bot_token.txt and restart the application.');
	process.exit(0);
} else {
	console.log('Bot token loaded.');
}

module.exports = botToken;

function fileExists(filePath) {
	try {
		fs.statSync(filePath);
		return true;
	} catch (e) {
		return false;
	}
}
