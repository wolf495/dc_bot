//const { Client, Partials, Events, GatewayIntentBits,MessageFlags,EmbedBuilder } = require('discord.js');
//const { token,announceMsg } = require('../../config.json');
//const path = require('node:path');
//const process = require('process');
import { Client, Partials, Events, GatewayIntentBits,MessageFlags,EmbedBuilder } from 'discord.js';
import config from '../../config.json' with { type: "json" };
import path from 'node:path';
import process from 'process'

const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('ready', () => {
    const channel = client.channels.cache.get(config.announceMsg);

    if (channel) {
	const exampleEmbed = new EmbedBuilder()
		.setColor(0xF47521)
		.setTitle(`🔥 NEW Dubbed Episode 🔥`)
		.setURL(`https://www.crunchyroll.com/discover`)
		//.setAuthor({ name: `🔥 NEW Dubbed Episode 🔥`})//, iconURL: 'https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png'})
		.setThumbnail('https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png')
		.addFields({ name: `${process.argv[3]}`, value: `[${process.argv[2]}](${process.argv[5]})`})
		.setImage(`${process.argv[4]}`);
	channel.send({ embeds: [exampleEmbed] });
    } else {
        console.log('Channel not found!');
    }
	client.destroy();
});

client.login(config.token);

