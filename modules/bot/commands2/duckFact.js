const { SlashCommandBuilder } = require('discord.js');

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Random duck fact')
		,
	async execute(interaction) {
		//await interaction.reply('Pong!');
		await interaction.deferReply();
		await interaction.deleteReply();
		const url = 'https://api.animality.xyz/all/duck';
		var responseThis = fetch(url).then(function(response) {
		return response.json();
		}).then(function(data) {
		//console.log(data);
		//console.log(data.fact);
		interaction.channel.send({ content: `Duck Fact: ${data.fact}` });
		}).catch(function(err) {
		console.log('Fetch Error :-S', err);
		});
		//console.log(responseThis);
		//const inp = interaction.options.getString('input')
		//interaction.channel.send({ content: `${inp}` });
	},
};