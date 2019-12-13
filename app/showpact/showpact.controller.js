module.exports.addPact = addPact;
module.exports.checkForUpdates = checkForUpdates;
module.exports.deletePact = deletePact;
module.exports.list = list;
module.exports.sendReminders = sendReminders;

const http = require('http');
const querystring = require('querystring');

const client = require('../../bot/client.js');
const Showpact = require('./showpact.model.js');

function addPact(req, res) {
	// TODO
	const newPact = new Showpact(req.body);

	// check that the channel and both users are valid
	const channel = client.instance.channels.get(newPact.discordChannelId);
	const triggerUser = client.instance.users.get(newPact.trigger.discordUserId);
	const triggeredUser = client.instance.users.get(newPact.triggered.discordUserId);
	if (!channel || channel.type !== 'text') {
		res.status(400).send('Invalid Channel ID');
		return;
	} else if (!triggerUser) {
		res.status(400).send('Invalid Trigger User ID');
		return;
	} else if (!triggeredUser) {
		res.status(400).send('Invalid Triggered User ID');
		return;
	}
	newPact.discordChannelName = channel.name;
	newPact.discordServerName = channel.guild.name;
	newPact.trigger.discordUserName = triggerUser.username;
	newPact.triggered.discordUserName = triggeredUser.username;

	// make sure the show status URLs end with a dash
	if (!newPact.trigger.statusUrl.endsWith('/')) {
		newPact.trigger.statusUrl += '/';
	}
	if (!newPact.triggered.statusUrl.endsWith('/')) {
		newPact.triggered.statusUrl += '/';
	}

	Promise.all([fetchShowStatus(newPact.trigger.statusUrl, newPact.trigger.showName), fetchShowStatus(newPact.triggered.statusUrl, newPact.triggered.showName)]).then(
		function (result) {
			newPact.trigger.startWatched = result[0].watched;
			newPact.trigger.startTotal = result[0].total;
			newPact.trigger.currentWatched = result[0].watched;
			newPact.trigger.currentTotal = result[0].total;

			newPact.triggered.startWatched = result[1].watched;
			newPact.triggered.startTotal = result[1].total;
			newPact.triggered.currentWatched = result[1].watched;
			newPact.triggered.currentTotal = result[1].total;

			return true;
		}
	).catch(
		function (err) {
			res.status(500).send('Error while processing show status: ' + err);
			return false;
		}
	).then(
		function (result) {
			if (result === false) {
				return false;
			}
			return newPact.save();
		}
	).then(
		function (savedPact) {
			if (savedPact === false) {
				return false;
			}
			res.send(savedPact);
		}
	).catch(
		function (err) {
			res.status(500).send('Error while saving showpact: ' + err);
			return false;
		}
	);
}

