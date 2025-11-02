//import { REST, Routes } from 'discord.js'
//import config from '../../config.json' with { type: "json" };
import {Collection} from 'discord.js';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
const __dirname = path.resolve(__filename, '../..');
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

export default async function getCommands(type){
    let commands = []
    let cliCommands = new Collection();
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            let filePath = path.join(commandsPath, file);
            let normalizedPath = path.normalize(filePath).replace(/\\/g, '/');
            filePath = `file:///${normalizedPath}`;
            const commandImport = await import(filePath);
            const command = commandImport.default
            //console.log(command)
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                cliCommands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    if (type==='d'){
        return commands
    }else if(type==='i'){
        return cliCommands
    }
    
}