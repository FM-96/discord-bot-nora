const client = require('../client.js');

module.exports = (member) => {
	if (member.guild.id === '138404620128092160' && member.id === '197553759151194112') {
		client.instance.channels.cache.get('138404620128092160').send('Great news, <@103255776218345472>! Pancake is back!').then(
			function (sentMessage) {
				return client.instance.channels.cache.get('138404620128092160').send('!friendship');
			}
		).then(
			function (sentMessage) {
				if (sentMessage.guild.members.cache.get('197553759151194112').presence.status === 'offline') {
					return client.instance.channels.cache.get('138404620128092160').send('... Aww. She\'s offline. :cry:');
				}
			}
		).catch(function (err) {
			console.error(err);
		});
	}
};
