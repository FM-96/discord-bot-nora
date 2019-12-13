const utilityFunctions = require('../utilityFunctions.js');

module.exports = async (animal) => {
	let target;

	if (animal === 'cat') {
		target = {
			url: 'https://aws.random.cat/meow',
			fileProperty: 'file',
		};
	} else if (animal === 'dog') {
		target = {
			url: 'https://random.dog/woof.json',
			fileProperty: 'url',
		};
	} else {
		throw new Error('Unsupported animal');
	}

	let randomFile;
	do {
		const responseBuffer = await utilityFunctions.httpRequest(target.url);
		const responseString = responseBuffer.toString();
		randomFile = JSON.parse(responseString)[target.fileProperty];
	} while (/(\.mp4|\.webm)$/i.test(randomFile));

	return randomFile;
};
