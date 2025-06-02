const { SlashCommandBuilder } = require('discord.js');
const process = require('process');
const { Client, Partials, Collection, Events, GatewayIntentBits } = require('discord.js');
const { ReactionRole } = require("discordjs-reaction-role");
const fs = require('fs');

// Read the JSON file using require
const jsonData = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setupcolors')
		.setDescription('add message for reaction Roles'),
	async execute(interaction,client) {
		await interaction.deferReply();
		await interaction.deleteReply();
		const response = await interaction.channel.send({ content: `Use these reactions for role colors (only works if I'm online)`, withResponse: true  });
		response.react("🩷");
		response.react("❤️");
		response.react("💙");
		response.react("🤎");
		response.react("💛");
		response.react("💜");
		response.react("💚");
		response.react("🧡");
		//console.log(response.id);
		process.env.MESSAGE=response.id;
		
		// Update the data
		jsonData.colorMsg = `${response.id}`;

		// Synchronously write the updated data back to the JSON file
		fs.writeFileSync('./config.json', JSON.stringify(jsonData, null, 2));

		//console.log('Data updated successfully.');
		
		//https://emojis.wiki/
		//🩷❤️💙🤎💛💜💚🧡🖤🤍
		const configuration = [
			{
				messageId: process.env.MESSAGE,
				reaction: "🩷",
				roleId: "1378190916921196625",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "💙",
				roleId: "1378191127689298062",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "❤️",
				roleId: "1378191403032645703",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "🤎",
				roleId: "1378191199130746921",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "💛",
				roleId: "1378191167317082112",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "💜",
				roleId: "1378191673598804088",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "💚",
				roleId: "1378191709044867073",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "🧡",
				roleId: "1378191501334675466",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "🖤",
				roleId: "1379147493010440203",
			},
			{
				messageId: process.env.MESSAGE,
				reaction: "🤍",
				roleId: "1379147653358682183",
			},
		];
		const manager = new ReactionRole(client, configuration);
	},
};