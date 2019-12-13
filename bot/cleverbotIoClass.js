const utilityFunctions = require('../utilityFunctions.js');

class CleverbotIo {
	constructor(user, key, nick) {
		if (!user) {
			throw new Error('No API User provided');
		}
		if (!key) {
			throw new Error('No API Key provided');
		}
		this.user = user;
		this.key = key;
		if (nick) {
			this.nick = nick;
		}
	}

	setNick(nick) {
		this.nick = nick;
	}

	async create() {
		const requestOptions = {
			protocol: 'https:',
			hostname: 'cleverbot.io',
			method: 'POST',
			path: '/1.0/create',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const requestBody = JSON.stringify({
			user: this.user,
			key: this.key,
			nick: this.nick,
		});
		const responseBuffer = await utilityFunctions.httpRequest(requestOptions, requestBody);
		const responseString = responseBuffer.toString();
		let responseJson;
		try {
			responseJson = JSON.parse(responseString);
		} catch (err) {
			throw err;
		}
		if (responseJson.status !== 'success') {
			if (responseJson.status === 'Error: reference name already exists') {
				return this.nick;
			}
			throw new Error(responseJson.status);
		}
		this.nick = responseJson.nick;
		return responseJson.nick;
	}

	async ask(input) {
		if (!this.nick) {
			throw new Error('No nick provided, call .create() auto-assign one');
		}
		const requestOptions = {
			protocol: 'https:',
			hostname: 'cleverbot.io',
			method: 'POST',
			path: '/1.0/ask',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const requestBody = JSON.stringify({
			user: this.user,
			key: this.key,
			nick: this.nick,
			text: input,
		});
		const responseBuffer = await utilityFunctions.httpRequest(requestOptions, requestBody);
		const responseString = responseBuffer.toString();
		let responseJson;
		try {
			responseJson = JSON.parse(responseString);
		} catch (err) {
			throw err;
		}
		if (responseJson.status !== 'success') {
			throw new Error(responseJson.status);
		}
		return responseJson.response;
	}
}

module.exports = CleverbotIo;
