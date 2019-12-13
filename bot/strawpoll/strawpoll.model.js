const mongoose = require('mongoose');

const pollResult = require('./poll-result.schema.js');

const schema = mongoose.Schema({
	pollId: String,
	channels: [String],
	pollQuestion: String,
	pollResults: [pollResult],
});

module.exports = mongoose.model('Strawpoll', schema, 'strawpolls');
