module.exports = {
	cleanup,
	getChannelMessages,
	isProtected,
};

/**
 * Delete a specified number of messages of a certain user
 * @param {*} channel The channel to delete the messages in
 * @param {?String} user The ID of the user who's messages to delete (or null for all users)
 * @param {?Number} number How many messages to delete (or null for all messages)
 * @returns {Promise.<Number>} How many messages have been deleted
 */
async function cleanup(channel, user, number) {
	console.log('cleaning up ' + (number || 'infinite') + ' messages');
	const messages = await getChannelMessages(channel, user, number, null);
	let flatMsgs = messages;
	console.log('got ' + flatMsgs.length + ' messages in total');
	if (flatMsgs.length === 0) {
		return 0;
	} else {
		// remove all messages that have a shield emoji reaction
		flatMsgs = flatMsgs.filter(msg => !isProtected(msg));

		const deleteBulk = [];
		const deleteSingle = [];

		// bulk delete limit is two weeks; I leave 1 hour of leeway here to be safe
		const BULK_DELETE_LIMIT = (1000 * 60 * 60 * 24 * 14) - (1000 * 60 * 60);
		for (const msg of flatMsgs) {
			if (Date.now() - msg.createdTimestamp < BULK_DELETE_LIMIT) {
				deleteBulk.push(msg);
			} else {
				deleteSingle.push(msg);
			}
		}

		// you can't bulkDelete a single message
		if (deleteBulk.length === 1) {
			deleteSingle.push(deleteBulk[0]);
			deleteBulk.length = 0;
		}

		let deletions = Promise.resolve(false);
		let amountDeleted = 0;

		if (deleteBulk.length) {
			for (let i = 0; i <= Math.floor(deleteBulk.length / 100); ++i) {
				// bulkDelete can only delete up to 100 messages at once
				deletions = deletions.then(res => {
					if (res !== false) {
						amountDeleted += res.size;
					}
					return channel.bulkDelete(deleteBulk.slice(i * 100, Math.min((i + 1) * 100, deleteBulk.length)));
				});
			}
			deletions = deletions.then(res => {
				amountDeleted += res.size;
				return false;
			});
		}
		if (deleteSingle.length) {
			for (const msg of deleteSingle) {
				deletions = deletions.then(res => {
					if (res !== false) {
						amountDeleted++;
					}
					return msg.delete();
				});
			}
			deletions = deletions.then(res => {
				amountDeleted++;
				return false;
			});
		}

		deletions = deletions.then(res => amountDeleted);

		return deletions;
	}
}

/**
 * Fetches the specified amount of messages from a specified channel and user
 * @param {*} channel The channel to fetch the messages in
 * @param {?String} user The ID of the user whose messages should be fetched (or null for all users)
 * @param {?Number} amount The number of messages to fetch (or null for all messages)
 * @param {?String} before The ID of the message before which to start (or null to start at the most recent message)
 * @returns {Promise.<Array.<Object>>} An array of all fetched messages
 */
async function getChannelMessages(channel, user, amount, before) {
	console.log('fetching ' + (amount || 'infinite') + ' messages');
	const result = [];
	let lastMessage = before || null;
	let done = false;

	do {
		const options = {limit: 100};
		if (lastMessage !== null) {
			options.before = lastMessage;
		}
		const messages = await channel.messages.fetch(options);
		console.log('got ' + messages.size + ' messages');
		if (messages.size) {
			let correctUser = 0;
			for (const entry of messages) {
				const msg = entry[1];
				if (user === null || msg.author.id === user) {
					correctUser++;
					result.push(msg);
					if (amount !== null && result.length === amount) {
						done = true;
						break; // breaks for loop
					}
				}
			}
			console.log('got ' + correctUser + ' messages by right user');
			lastMessage = messages.lastKey();
		} else {
			console.log('reached end of channel');
			done = true;
		}
	} while (!done);

	return result;
}

/**
 * Returns whether a message is protected from removal
 * @param {Message} message The message to check for protection
 * @returns {Boolean} Whether the message is protected
 */
function isProtected(message) {
	return message.reactions.cache.some(e => e.emoji.name === '🛡' || e.emoji.name === '🛡️'); // these are different code points
}
