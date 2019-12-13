const Discord = require('discord.js');

const fs = require('fs');
const path = require('path');

const iamthesenate = require('../iamthesenate.js');

const userId = require('../../config/user_ids.js');

let senate = [];
const senateFilePath = path.join(__dirname, '..', '..', 'senate.json');
if (fileExists(senateFilePath)) {
	senate = JSON.parse(fs.readFileSync(senateFilePath));
}

module.exports = (messageReaction, user) => {
	if (iamthesenate.isActive() && user.id === userId.fm96 && messageReaction.message.guild) {
		console.log('Calling in ' + senate.length + ' members of the senate');
		const senateClients = [];
		const senateLogins = [];
		for (const bot of senate) {
			if (/* bot.id !== client.instance.user.id && */messageReaction.message.channel.members.get(bot.id)) {
				const senateClient = new Discord.Client();
				senateClients.push(senateClient);
				senateLogins.push(senateClient.login(bot.token));
			}
		}
		console.log(senateClients.length + ' members available');
		Promise.all(senateLogins).then(
			function (result) {
				console.log('Starting vote manipulation');
				for (const senateClient of senateClients) {
					senateClient.channels.get(messageReaction.message.channel.id).fetchMessage(messageReaction.message.id).then(
						function (message) {
							console.log('Voting...');
							message.react(messageReaction.emoji).then(
								function (res) {
									console.log('Successfully voted');
								}
							).catch(
								function (err) {
									console.error('Error while voting: ' + err);
								}
							);
						}
					);
				}
			}
		).catch(
			function (err) {
				console.error('Could not call in senate: ' + err);
			}
		);/*
		.then(
			function (res) {
				for (var bot of senateClients) {
					bot.destroy();
				}
			}
		);
		*/
	}
};

function fileExists(filePath) {
	try {
		fs.statSync(filePath);
		return true;
	} catch (e) {
		return false;
	}
}
