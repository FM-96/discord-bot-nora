module.exports = (oldPresence, newPresence) => {
	// FIXME often doesn't work properly
	const client = oldPresence.client;
	if (oldPresence.userID === process.env.OWNER_ID && (!oldPresence.activities[0] || !newPresence.activities[0] || oldPresence.activities[0].name !== newPresence.activities[0].name)) {
		if (!newPresence.activities.length) {
			client.user.setActivity(null).catch(console.error);
		} else {
			client.user.setActivity(newPresence.activities[0].name).catch(console.error);
		}
	}
};
