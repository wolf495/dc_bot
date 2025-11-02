const { SlashCommandBuilder,MessageFlags  } = require('discord.js');
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
		//await interaction.deferReply();
		//await interaction.deleteReply();
		const inp = interaction.options.getString('input')
		//interaction.channel.send({ content: `${inp}` });
		
		//fetch(https://mc-api.io/profile/wolf3598/java)
		var toWhitelist = null;
		/*fetch(`https://mc-api.io/profile/${inp}/java`)
		  .then(response => {
			if (!response.ok) {
			  throw new Error('Network response was not ok');
			}
			//console.log(response);
			//const data = response.json();
			//console.log(data);
			//const resp = JSON.parse(response.json());
			
			return response.json();
		  })
		  .then(data => {
			  //console.log(data);
			  //interaction.channel.send({ content: `${inp}=${data.uuid}` });
			  //console.log(`set toWhitelist to: ${data.uuid}`);
			  toWhitelist = data.uuid;
			  })
		  .catch(error => console.error('There was a problem with the fetch operation:', error));
		*/
		
		//console.log(`WHITELIST=${toWhitelist}`)
		if (inp !== null){
			const rcon = await Rcon.connect({
				host: "10.0.0.248", port: 35981, password: "soto495"
			})

			//console.log(await rcon.send("list"))
			//var
			let responses = await Promise.all([
				//rcon.send("help"),
				rcon.send(`whitelist add ${inp}`)
				//rcon.send(`whitelist reload`)
			])
			
			var outResponse = null;
			for (response of responses) {
				//if(response.includes('already whitelisted')){}console.log(response)
				outResponse = response;
			}
			

			if (outResponse.includes('player does not exist')){
				outResponse =  `'${inp}' ${outResponse}`;
				interaction.reply({content: `${outResponse}`,flags: MessageFlags.Ephemeral});
			}
			else if (outResponse.includes('already whitelisted')) {
				outResponse =  `'${inp}' ${outResponse}`;
				interaction.reply({content: `${outResponse}`,flags: MessageFlags.Ephemeral});
			}
			else {
				let responses = await Promise.all([
				//rcon.send("help"),
				//rcon.send(`whitelist add ${inp}`)
				rcon.send(`whitelist reload`)
				])
				for (response of responses) {
					//if(response.includes('already whitelisted')){}console.log(response)
					outResponse += response;
				}
				interaction.reply({content: `${outResponse}`});
			}
			
			//interaction.reply({content: `${outResponse}`,flags: MessageFlags.Ephemeral});
			rcon.end()
		}
		//---------------
	},
};