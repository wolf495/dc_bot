import { SlashCommandBuilder } from 'discord.js';

export default{
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Replies with msg')
		.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to say')),
	async execute(interaction) {
		//await interaction.reply('Pong!');
		await interaction.deferReply();
		await interaction.deleteReply();
		const inp = interaction.options.getString('input')
		interaction.channel.send({ content: `${inp}` });
	},
};