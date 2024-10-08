import got from 'got';

export default async (animal: string) => {
	let target: { url: string; fileProperty: string };

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

	let randomFile: string;
	do {
		const response = await got(target.url).text();
		randomFile = JSON.parse(response)[target.fileProperty];
	} while (/(\.mp4|\.webm)$/i.test(randomFile));

	return randomFile;
};
