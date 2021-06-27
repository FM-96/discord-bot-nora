module.exports.addPoll = addPoll;
module.exports.deletePoll = deletePoll;
module.exports.processAllPolls = processAllPolls;
module.exports.removePoll = removePoll;

const cheerio = require('cheerio');

const http = require('http');

const client = require('../client.js');
const Strawpoll = require('./strawpoll.model.js');

function addPoll(pollId, channelId) {
	// TODO add support for multiple channels per poll
	return Strawpoll.findOne({pollId: pollId}).exec().then(
		function (poll) {
			if (poll) {
				if (poll.channels.includes(channelId)) {
					// this poll is already added to this channel
					return false;
				} else {
					poll.channels.push(channelId);
					return scanPoll(poll);
				}
			} else {
				const newPoll = new Strawpoll();
				newPoll.pollId = pollId;
				newPoll.channelId = channelId;
				return scanPoll(newPoll);
			}
		}
	).then(
		function (poll) {
			if (poll === false) {
				// this poll is already added to this channel
				return false;
			}
			return poll.save();
		}
	).then(
		function (savedPoll) {
			const channel = client.channels.cache.get(channelId);

			if (savedPoll === false) {
				// this poll is already added to this channel
				return channel.send('This poll is already added to this channel.');
			} else {
				let message = 'Initial scan of poll #' + savedPoll.pollId + ': ' + savedPoll.pollQuestion + '\n';
				message += 'Scan done at ' + savedPoll.pollResults[0].scanDate.toISOString().slice(0, -5) + 'Z\n';
				for (const option of savedPoll.pollResults[0].options) {
					message += option.text + ': ' + option.count + ' votes (' + (Math.round(option.count / savedPoll.pollResults[0].totalVotes * 10000) / 100) + '%)\n';
				}
				return channel.send('```\n' + message + '\n```');
			}
		}
	);
}

function deletePoll(pollId, channelId) {
	return removePoll(pollId, channelId).then(
		function (res) {
			return Strawpoll.remove({pollId: pollId, channels: {$size: 0}}).exec();
		}
	);
}

function processAllPolls() {
	return Strawpoll.find({}).exec().then(
		function (docs) {
			if (docs.length) {
				const allPolls = [];
				for (const poll of docs) {
					allPolls.push(scanPoll(poll));
				}
				return Promise.all(allPolls);
			} else {
				// there are no polls to do things with
				return false;
			}
		}
	).then(
		function (rescannedPolls) {
			if (rescannedPolls === false) {
				// there are no polls to do things with
				return false;
			}
			const allPolls = [];
			for (const poll of rescannedPolls) {
				allPolls.push(poll.save());
			}
			return Promise.all(allPolls);
		}
	).then(
		function (savedPolls) {
			if (savedPolls === false) {
				// there are no polls to do things with
				return false;
			}
			const allMessages = [];
			for (const poll of savedPolls) {
				const oldResult = poll.pollResults[poll.pollResults.length - 2];
				const newResult = poll.pollResults[poll.pollResults.length - 1];

				let message = 'Update for poll #' + poll.pollId + ': ' + poll.pollQuestion + '\n';
				message += 'Update done at  ' + newResult.scanDate.toISOString().slice(0, -5) + 'Z\n';
				message += 'Last update was ' + oldResult.scanDate.toISOString().slice(0, -5) + 'Z\n';
				for (let i = 0; i < newResult.options.length; ++i) {
					const optionOld = oldResult.options[i];
					const optionNew = newResult.options[i];
					const percentageOld = Math.round(optionOld.count / oldResult.totalVotes * 10000) / 100;
					const percentageNew = Math.round(optionNew.count / newResult.totalVotes * 10000) / 100;
					let percentageDifference = String(Math.round((percentageNew - percentageOld) * 100) / 100);
					if (!percentageDifference.startsWith('-')) {
						percentageDifference = '+' + percentageDifference;
					}
					message += optionNew.text + ': ' + optionNew.count + ' votes [+' + (optionNew.count - optionOld.count) + '] (' + percentageNew + '% [' + percentageDifference + '%])\n';
				}
				for (const channelId of poll.channels) {
					const channel = client.channels.cache.get(channelId);
					allMessages.push(channel.send('```\n' + message + '\n```'));
				}
			}
			return allMessages;
		}
	).catch(
		function (err) {
			console.error(err);
		}
	);
}

function removePoll(pollId, channelId) {
	return Strawpoll.findOneAndUpdate({pollId: pollId}, {$pull: {channels: channelId}}).exec();
}

function scanPoll(poll) {
	// returns a pollResult, essentially
	return new Promise(function (resolve, reject) {
		http.request({
			hostname: 'www.strawpoll.me',
			path: '/' + poll.pollId + '/r?cookieTest=1',
		}, function (response) {
			let responseData = '';

			response.on('data', function (data) {
				responseData += data;
			});

			response.on('end', function () {
				resolve(responseData);
			});
		}).end();
	}).then(
		function (pollData) {
			const $ = cheerio.load(pollData);
			poll.pollQuestion = $('#result-list > h1').text().trim();
			const result = {
				scanDate: new Date(),
				totalVotes: $('#vote-count').text(),
				options: [],
			};
			$('.sp-option').each(function (i, elem) {
				const option = {};
				option.count = $(this).find('.option-count').text().trim();
				$(this).find('.option-count').remove();
				option.text = $(this).find('.option-text').text().trim();
				result.options.push(option);
			});
			poll.pollResults.push(result);
			return poll;
		}
	);
}
