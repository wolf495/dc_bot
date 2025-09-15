const { Client, Partials, Events, GatewayIntentBits,MessageFlags,EmbedBuilder } = require('discord.js');
const { token,announceMsg } = require('./config.json');
const path = require('node:path');
const process = require('process');


const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('ready', () => {
    const channel = client.channels.cache.get(announceMsg);

    if (channel) {
	const exampleEmbed = new EmbedBuilder()
	.setColor(0x20b2aa)
	.setTitle('___*◞◠◡🐺 Welcome to WolfSpot 🐺◡◠◟*___')
	.setImage('https://cdnb.artstation.com/p/assets/images/images/012/910/399/original/michelle-bohorquez-animationv2.gif?1537145602')
	.setFooter({ text: '『"Be yourself, everyone else is already taken"』∿ ˚Oscar Wilde。', iconURL: 'https://www.pikpng.com/pngl/b/183-1839815_white-quotation-icon-transparent-png-download-clipart.png' });
	//.addFields({ name: '\u200B', value: '\u200B' })
	//	.setAuthor({ name: '『"Be yourself, everyone else is already taken"』\n∿ ˚Oscar Wilde。', iconURL: 'https://www.pikpng.com/pngl/b/183-1839815_white-quotation-icon-transparent-png-download-clipart.png' })

	//.setURL('https://discord.js.org/')
	//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	//.setDescription('Some description here')
	//.addFields({ name: 'Inline field title', value: 'Some value here' })
	channel.send({ embeds: [exampleEmbed] });
    } else {
        console.log('Channel not found!');
    }
	channel.send('I am Duck Guard 🐣. Just a little bot made to do little things. Add reactions below for certain roles. Mention @help for extra questions. Check out my slash commands by typing /\n\nfor inviting new people please use this link: https://discord.gg/kTwnarjv3d');
	client.destroy();
});

client.login(token);

