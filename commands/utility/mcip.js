const { SlashCommandBuilder,MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mcip')
		.setDescription('MC server ip address'),
	async execute(interaction) {
		await interaction.reply({content: `IP Address: mc.soto.family:35980`,flags: MessageFlags.Ephemeral});
	},
};