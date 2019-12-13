const userId = require('../../config/user_ids.js');

module.exports = (oldMember, newMember) => {
	// FIXME often doesn't work properly
	const client = oldMember.client;
	if (oldMember.id === userId.fm96 && (oldMember.presence.game === null || newMember.presence.game === null || oldMember.presence.game.name !== newMember.presence.game.name)) {
		if (newMember.presence.game === null) {
			client.user.setActivity(null).catch(console.error);
		} else {
			client.user.setActivity(newMember.presence.game.name).catch(console.error);
		}
	}
};
