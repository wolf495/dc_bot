const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Replies with msg'),
	async execute(interaction) {
		//await interaction.reply('Pong!');
		await interaction.deferReply();
		await interaction.deleteReply();
		interaction.channel.send({ content: 'Hello!' });
	},
};