function checkForUpdates() {
	Showpact.find({}).exec().then(
		function (docs) {
			const pactUpdates = [];
			for (const pact of docs) {
				pactUpdates.push(updatePact(pact));
			}
			return Promise.all(pactUpdates);
		}
	).then(
		function (pactUpdates) {
			const updateMessages = [];
			for (const pactUpdate of pactUpdates) {
				let message = '';

				if (pactUpdate.changed) {
					// check numbers to see if pact triggers

					// number of unwatched episodes when the pact was created
					const triggerStartUnwatched = pactUpdate.pact.trigger.startTotal - pactUpdate.pact.trigger.startWatched;
					const triggeredStartUnwatched = pactUpdate.pact.triggered.startTotal - pactUpdate.pact.triggered.startWatched;

					// how many episodes trigger needs to watch before triggered needs to watch one
					const triggerAmount = triggerStartUnwatched / triggeredStartUnwatched;

					// delta = difference between start value and current value
					const triggerNewDeltaWatched = pactUpdate.newData.trigger.currentWatched - pactUpdate.pact.trigger.startWatched;
					const triggeredNewDeltaWatched = pactUpdate.newData.triggered.currentWatched - pactUpdate.pact.triggered.startWatched;

					const triggerOldDeltaWatched = pactUpdate.oldData.trigger.currentWatched - pactUpdate.pact.trigger.startWatched;
					const triggeredOldDeltaWatched = pactUpdate.oldData.triggered.currentWatched - pactUpdate.pact.triggered.startWatched;

					// how many episodes (more than the start value) triggered needs to have watched at this point
					const triggeredNewTargetDeltaWatched = Math.floor(triggerNewDeltaWatched / triggerAmount);
					const triggeredOldTargetDeltaWatched = Math.floor(triggerOldDeltaWatched / triggerAmount);

					// how many more episodes triggered now needs to have watched
					const triggeredDeltaTargetDeltaWatched = triggeredNewTargetDeltaWatched - triggeredOldTargetDeltaWatched;

					if (triggeredDeltaTargetDeltaWatched > 0) {
						// trigger has watched enough episodes that triggered needs to watch at least 1 more

						message += '<@' + pactUpdate.pact.triggered.discordUserId + '>, ' + pactUpdate.pact.trigger.discordUserName + ' has watched another `' + (Math.round(triggeredDeltaTargetDeltaWatched * triggerAmount * 100) / 100) + '` episodes of *' + pactUpdate.pact.trigger.showName + '*.\n';

						if (Math.floor(triggerNewDeltaWatched / triggerAmount) > triggeredNewDeltaWatched) {
							// triggered hasn't watched the episodes beforehand
							message += 'Now you need to watch another `' + triggeredDeltaTargetDeltaWatched + '` episodes of *' + pactUpdate.pact.triggered.showName + '*.\n';

							if (triggeredNewDeltaWatched < triggeredOldTargetDeltaWatched) {
								message += 'That means you now need to watch a total of `' + (triggeredNewTargetDeltaWatched - triggeredNewDeltaWatched) + '` more episodes of *' + pactUpdate.pact.triggered.showName + '*.\n';
							} else if (triggeredNewDeltaWatched > triggeredOldTargetDeltaWatched) {
								message += 'However, you have already watched `' + (triggeredNewDeltaWatched - triggeredOldTargetDeltaWatched) + '` of those episodes, so you only need to watch `' + (triggeredNewTargetDeltaWatched - triggeredNewDeltaWatched) + '` more episodes of *' + pactUpdate.pact.triggered.showName + '*.\n';
							}
						} else {
							// triggered has already watched enough episodes beforehand
							message += 'However, you have already watched the next `' + triggeredDeltaTargetDeltaWatched + '` episodes of *' + pactUpdate.pact.triggered.showName + '*, so you don\'t need to watch any more until <@' + pactUpdate.pact.trigger.discordUserId + '> watches more episodes of *' + pactUpdate.pact.trigger.showName + '*.\n';
						}
					} else if (triggeredOldDeltaWatched < triggeredOldTargetDeltaWatched && triggeredNewDeltaWatched >= triggeredNewTargetDeltaWatched) {
						// triggered has caught up
						message += '<@' + pactUpdate.pact.trigger.discordUserId + '>, ' + pactUpdate.pact.triggered.discordUserName + ' has finished watching the required number of episodes of *' + pactUpdate.pact.triggered.showName + '*.\n';
						message += 'Now it\'s your turn again to watch more episodes of *' + pactUpdate.pact.trigger.showName + '*.\n';
					}

					if (message.length > 0) {
						updateMessages.push(client.instance.channels.get(pactUpdate.pact.discordChannelId).sendMessage(message));
					}
				}
			}
			return Promise.all(updateMessages);
		}
	).catch(
		function (err) {
			// error handler stub
			console.error('Showpact update error: ' + err);
		}
	);
}

function deletePact(req, res) {
	Showpact.findByIdAndRemove(req.body._id).exec().then(
		function (result) {
			res.sendStatus(200);
		}
	).catch(
		function (err) {
			// error handler stub
			console.error(err);
			res.sendStatus(500);
		}
	);
}

function fetchShowStatus(statusUrl, showName) {
	return new Promise(function (resolve, reject) {
		let protocol, port, hostname, path;
		try {
			protocol = statusUrl.split('//')[0];
			port;
			if (protocol === 'http:') {
				port = 80;
			} else if (protocol === 'https:') {
				port = 443;
			}
			hostname = statusUrl.slice(protocol.length + '//'.length).split('/')[0];
			path = statusUrl.slice(protocol.length + '//'.length + hostname.length) + 'edit/editajax.php';
		} catch (ex) {
			reject(new Error('Invalid URL'));
		}

		const requestOptions = {
			protocol: protocol,
			hostname: hostname,
			port: port,
			method: 'POST',
			path: path,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};

		requestShows(requestOptions).then(
			function (shows) {
				let found = false;
				let showId;

				for (const show of shows) {
					if (show.name === showName) {
						found = true;
						showId = show.id;
						break;
					}
				}

				if (!found) {
					throw new Error('Show not found');
				}

				return requestSeasons(requestOptions, showId);
			}
		).then(
			function (seasons) {
				const episodeRequests = [];

				for (const season of seasons) {
					episodeRequests.push(requestEpisodes(requestOptions, season.id));
				}

				return Promise.all(episodeRequests);
			}
		).then(
			function (episodesArray) {
				const resultObj = {
					total: 0,
					watched: 0,
				};

				for (const episodeList of episodesArray) {
					for (const episode of episodeList) {
						if (episode.aired !== '0' && (episode.aired === '1' || Date.parse(episode.aired) < Date.now())) {
							resultObj.total++;

							if (episode.watched === 1 && episode.rewatching === 0) {
								resultObj.watched++;
							}
						}
					}
				}

				resolve(resultObj);
			}
		).catch(
			function (err) {
				reject(err);
			}
		);
	});
}

