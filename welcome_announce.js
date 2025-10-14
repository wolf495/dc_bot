const { Client, Partials, Events, GatewayIntentBits, MessageFlags, EmbedBuilder, Colors } = require('discord.js');
const { token,announceMsg,colorMsg,guidIdTest,botspam } = require('./config.json');
const path = require('node:path');
const process = require('process');
const { ReactionRole } = require("discordjs-reaction-role");
//const jsonData = require('config.json');


const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

async function printStuff (chanParm) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x20b2aa)
    .setTitle('___*◞◠◡🐺 Welcome to WolfSpot 🐺◡◠◟*___')
    .setImage('https://cdnb.artstation.com/p/assets/images/images/012/910/399/original/michelle-bohorquez-animationv2.gif?1537145602')
    .setFooter({ 
      text: '『"Be yourself, everyone else is already taken"』∿ ˚Oscar Wilde。',
      iconURL: 'https://www.pikpng.com/pngl/b/183-1839815_white-quotation-icon-transparent-png-download-clipart.png' 
  });

  channel.send('﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌');
  channel.send({ embeds: [exampleEmbed] });

  channel.send('I am Duck Guard 🐣. Just a little bot made to do little things. Add reactions below for certain roles. Mention @help for extra questions. Check out my slash commands by typing /\n\nfor inviting new people please use this link: https://discord.gg/kTwnarjv3d');
  channel.send('﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌﹌');

  const exampleEmbed2 = new EmbedBuilder()
    .setColor(0x20b2aa)
    .setTitle('SET COLOR');
  // Send a message and add a reaction
  const msg = await channel.send({ embeds: [exampleEmbed2] });

} 
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
client.on('ready', async () => {
  const channel = client.channels.cache.get(botspam);
  const reactionRoleXwlk = []
  thisGuild = client.guilds.cache.get(guidIdTest);
  const chunkSize = 10;

  const chunkObjectProperties = (obj, chunkSize) => {
    const entries = Object.entries(obj); // Convert object to array of [key, value] pairs
    const chunks = [];

    for (let i = 0; i < entries.length; i += chunkSize) {
        chunks.push(entries.slice(i, i + chunkSize)); // Slice the array into chunks
    }

    return chunks; // Return the array of chunks
  };
  listOfReactions=['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
  chunked = chunkObjectProperties(Colors,10);
  //console.log(chunked)

  chunkIteration = 1;

//await new Promise((resolve, reject) => {

  chunked.forEach(chunk => {
    //console.log(chunk);
    //console.log('==')
    const roleId = '1427286145821315182'; // replace with your role ID
    buildString = ''
    for (const col in chunk){
      buildString += `${listOfReactions[col]} = <@&${roleId}>\n`//@${chunk[col][0]}\n`
    }

  chunkEmbed = new EmbedBuilder()
    .setColor(0x20b2aa)
    .setTitle(`SET COLORChunk ${chunkIteration}`)
    .setDescription(`${buildString}`); //`Hey ${`<@&${roleId}>`}! You have been summoned!`);
    chunkIteration++;
  const chunkedMsg = channel.send({ embeds: [chunkEmbed] , allowedMentions: { roles: [roleId] }});
  //Promise.resolve(chunkedMsg);
  //console.log(chunkedMsg);
  //console.log(chunk);
  chunkedMsg.then((mssg) => {
    for (const col in chunk){
      //msgChunk.react('1️⃣');
      console.log(`${listOfReactions[col]}  =[${chunk[col][0]}|${chunk[col][1]}]`);
      Promise.resolve(mssg.react(listOfReactions[col]));
      //console.log(mssg);
      //Promise.resolve(chunkedMsg.react(listOfReactions[col]));
    }

  });
  //if (chunkIteration == chunked.length){ resolve(); }
  });
//});
//if (chunkIteration == chunked.length){
  //await wait(20000);
  

console.log("⏳ Waiting 20 seconds...");
wait(20000).then(() => {
  console.log("✅ 20 seconds passed!");
  client.destroy();
  console.log('Bot shut down.');
});
  //client.destroy();
  //console.log('Bot shut down.');
 //}
  /*if (!channel) {
    console.log('Channel not found!');
    return;
  }*/

  // Example embed
  
  
  
  
  
    //{role:'dg_red', color:''}
  //]
  //client.cache.guild.roles
  //console.log(Colors.Blue)
  
  /*thisGuild.roles.create({
  name: 'bluetest',
  reason: 'we needed a role for Super Cool People',
  color: Colors.Blue
});*/
  //console.log(Colors);
 
/*for (let i = 0; i < Colors.length; i += chunkSize) {
    const chunk = Colors.slice(i, i + chunkSize);
    console.log('chunk------');
    for (const key in chunk){
            console.log(`${key}: ${chunk[key]}`);}
    // do whatever
}*/


  //chunk.forEach(colorPair => {
  //  console.log(`{colorPair[0]}=`);
  //}); 
  /*for (const col in chunk){
    //msgChunk.react('1️⃣');
    console.log(`${listOfReactions[col]}${col}=[${chunk[col][0]}|${chunk[col][1]}]`);
    Promise.resolve(chunkedMsg.react(listOfReactions[col]));
  }*/



  


  //await msg.react('👍');
  //console.log('Reaction added!');

  // ✅ Clean shutdown after finishing work
  //client.destroy();
  //console.log('Bot shut down.');
});

client.login(token);

