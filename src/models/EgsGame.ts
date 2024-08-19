const mongoose = require('mongoose');

const schema = mongoose.Schema({
	gameId: String,
});

module.exports = mongoose.model('EgsGame', schema, 'egsgames');
