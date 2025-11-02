import { Client, Partials, Events, GatewayIntentBits,MessageFlags,EmbedBuilder,Colors } from 'discord.js';
import config from '../../config.json' with { type: "json" };
//import path from 'node:path';
//import process from 'process'
//import { ReactionRole } from "discordjs-reaction-role";
//import { pdbUpdate,pdbGetAll,pdbInsert,pdbDeleteItem } from "../pdb.js";
//import PouchDB from 'pouchdb';
//import fs from 'fs';
//import comdb from 'comdb';

const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent] });

//client.once(Events.ClientReady, readyClient => {/*console.log(`Ready! Logged in as ${readyClient.user.tag}`);*/});

async function printStuff (chanParm) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x20b2aa)
    .setTitle('___*◞◠◡🐺 Welcome to WolfSpot 🐺◡◠◟*___')
    .setImage('https://cdnb.artstation.com/p/assets/images/images/012/910/399/original/michelle-bohorquez-animationv2.gif?1537145602')
    .setFooter({ 
      text: '『"Be yourself, everyone else is already taken"』∿ ˚Oscar Wilde。',
      iconURL: 'https://www.pikpng.com/pngl/b/183-1839815_white-quotation-icon-transparent-png-download-clipart.png' 
  });

  chanParm.send('﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌');
  chanParm.send('https://discord.gg/kTwnarjv3d');
  chanParm.send({ embeds: [exampleEmbed] });

  chanParm.send('I am Duck Guard 🐣. Just a little bot made to do little things. Add reactions below for certain roles. Mention <@&1434611912519454811> for extra questions. Check out my slash commands by typing /\n\nfor inviting new people please use this link above');
  chanParm.send('﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌');
} 

client.on('ready', async () => {
  const channel = client.channels.cache.get(config.botspam);
  const thisGuild = client.guilds.cache.get(config.guildId);
  
  await printStuff(channel)
  client.destroy();
  /*
  wait(20000).then(() => {
    pdbInsert({subsystem: 'bot' ,type: 'roleconfig',config: configuration})
    console.log("✅ 20 seconds passed!");
    client.destroy();
    console.log('Bot shut down.');
  });*/
});

client.login(config.token);

