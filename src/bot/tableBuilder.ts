module.exports = {
	buildTable,
};

// TODO: add check for maximum table length
// https://en.wikipedia.org/wiki/Box-drawing_character
function buildTable(numColumns, fields, title) {
	if (numColumns > fields.length) {
		return undefined;
	}

	let builtTable = '';

	const tableCells = fields.slice();
	if (tableCells.length % numColumns !== 0) {
		for (let i = 0; i < tableCells.length % numColumns; ++i) {
			tableCells.push('');
		}
	}

	let colWidths = [];
	for (let i = 0; i < numColumns; ++i) {
		colWidths.push(0);
	}

	for (let i = 0; i < numColumns; ++i) {
		for (let j = i; j < tableCells.length; j += numColumns) {
			if (colWidths[i] < tableCells[j].length) {
				colWidths[i] = tableCells[j].length;
			}
		}
	}

	let titleLength = 0;
	if (title) {
		titleLength = colWidths.reduce((prev, curr) => prev + curr, 0) + ((colWidths.length - 1) * 3); // 3 = padding between columns
		while (titleLength < title.length) {
			colWidths = colWidths.map(e => e + 1);
			titleLength += colWidths.length;
		}
	}

	// table start
	builtTable += '╔═';
	for (let i = 0; i < numColumns - 1; ++i) {
		builtTable += '═'.repeat(colWidths[i]);
		builtTable += title ? '═══' : '═╤═';
	}
	builtTable += '═'.repeat(colWidths[numColumns - 1]);
	builtTable += '═╗\n';

	if (title) {
		// table title
		builtTable += '║ ';
		builtTable += tablePad(title, titleLength, 'center');
		builtTable += ' ║\n';

		// table title-head seperator
		builtTable += '╠═';
		for (let i = 0; i < numColumns - 1; ++i) {
			builtTable += '═'.repeat(colWidths[i]);
			builtTable += '═╤═';
		}
		builtTable += '═'.repeat(colWidths[numColumns - 1]);
		builtTable += '═╣\n';
	}

	// table head
	builtTable += '║ ';
	for (let i = 0; i < numColumns - 1; ++i) {
		builtTable += tablePad(tableCells[i], colWidths[i], 'center');
		builtTable += ' │ ';
	}
	builtTable += tablePad(tableCells[numColumns - 1], colWidths[numColumns - 1], 'center');
	builtTable += ' ║\n';

	// table head-body seperator
	builtTable += '╠═';
	for (let i = 0; i < numColumns - 1; ++i) {
		builtTable += '═'.repeat(colWidths[i]);
		builtTable += '═╪═';
	}
	builtTable += '═'.repeat(colWidths[numColumns - 1]);
	builtTable += '═╣\n';

	// table body
	for (let i = 0; i < (tableCells.length / numColumns) - 1; ++i) {
		builtTable += '║ ';
		for (let j = numColumns * (i + 1); j < (numColumns * (i + 2)) - 1; ++j) {
			builtTable += tablePad(tableCells[j], colWidths[j % numColumns], 'auto');
			builtTable += ' │ ';
		}
		builtTable += tablePad(tableCells[(numColumns * (i + 2)) - 1], colWidths[numColumns - 1], 'auto');
		builtTable += ' ║\n';

		if (i + 1 < (tableCells.length / numColumns) - 1) {
			// table row seperator
			builtTable += '╟─';
			for (let j = 0; j < numColumns - 1; ++j) {
				builtTable += '─'.repeat(colWidths[j]);
				builtTable += '─┼─';
			}
			builtTable += '─'.repeat(colWidths[numColumns - 1]);
			builtTable += '─╢\u200B\n'; // zero-width space between end of table row and newline as a marker to split messages
		}
	}

	// table end
	builtTable += '╚═';
	for (let i = 0; i < numColumns - 1; ++i) {
		builtTable += '═'.repeat(colWidths[i]);
		builtTable += '═╧═';
	}
	builtTable += '═'.repeat(colWidths[numColumns - 1]);
	builtTable += '═╝';

	return builtTable;
}

function tablePad(str, padLength, align) {
	let paddedStr;
	if (str.length < padLength) {
		if (align === 'center') {
			const left = Math.floor((padLength - str.length) / 2);
			const right = Math.ceil((padLength - str.length) / 2);
			paddedStr = ' '.repeat(left) + str + ' '.repeat(right);
		} else if (align === 'auto') {
			if (isNaN(str)) {
				paddedStr = str + ' '.repeat(padLength - str.length);
			} else {
				paddedStr = ' '.repeat(padLength - str.length) + str;
			}
		} else if (align === 'left') {
			paddedStr = str + ' '.repeat(padLength - str.length);
		} else if (align === 'right') {
			paddedStr = ' '.repeat(padLength - str.length) + str;
		}
	} else if (str.length > padLength) {
		// TODO shorten with '…'?
		return undefined;
	} else {
		paddedStr = str;
	}
	return paddedStr;
}
