// Require the necessary discord.js classes
const { Client, Partials, Collection, Events, GatewayIntentBits,MessageFlags } = require('discord.js');
const { token } = require('./config.json');
//others
const fs = require('node:fs');
const path = require('node:path');
const { ReactionRole } = require("discordjs-reaction-role");
const process = require('process');
//const env = process.env;

process.env.MESSAGE='1377836402389160038';
process.env.RE_RED=':goat:';
process.env.RO_RED='1378167861956055040';


//🔴🔵🟢🟠🟡🟣🟤
//🩷❤️💙🤎💛💜💚🧡

// Create a new client instance
const client = new Client({ partials: [Partials.Message, Partials.Reaction],intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,] });

// Create a new manager and use it.
const configuration = [
  {
    messageId: process.env.MESSAGE,
    reaction: "🩷",
    roleId: "1378167861956055040",
  },
  {
    messageId: process.env.MESSAGE,
    reaction: "💙",
    roleId: "1378175973756764170",
  },
  {
    messageId: process.env.MESSAGE,
    reaction: "🐐",
    roleId: process.env.RO_RED,
  },
  {
    messageId: process.env.MESSAGE,
    reaction: "🐐",
    roleId: process.env.RO_RED,
  },
];
//const manager = new ReactionRole(client, configuration);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
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




// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);



/*const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
*/