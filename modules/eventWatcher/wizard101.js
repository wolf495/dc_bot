//const { Client, Partials, Events, GatewayIntentBits,MessageFlags,EmbedBuilder } = require('discord.js');
//const { token,announceMsg } = require('../../config.json');
//const path = require('node:path');
//const process = require('process');
//const { link } = require('node:fs');

import { Client, Partials, Events, GatewayIntentBits,MessageFlags,EmbedBuilder } from 'discord.js';
import config from '../../config.json' with { type: "json" };
import path from 'node:path';
import process from 'process';
//import { link } from 'node:fs';

// Import the http module
import https from 'https';
let out = null

const fetchData = () => {
    return new Promise((resolve, reject) => {
        https.get('https://www.wizard101.com/game/monthly-events-calendar', (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data); // Resolve the Promise with parsed data
            });
        }).on('error', (err) => {
            reject('Error: ' + err.message); // Reject the Promise on error
        });
    });
};







function isToday(date) {
  let today = new Date();
  //const today = new Date("10/07/2025");
  //console.log(`${date.getFullYear()} === ${today.getFullYear()}`)
  //console.log(`${date.getMonth()} === ${today.getMonth()}`)
  //console.log(`${date.getDate()} === ${today.getDate()}`)
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function parseDateRange(str) {
  // Remove suffixes like "st", "nd", "rd", "th" and extra spaces/dashes
  str = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1').replace(/\s*–\s*/g, '-');

  // Split into start and end parts
  let [startStr, endStr] = str.split('-');

  //console.log(`${startStr} AND ${endStr}`)

  if (!endStr){
    endStr = startStr
  }
  // Get possible months and days
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function parsePart(part, fallbackMonth) {
    // Find month name in the part
    const month = monthNames.find(m => part.startsWith(m)) || fallbackMonth;
    const day = parseInt(part.match(/\d+/)?.[0] || '1', 10);
    return { month, day };
  }

  const startPart = parsePart(startStr);
  const endPart = parsePart(endStr, startPart.month);

  // Use current year (or adjust logic if you want dynamic year handling)
  const currentYear = new Date().getFullYear();

  // Construct Date objects
  const startDate = new Date(`${startPart.month} ${startPart.day}, ${currentYear}`);
  const endDate = new Date(`${endPart.month} ${endPart.day}, ${currentYear}`);

  // Handle year rollover (e.g., December–January)
  if (endDate < startDate) {
    endDate.setFullYear(currentYear + 1);
  }

  return { startDate, endDate };
}

// Example usage:
//const range = "September 30th–October 6th";
//const parsed = parseDateRange(range);
//console.log(parsed.startDate, parsed.endDate);



let eventsToAnnounce = [];
let eventsImages = [];
let eventsLinks = [];

(async () => {

  await https.get('https://www.wizard101.com/game/monthly-events-calendar', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        out = data
        //console.log(out)
    });
}).on('error', (err) => {
    console.error('Error: ', err.message);
});

  const globalData = await fetchData();
  //console.log(globalData)
  //html = 
  const res = await fetch("https://www.wizard101.com/game/monthly-events-calendar");
  const html = globalData//await res.text();

  // Match everything between <strong>...</strong>
  const regex = /<strong>(.*?)<\/strong>/gi;
  const regex2 = /<h2><center>(.*?)<\/center><\/h2>/gi;
  const regex3 = /<a href="(.*?)" target=_blank>See Details/gi;
  const regex4 = /akamai.wizard101.com\/image\/free\/Wizard\/C\/Wizard-Society\/Monthly-Calendar\/(.*?)"/gi;
  const matches = [];
  const matches2 = [];
  const matches3 = [];
  const matches4 = [];
  let match;
  let match2;
  let match3;
  let match4;

  while ((match = regex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .trim();
    if (text && !text.includes("Welcome") ) matches.push(text);
  }

  while ((match2 = regex2.exec(html)) !== null) {
    const text = match2[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .replace(/event runs through /gi, "")
      .trim();

    if (text) matches2.push(text);
  }

  while ((match3 = regex3.exec(html)) !== null) {
    const text = match3[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .trim();

    if (text) eventsLinks.push(text);
  }

  while ((match4 = regex4.exec(html)) !== null) {
    const text = match4[1]
      .replace(/<[^>]+>/g, '') // remove any nested HTML
      .trim();

    if (text && eventsImages.indexOf("https://akamai.wizard101.com/image/free/Wizard/C/Wizard-Society/Monthly-Calendar/"+text)==-1) eventsImages.push("https://akamai.wizard101.com/image/free/Wizard/C/Wizard-Society/Monthly-Calendar/"+text);
  }

  const combined = matches.map((_, i) => [matches[i], matches2[i]]);
  //console.log(res);
  console.log(matches);
  console.log(matches2);
  console.log(matches3);
  console.log(matches4);
  //newCombined = []
  for (const event of combined) {
    let eventName=event[0]
    let eventDateRange=event[1]
    eventDateRange.replace(/event runs through /gi, "");
    let parsed = parseDateRange(eventDateRange);
    console.log(`Event: ${eventName} [${parsed.startDate.toLocaleDateString()} - ${parsed.endDate.toLocaleDateString()}]`)
    if(isToday(parsed.startDate)){
        //console.log('ISTODAY')
        eventsToAnnounce.push([eventName,parsed.startDate.toLocaleDateString(),parsed.endDate.toLocaleDateString()])
        //console.log(`Event: ${eventName} [${parsed.startDate.toLocaleDateString()} - ${parsed.endDate.toLocaleDateString()}]`)
    }
    }


  
  //console.log(matches2);
  //console.log(matches4);


 //<a href="https://www.wizard101.com/game/beastmoon-hunt-begins" target=_blank>See Details
})();



const client = new Client({ partials: [Partials.Message, Partials.Reaction],
intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('ready', () => {
    const channel = client.channels.cache.get(config.announceMsg);
    //console.log(eventsToAnnounce);
    if (channel) {
      for (let eventItem in eventsToAnnounce){
         //console.log()
        //console.log(`EVENTITEM TO ANNOUCNE = ${eventsToAnnounce[eventItem][0]}`)
        let thisEventLink = ''
        let thisEventImage = ''
        let searchwordlink = eventsToAnnounce[eventItem][0].replace(' ','-')
        let searchwordImage = eventsToAnnounce[eventItem][0].replace(' ','')
        eventsImages.forEach(linkItem => { 
           let regex1 = new RegExp(searchwordImage);
          if (regex1.test(linkItem)){ thisEventImage = linkItem } });
        eventsLinks.forEach(linkItem => { 
          //console.log(`searchlink=${searchwordlink}`)
           let regex1 = new RegExp(searchwordlink,'i');
          if (regex1.test(linkItem)){ thisEventLink = linkItem } });
        //console.log(thisEventImage)
        //console.log(thisEventLink)
    const exampleEmbed = new EmbedBuilder()
		.setColor(0x800080)
		.setTitle(`🪄 Wizard101 Event 🪄`)
    //.setAuthor({ name: `🪄 Wizard101 Event 🪄`})//, iconURL: 'https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png'})
		.setThumbnail('https://3.bp.blogspot.com/-b_M2qbUfSKM/Thacc1XmQRI/AAAAAAAAAb4/zDGLwmi_xKY/s1600/w101tm2.gif')
		.setImage(`${thisEventImage}`)
    .setURL('https://www.wizard101.com/game/monthly-events-calendar');
    
    if(thisEventLink){
      exampleEmbed.addFields({ name: `${eventsToAnnounce[eventItem][0]}`, value: `${eventsToAnnounce[eventItem][1]} - ${eventsToAnnounce[eventItem][2]}\n[See Details](${thisEventLink})`})
    }else{
      exampleEmbed.addFields({ name: `${eventsToAnnounce[eventItem][0]}`, value: `${eventsToAnnounce[eventItem][1]} - ${eventsToAnnounce[eventItem][2]}`})
    }
    
    channel.send({ embeds: [exampleEmbed] });
      }
	
	
    //channel.send({ embeds: [exampleEmbed] });

      
      //console.log(eventsImages);
      //console.log(eventsLinks);

    } else {
        console.log('Channel not found!');
    }
	client.destroy();
});

client.login(config.token);

