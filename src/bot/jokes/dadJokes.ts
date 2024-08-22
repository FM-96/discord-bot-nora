// Source: https://icanhazdadjoke.com/api

import got, { type OptionsOfTextResponseBody } from 'got';

export async function getJoke() {
	const requestOptions: OptionsOfTextResponseBody = {
		protocol: 'https:',
		hostname: 'icanhazdadjoke.com',
		method: 'GET',
		path: '/',
		headers: {
			Accept: 'application/json',
			'User-Agent': 'Discord Bot "Nora" by FM-96 (felix.muellner.96@gmail.com)',
		},
	};
	const response = await got(requestOptions).text();
	const responseJSON = JSON.parse(response);

	return responseJSON.joke as string;
}
