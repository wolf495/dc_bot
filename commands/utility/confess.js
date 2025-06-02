const { SlashCommandBuilder, spoiler } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription('anonymous confession posted as Duck Guard bot')
		.addStringOption(option =>
		option.setName('confession')
			.setDescription('The text to confess (within spoiler)'))
		.addIntegerOption(option =>
		option.setName('timer')
			.setDescription('How many seconds to keep this in chat before destroying. Set to 0 to keep')),
	async execute(interaction) {
		//await interaction.reply('Pong!');
		await interaction.deferReply();
		await interaction.deleteReply();
		const inp = interaction.options.getString('confession');
		const inp2 = interaction.options.getInteger('timer');

		const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('A confession has been made...')
	//.setURL('https://discord.js.org/')
	//.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription(spoiler(`${inp}`))
	.setThumbnail('https://f2.toyhou.se/file/f2-toyhou-se/images/59406877_KelBZ9FWJFR0vKJ.png')
	/*.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' })*/
	//.setFooter({ text: `This will self-destruct in [] minutes` })
	;
	//console.log(inp2);
		
	if (!inp2){
		interaction.channel.send({ embeds: [exampleEmbed] }).then(msg => setTimeout(() => msg.delete(), (1000 * 10)));
	}else{
		if (inp2 == 0){
			interaction.channel.send({ embeds: [exampleEmbed] });
		} else {
			interaction.channel.send({ embeds: [exampleEmbed] }).then(msg => setTimeout(() => msg.delete(), (1000 * inp2)));
		}
	}
		//interaction.channel.send({ content: spoiler(`${inp}`) }).then(msg => setTimeout(() => msg.delete(), 100000));
		//.then(msg =>{msg.delete({timeout:"100000"})});
	},
};