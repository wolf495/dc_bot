const { Client, Partials, Collection, Events, GatewayIntentBits,MessageFlags } = require('discord.js');
const { token,colorMsg } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { ReactionRole } = require("discordjs-reaction-role");
const process = require('process');
process.env.MESSAGE=colorMsg;


const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

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

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction,client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on('messageCreate', (message) => {
    //console.log(`messageCreate: ${message}`);
	if (!message.author.bot){
		if (message.member.roles.cache.has('1379252772595044432')){ 
	//console.log(`${message.author.username} is ducked.`);
	//var cloned = message;
	//message.delete();
	//message.channel.send({ content: `test - role check hit`});
	message.channel.createWebhook({
	name: message.author.username,
	avatar: message.author.displayAvatarURL(),
}).then(webhook => {
		//console.log(`Created webhook ${webhook}`);
		//return webhook.send({
	//content: message.content,
	//username: message.author.username,
	//avatarURL: message.author.displayAvatarURL(),
	//})
	//console.log(message);
	return webhook.send('quack').then(message => webhook);
	//return webhook
	//webhook.delete();
	}).then(webhook => webhook.delete()).catch(console.error);
	message.delete();
	}}
	
});


client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
