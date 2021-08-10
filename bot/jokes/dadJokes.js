// Source: https://icanhazdadjoke.com/api

const got = require('got');

module.exports = {
	getJoke,
};

async function getJoke() {
	const requestOptions = {
		protocol: 'https:',
		hostname: 'icanhazdadjoke.com',
		method: 'GET',
		path: '/',
		headers: {
			'Accept': 'application/json',
			'User-Agent': 'Discord Bot "Nora" by FM-96 (felix.muellner.96@gmail.com)',
		},
	};
	const response = await got(requestOptions).text();
	const responseJSON = JSON.parse(response);

	return responseJSON.joke;
}
