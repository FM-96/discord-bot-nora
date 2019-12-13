const yargsParser = require('yargs-parser');

module.exports = {
	command: 'untable',
	ownerOnly: false,
	run: async (message, context) => {
		const argv = yargsParser(message.content.split(' ').slice(1).join(' '), {
			alias: {
				channel: ['c'],
				format: ['f'],
				message: ['m'],
				quotes: ['q'],
				simple: ['s', 'legacy', 'l', 'old', 'o'],
			},
			array: ['message'],
			boolean: ['format', 'quotes', 'simple'],
			configuration: {
				'parse-numbers': false,
			},
		});

		if (!argv.message || argv.message.length === 0) {
			return;
		}

		let tableMessagesChannel = message.channel;
		if (argv.channel) {
			tableMessagesChannel = message.client.channels.get(argv.channel);
			if (!tableMessagesChannel) {
				return;
			}
		}

		let tableString = '';

		// get content(s) of message(s) with table
		for (const msgId of argv.message) {
			const msg = await tableMessagesChannel.fetchMessage(msgId);
			if (!msg.content.startsWith('```\n') || !msg.content.endsWith('\n```')) {
				// not a valid table
				return;
			}
			tableString += msg.content.slice(4, -4);
		}

		let tableStringLines = tableString.split('\n');

		if (!/^╔(?:═|╤)+╗$/.test(tableStringLines[0])) {
			// not a valid table
			return;
		}

		let title = false;
		const header = [];
		const rows = [];

		// parse title
		if (!tableStringLines[0].includes('╤')) {
			title = tableStringLines[1].slice(1, -1).trim();
			tableStringLines = tableStringLines.slice(2);
		}

		const columnLengths = tableStringLines[0].slice(1, -1).split('╤').map(e => e.length);

		// parse header
		let headerRow = tableStringLines[1].slice(1, -1);
		for (const columnLength of columnLengths) {
			header.push(headerRow.slice(0, columnLength).trim());
			headerRow = headerRow.slice(columnLength + 1);
		}

		// parse rows
		for (let i = 3; i < tableStringLines.length; i += 2) {
			const row = [];
			let dataRow = tableStringLines[i].slice(1, -1);
			for (const columnLength of columnLengths) {
				row.push(dataRow.slice(0, columnLength).trim());
				dataRow = dataRow.slice(columnLength + 1);
			}
			rows.push(row);
		}

		// return untable
		let untable = '§table';
		if (argv.simple) {
			if (title) {
				untable += ` ${title}`;
			}

			untable += `\n${header.map(e => (e.length > 0 ? e : ' ')).join('\n')}\n`;

			for (const row of rows) {
				untable += `\n${row.map(e => (e.length > 0 ? e : ' ')).join('\n')}`;
			}
		} else {
			if (title) {
				untable += `${argv.format ? '\n' : ' '}--title ${argv.quotes || title.length === 0 || title.includes(' ') ? `"${title}"` : title}`;
			}

			untable += `${argv.format ? '\n' : ' '}--header ${header.map(e => (argv.quotes || e.length === 0 || e.includes(' ') ? `"${e}"` : e)).join(' ')}`;

			for (const row of rows) {
				untable += `${argv.format ? '\n' : ' '}--row ${row.map(e => (argv.quotes || e.length === 0 || e.includes(' ') ? `"${e}"` : e)).join(' ')}`;
			}
		}

		await message.channel.send(untable);
	},
};
