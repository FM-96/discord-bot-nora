module.exports = {
	command: 'owner',
	ownerOnly: false,
	run: async (message, context) => {
		const app = await message.client.fetchApplication();
		await message.channel.send(`My owner is ${app.owner}.`);
	},
};
