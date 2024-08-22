import type { Client, ClientUser, Presence } from 'discord.js';

export default (oldPresence: Presence, newPresence: Presence) => {
	// FIXME often doesn't work properly
	// @ts-ignore
	// TODO this is a bug in discord.js typings; remove when fixed
	const client: Client = oldPresence.client;
	if (
		oldPresence.userID === process.env.OWNER_ID &&
		(!oldPresence.activities[0] ||
			!newPresence.activities[0] ||
			oldPresence.activities[0].name !== newPresence.activities[0].name)
	) {
		if (!newPresence.activities.length) {
			(client.user as ClientUser).setActivity(undefined).catch(console.error);
		} else {
			(client.user as ClientUser).setActivity(newPresence.activities[0].name).catch(console.error);
		}
	}
};
