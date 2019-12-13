const mongoose = require('mongoose');

const schema = mongoose.Schema({
	discordChannelId: String,
	discordChannelName: String,
	discordServerName: String,
	trigger: {
		_id: false,
		discordUserId: String,
		discordUserName: String,
		statusUrl: String,
		showName: String,
		startWatched: Number,
		startTotal: Number,
		currentWatched: Number,
		currentTotal: Number,
	},
	triggered: {
		_id: false,
		discordUserId: String,
		discordUserName: String,
		statusUrl: String,
		showName: String,
		startWatched: Number,
		startTotal: Number,
		currentWatched: Number,
		currentTotal: Number,
	},
});

module.exports = mongoose.model('Showpact', schema, 'showpacts');
