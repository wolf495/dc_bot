import { Client, Partials, Collection, Events, GatewayIntentBits,MessageFlags,EmbedBuilder,Colors } from 'discord.js';
import config from '../../config.json' with { type: "json" };
import getCommands from './util/commandsHelper.js';
import { ReactionRole } from "discordjs-reaction-role";
import { pdbGetAll,pdbInsert,pdbDeleteItem } from "../pdb.js";

const client = new Client({ 
	partials: [Partials.Message,
			   Partials.Reaction],
	intents: [GatewayIntentBits.Guilds,
			  GatewayIntentBits.GuildMessages,
			  GatewayIntentBits.GuildMessageReactions,
			  GatewayIntentBits.MessageContent,] });

//-Funcs-----------
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const chunkObjectProperties = (obj, chunkSize) => {
	//const entries = 
	const chunks = [];
	for (let i = 0; i < Object.entries(obj).length; i += chunkSize) {chunks.push(Object.entries(obj).slice(i, i + chunkSize));}
	return chunks;
};

(async()=>{
	client.commands = await getCommands('i')
})()

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

client.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	const channel = client.channels.cache.get(config.botspam);
  const thisGuild = client.guilds.cache.get(config.guildId);
  const chunkSize = 10;
  let chunkIteration = 1;
  let configuration = [];
  const listOfReactions=['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'
    ,'👋','🤚','🖐','✋','🖖','🫱','🫲','🫳','🫴','🫷'
    , '🫠','😃','😄','😁','😆','😅','😂','🙂','🙃','😇'
  ];
  const chunked = chunkObjectProperties(Colors,chunkSize);

  let all = await pdbGetAll('bot')
  //console.log(all.docs)
  let existingColorConfig = false
  if (all.docs.length>0){
    for (const i in all.docs){
      if (all.docs[i]['type']==='roleconfig'){
        configuration = all.docs[i]['config']
        existingColorConfig = true
      }
      //await pdbDeleteItem(all.docs[i]['_id'],all.docs[i]['_rev'])
    }
    //process.exit(0)
  }

  if (existingColorConfig){
    console.log('EXISTING REACTIONROLE CONFIG')
    //console.log(configuration)
    //process.exit(0)
    new ReactionRole(client, configuration);
  }
  else{
  
  
  chunked.forEach(chunk => {
    let buildString = ''
    for (const col in chunk){
      let test = thisGuild.roles.cache.find(r => r.name === `dg_${chunk[col][0]}`)
      if(test===undefined){
        thisGuild.roles.create({
          name: `dg_${chunk[col][0]}`,
          reason: '',
          color: chunk[col][1]
        });
        
      }
      //test = thisGuild.roles.cache.find(r => r.name === `dg_${chunk[col][0]}`)
      //console.log(+col+(10 * (chunkIteration - 1)))
      let addToConfig = {
				messageId: '',
				reaction: listOfReactions[+col+(10 * (chunkIteration - 1))],
				roleId: thisGuild.roles.cache.find(r => r.name === `dg_${chunk[col][0]}`).id,
			}
      configuration.push(addToConfig)
      buildString += `${listOfReactions[+col+(10 * (chunkIteration - 1))]} = <@&${test.id}>\n`
    }
  let chunkEmbed = new EmbedBuilder()
    .setColor(0x20b2aa)
    .setTitle(`SET USER COLOR ROLES (${chunkIteration})`)
    .setDescription(`${buildString}`);
    //chunkIteration++;
  const chunkedMsg = channel.send({ embeds: [chunkEmbed] });
  //console.log(`BEFORE resolving chunkedMsg: ${chunkIteration}`)
  //console.log(configuration)
  chunkedMsg.then((mssg) => {
    if (chunkIteration > 3){chunkIteration = 1}
    //console.log(`new chunck= ${chunkIteration}`)
    for(let item in configuration){
      if(item >= (chunkIteration-1)*10 && item <= (chunkIteration-1)*10 + 10){
        configuration[item].messageId = mssg.id
      }
    }
    let chunkConfig=configuration.slice((chunkIteration-1)*10,((chunkIteration-1)*10 + 10))
    new ReactionRole(client, chunkConfig);
    //console.log(chunkConfig)
    for (const col in chunk){
      //console.log(`DEBUG: col=${col}|chunkIteration=${chunkIteration}|eq=${+col+(10 * (chunkIteration - 1))}`)
      //console.log(chunkConfig[col])
      Promise.resolve(mssg.react(chunkConfig[col].reaction));
      //console.log('REACTED RESOLVE')
    }
    //console.log(`INC CHUNK from ${chunkIteration}`)
    chunkIteration++
  });
  //console.log(`FOR EACH: INC`)
  chunkIteration++;
  });
//----------------------------------------------------------------------------------------
  //console.log("⏳ Waiting 20 seconds...");
  wait(20000).then(() => {
    pdbInsert({subsystem: 'bot' ,type: 'roleconfig',config: configuration})
    console.log("✅ 20 seconds passed!");
    client.destroy();
    console.log('Bot shut down.');
  });
}

});



client.login(config.token);

/*
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


