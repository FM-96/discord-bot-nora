const childProcess = require('child_process');

const userId = require('../../config/user_ids.js');

module.exports = {
	disabled: true,
	name: 'botRestart',
	limited: true,
	allowBots: true,
	test: async (message) => message.author.id === '216179498683596802' && message.content.match(/^Hey <@103255776218345472>, your bot <@([0-9]+)> has just gone offline!$/),
	run: async (message, context) => {
		const offlineBotId = message.content.match(/^Hey <@103255776218345472>, your bot <@([0-9]+)> has just gone offline!$/)[1];
		if (offlineBotId === '297501630847385601' || offlineBotId === '357824591118204940') { // DJ Pon-3, Prodromos
			message.channel.send('Oh... I can\'t do anything about that... <@' + userId.fm96 + '>, help!').catch(
				function (err) {
					console.error('Error while calling for help with restarting Java bot: ' + err);
				}
			);
		} else {
			message.channel.send('Thank you for notifying me, I\'ll see if I can fix that.').then(
				function (res) {
					const offlineBotName = message.client.users.get(offlineBotId).username;
					childProcess.exec('pm2 restart "' + offlineBotName + '"', function (error, stdout, stderr) {
						if (error) {
							return Promise.reject(error);
						}

						// FIXME this check doesn't actually seem to work
						if (stdout.includes('[PM2] [' + offlineBotName + '](1) ✓')) {
							return;
						} else {
							return Promise.reject(new Error('No success in stdout'));
						}
					});
				}
			).catch(
				function (err) {
					console.error('Error while trying to restart other bot: ' + err);
				}
			);
		}
	},
};
