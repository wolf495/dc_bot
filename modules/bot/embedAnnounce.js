import { Client,Partials,GatewayIntentBits,EmbedBuilder } from 'discord.js';
import config from '../../config.json' with { type: "json" };
import process from 'process'

const client = new Client({ partials: [Partials.Message],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    const channel = client.channels.cache.get(config.announceMsg);

    if (channel) {
	const exampleEmbed = new EmbedBuilder()
		.setColor(process.argv[6])
		.setTitle(process.argv[7])
		.setURL(process.argv[8])
		.setThumbnail(process.argv[9])
		.addFields({ name: `${process.argv[3]}`, value: `[${process.argv[2]}](${process.argv[5]})`})
		.setImage(`${process.argv[4]}`);
	channel.send({ embeds: [exampleEmbed] });
    } else {
        console.log('Channel not found!');
    }
	client.destroy();
});

client.login(config.token);

