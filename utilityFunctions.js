const http = require('http');
const https = require('https');
const Transform = require('stream').Transform;

module.exports = {
	httpRequest,
};

/**
 * Executes a HTTP(S) request and returns a Buffer containing the response
 * @param {Object|String|URL} requestOptions The requestOptions to make the request with
 * @param {?String|Buffer} requestBody The body of the request
 * @returns {Promise.<Buffer>} The response to the request
 */
function httpRequest(requestOptions, requestBody) {
	return new Promise((resolve, reject) => {
		let protocol;
		if (typeof requestOptions === 'object') {
			protocol = requestOptions.protocol.slice(0, -1);
		} else if (typeof requestOptions === 'string') {
			try {
				protocol = /^([a-z]+):\/\//.exec(requestOptions)[1];
			} catch (err) {
				throw new Error('Unsupported requestOptions: ' + requestOptions);
			}
		}
		let requestLib;
		if (protocol === 'http') {
			requestLib = http;
		} else if (protocol === 'https') {
			requestLib = https;
		} else {
			reject(new Error('Unsupported protocol: ' + protocol));
			return;
		}
		const request = requestLib.request(requestOptions, response => {
			const responseData = new Transform();
			response.on('data', data => {
				responseData.push(data);
			});
			response.on('end', () => {
				resolve(responseData.read());
			});
		});
		if (requestBody) {
			request.write(requestBody);
		}
		request.end();
		request.on('error', err => {
			reject(err);
		});
	});
}
