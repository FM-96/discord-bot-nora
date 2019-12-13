const yargsParser = require('yargs-parser');

const tableBuilder = require('../tableBuilder.js');

module.exports = {
	command: 'table',
	description: 'Create an ASCII table',
	usage: `[-k] [-t string] [-h string [string [...]]] <-r string [string [...]] [-r string [string [...]] [...]]>
Options:
-h, --header: array of header cells
-r, --row:
-t, --title:
-k, --keep:`,
	ownerOnly: false,
	run: async (message, context) => {
		let table;
		let keepMessage = false;
		if (message.content.includes('\n\n')) {
			// use classic multi-line syntax
			const title = message.content.split('\n')[0].split(' ').slice(1).join(' ').trim();
			const numColumns = message.content.split('\n\n')[0].split('\n').length - 1;
			if (isNaN(numColumns)) {
				return;
			}
			const fields = message.content.split(/\n+/).slice(1);
			table = tableBuilder.buildTable(numColumns, fields, title);
		} else {
			// use Unix style command args
			const argv = yargsParser(message.content.replace(/\n/g, ' ').split(' ').slice(1).join(' '), {
				alias: {
					header: ['h'],
					keep: ['k'],
					row: ['r'],
					title: ['t'],
				},
				array: ['header', 'row'],
				boolean: ['keep'],
				configuration: {
					'parse-numbers': false,
					'flatten-duplicate-arrays': false,
				},
			});

			if (!argv.row || !argv.row.length) {
				return;
			} else if (!Array.isArray(argv.row[0])) {
				argv.row = [argv.row];
			}

			// only necessary because of yargs-parser bug (?), see GitHub issue: https://github.com/yargs/yargs-parser/issues/115
			argv.row = semiFlattenArray(argv.row);

			let numColumns;
			let fields = [];
			const title = argv.title || null;

			if (argv.header) {
				numColumns = argv.header.length;
				fields.push(...argv.header);
				for (const row of argv.row) {
					if (row.length < numColumns) {
						row.push(...(new Array(numColumns - row.length).map(() => '')));
					}
					fields.push(...row);
				}
			} else {
				numColumns = Math.max(argv.row.map(e => e.length));
				for (const row of argv.row) {
					if (row.length < numColumns) {
						row.push(...(new Array(numColumns - row.length).map(() => '')));
					}
					fields.push(...row);
				}
			}

			if (argv.keep) {
				keepMessage = true;
			}

			fields = fields.map(e => (e === undefined ? '' : e));
			table = tableBuilder.buildTable(numColumns, fields, title);
		}

		if (table === undefined) {
			return;
		}
		if (!keepMessage) {
			await message.delete();
		}
		return message.channel.send('```\n' + table + '\n```', {split: {
			append: '\n```',
			char: '\u200B', // zero-width space
			prepend: '```\n',
		}});
	},
};

// see https://github.com/yargs/yargs-parser/issues/115
function semiFlattenArray(arr) {
	if (!Array.isArray(arr)) {
		throw new Error('Trying to semi-flatten something that isn\'t an array');
	}
	if (!Array.isArray(arr[0])) {
		return [arr];
	} else {
		if (arr.length === 1) {
			return [...semiFlattenArray(arr[0])];
		} else {
			return [
				...semiFlattenArray(arr[0]),
				arr[1],
			];
		}
	}
}