function list(req, res) {
	Showpact.find({}, {__v: false}).exec().then(
		function (docs) {
			res.send(docs);
		}
	).catch(
		function (err) {
			// error handler stub
			console.error(err);
			res.sendStatus(500);
		}
	);
}

function requestEpisodes(requestOptions, seasonId) {
	return new Promise(function (resolve, reject) {
		const request = http.request(requestOptions, function (response) {
			let responseBody = '';
			response.on('data', function (data) {
				responseBody += data;
			});
			response.on('end', function () {
				let episodesObj;
				try {
					episodesObj = JSON.parse(responseBody);
					resolve(episodesObj);
				} catch (ex) {
					reject(ex);
				}
			});
		});

		request.write(querystring.stringify({
			'getepisodes': seasonId,
		}));

		request.end();
	});
}

function requestSeasons(requestOptions, showId) {
	return new Promise(function (resolve, reject) {
		const request = http.request(requestOptions, function (response) {
			let responseBody = '';
			response.on('data', function (data) {
				responseBody += data;
			});
			response.on('end', function () {
				let seasonsObj;
				try {
					seasonsObj = JSON.parse(responseBody);
					resolve(seasonsObj);
				} catch (ex) {
					reject(ex);
				}
			});
		});

		request.write(querystring.stringify({
			'getseasons': showId,
		}));

		request.end();
	});
}

function requestShows(requestOptions) {
	return new Promise(function (resolve, reject) {
		const request = http.request(requestOptions, function (response) {
			let responseBody = '';
			response.on('data', function (data) {
				responseBody += data;
			});
			response.on('end', function () {
				let showsObj;
				try {
					showsObj = JSON.parse(responseBody);
					resolve(showsObj);
				} catch (ex) {
					reject(ex);
				}
			});
		});

		request.write(querystring.stringify({
			'getshows': true,
		}));

		request.end();
	});
}

function sendReminders() {
	// TODO
	// client.instance.channels.get('268835208512536576').sendMessage('sendReminders');
}

function updatePact(pact) {
	const resultObj = {};

	resultObj.pact = pact;

	resultObj.oldData = {
		trigger: {
			currentWatched: pact.trigger.currentWatched,
			currentTotal: pact.trigger.currentTotal,
		},
		triggered: {
			currentWatched: pact.triggered.currentWatched,
			currentTotal: pact.triggered.currentTotal,
		},
	};

	return Promise.all([fetchShowStatus(pact.trigger.statusUrl, pact.trigger.showName), fetchShowStatus(pact.triggered.statusUrl, pact.triggered.showName)]).then(
		function (result) {
			resultObj.newData = {
				trigger: {
					currentWatched: result[0].watched,
					currentTotal: result[0].total,
				},
				triggered: {
					currentWatched: result[1].watched,
					currentTotal: result[1].total,
				},
			};

			resultObj.changed = false;
			if (resultObj.oldData.trigger.currentWatched !== resultObj.newData.trigger.currentWatched) {
				resultObj.changed = true;
				pact.trigger.currentWatched = resultObj.newData.trigger.currentWatched;
			}
			if (resultObj.oldData.trigger.currentTotal !== resultObj.newData.trigger.currentTotal) {
				resultObj.changed = true;
				pact.trigger.currentTotal = resultObj.newData.trigger.currentTotal;
			}
			if (resultObj.oldData.triggered.currentWatched !== resultObj.newData.triggered.currentWatched) {
				resultObj.changed = true;
				pact.triggered.currentWatched = resultObj.newData.triggered.currentWatched;
			}
			if (resultObj.oldData.triggered.currentTotal !== resultObj.newData.triggered.currentTotal) {
				resultObj.changed = true;
				pact.triggered.currentTotal = resultObj.newData.triggered.currentTotal;
			}

			if (resultObj.changed) {
				return pact.save();
			}
			return true;
		}
	).then(
		function (result) {
			return resultObj;
		}
	);
}
