const { Client, Partials, Collection, Events, GatewayIntentBits,MessageFlags,EmbedBuilder, Embed } = require('discord.js');
const { token,colorMsg,announceMsg } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { ReactionRole } = require("discordjs-reaction-role");
const process = require('process');
process.env.MESSAGE=colorMsg;


const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

/*
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

*/
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('ready', () => {
    const channel = client.channels.cache.get(announceMsg);

	

    if (channel) {
        //channel.send('Hello, this is a message from my bot!');
		//channel.send(`${process.argv[2]}`)
		const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setAuthor({ name: `NEW Dubbed Episode 🔥`, iconURL: 'https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png'})
	.addFields({ name: `${process.argv[3]}`, value: `[${process.argv[2]}](${process.argv[5]})`})
	.setImage(`${process.argv[4]}`);
	//.setThumbnail(`${process.argv[4]}`)
	/*
	.setTitle(`${process.argv[2]}`)
	.setURL(`${process.argv[5]}`)
	*/ 
	//.setDescription(`New Dubbed Episode!`)
	
	/*.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)*/
	//.addFields({ name: 'Inline field title', value: 'Some value here'});
	/*.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()*/
	//.setFooter({ text: 'http://LINK', iconURL: 'https://i.pinimg.com/1200x/b9/93/5d/b9935d95d305f302007dbba4d9df0d98.jpg' });

channel.send({ embeds: [exampleEmbed] });

    } else {
        console.log('Channel not found!');
    }
	client.destroy();
});

client.login(token);



