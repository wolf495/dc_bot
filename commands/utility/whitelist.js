const { SlashCommandBuilder } = require('discord.js');
//var Rcon = require('rcon/node-rcon.js');
const { Rcon } = require("rcon-client");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('whitelist')
		.setDescription('Replies with msg')
		.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to say')),
	async execute(interaction) {
		//await interaction.reply('Pong!');
		await interaction.deferReply();
		await interaction.deleteReply();
		//const inp = interaction.options.getString('input')
		//interaction.channel.send({ content: `${inp}` });
		const rcon = await Rcon.connect({
			host: "0.0.0.0", port: 35981, password: "soto495"
		})

		console.log(await rcon.send("list"))

		let responses = await Promise.all([
			rcon.send("help"),
			rcon.send("whitelist list")
		])

		for (response of responses) {
			console.log(response)
		}

		rcon.end()
		//---------------
	},
};