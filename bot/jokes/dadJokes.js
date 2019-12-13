// Source: https://icanhazdadjoke.com/api

const utilityFunctions = require('../../utilityFunctions.js');

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
	const responseBuffer = await utilityFunctions.httpRequest(requestOptions, null);
	const responseString = responseBuffer.toString();
	const responseJSON = JSON.parse(responseString);

	return responseJSON.joke;
}
