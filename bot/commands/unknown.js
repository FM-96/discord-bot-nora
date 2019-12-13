// syntax: §unknown <LENGTH>

// TODO adjust probabilities
function* createNoise() {
	const EMPTY = '';
	const LIGHT = '░';
	const MEDIUM = '▒';
	const DARK = '▓';

	let latestOutput = '';
	let nextOutput;

	for (;;) {
		const nextChoice = Math.random();
		switch (latestOutput) {
			case `${EMPTY}${EMPTY}`:
				if (nextChoice < 1) { // 100%
					nextOutput = LIGHT;
				} else if (nextChoice < 0) { // 0%
					nextOutput = MEDIUM;
				} else { // 0%
					nextOutput = DARK;
				}
				break;
			case `${EMPTY}${LIGHT}`:
				if (nextChoice < 0.8) { // 80%
					nextOutput = LIGHT;
				} else if (nextChoice < 1) { // 20%
					nextOutput = MEDIUM;
				} else { // 0%
					nextOutput = DARK;
				}
				break;
			case `${LIGHT}${LIGHT}`:
				if (nextChoice < 0.6) { // 60%
					nextOutput = LIGHT;
				} else if (nextChoice < 1) { // 40%
					nextOutput = MEDIUM;
				} else { // 0%
					nextOutput = DARK;
				}
				break;
			case `${LIGHT}${MEDIUM}`:
				if (nextChoice < 0.55) { // 55%
					nextOutput = LIGHT;
				} else if (nextChoice < 0.95) { // 40%
					nextOutput = MEDIUM;
				} else { // 5%
					nextOutput = DARK;
				}
				break;
			case `${MEDIUM}${LIGHT}`:
				if (nextChoice < 0.7) { // 70%
					nextOutput = LIGHT;
				} else if (nextChoice < 1) { // 30%
					nextOutput = MEDIUM;
				} else { // 0%
					nextOutput = DARK;
				}
				break;
			case `${MEDIUM}${MEDIUM}`:
				if (nextChoice < 0.45) { // 45%
					nextOutput = LIGHT;
				} else if (nextChoice < 0.9) { // 45%
					nextOutput = MEDIUM;
				} else { // 10%
					nextOutput = DARK;
				}
				break;
			case `${MEDIUM}${DARK}`:
				if (nextChoice < 0) { // 0%
					nextOutput = LIGHT;
				} else if (nextChoice < 0.96) { // 96%
					nextOutput = MEDIUM;
				} else { // 4%
					nextOutput = DARK;
				}
				break;
			case `${DARK}${MEDIUM}`:
				if (nextChoice < 0.45) { // 45%
					nextOutput = LIGHT;
				} else if (nextChoice < 0.95) { // 50%
					nextOutput = MEDIUM;
				} else { // 5%
					nextOutput = DARK;
				}
				break;
			case `${DARK}${DARK}`:
				if (nextChoice < 0) { // 0%
					nextOutput = LIGHT;
				} else if (nextChoice < 0.99) { // 99%
					nextOutput = MEDIUM;
				} else { // 1%
					nextOutput = DARK;
				}
				break;
			default:
				throw new Error(`Defaulted with lastestOutput: ${latestOutput}`);
		}

		latestOutput = latestOutput.length < 2 ? latestOutput + nextOutput : latestOutput.slice(1) + nextOutput;
		yield nextOutput;
	}
}

module.exports = {
	command: 'unknown',
	ownerOnly: false,
	run: async (message, context) => {
		const targetLength = Number(message.content.split(' ')[1]);
		if (Number.isNaN(targetLength)) {
			return message.channel.send('No valid length specified.');
		}
		const iter = createNoise();
		let outputString = '';
		for (let i = 0; i < targetLength; ++i) {
			outputString += iter.next().value;
		}
		return message.channel.send(outputString);
	},
};
