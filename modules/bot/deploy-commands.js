import { REST, Routes } from 'discord.js'
import config from '../../config.json' with { type: "json" };
//import fs from 'fs'
//import path from 'path'
//import { fileURLToPath } from 'url';
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//const foldersPath = path.join(__dirname, 'commands');
//const commandFolders = fs.readdirSync(foldersPath);
import getCommands from './util/commandsHelper.js';
let commands = []
const rest = new REST().setToken(config.token);

(async () => {
	try {
		commands = await getCommands('d');

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);

		//-----------
		console.log(`Started refreshing ${commands.length} application (/) commands ON TEST.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data2 = await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guidIdTest),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data2.length} application (/) commands ON TEST.`);

	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();