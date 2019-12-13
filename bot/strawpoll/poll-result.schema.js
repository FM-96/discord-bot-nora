const mongoose = require('mongoose');

const schema = mongoose.Schema({
	_id: false,
	scanDate: Date,
	totalVotes: Number,
	options: [{
		_id: false,
		text: String,
		count: Number,
	}],
});

module.exports = schema;
