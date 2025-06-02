const { SlashCommandBuilder,MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mcip')
		.setDescription('MC server ip address'),
	async execute(interaction) {
		await interaction.reply({content: `IP Address: 28.ip.gl.ply.gg  Port: 63688`,flags: MessageFlags.Ephemeral});
	},
};