let active = false;

module.exports = {
	activate: () => {
		active = true;
	},
	deactivate: () => {
		active = false;
	},
	isActive: () => active,
};
