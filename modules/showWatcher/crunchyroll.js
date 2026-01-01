import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change the working directory
//chdir(__dirname);
import * as pdb from "../database/pdb.js";
//import PouchDB from 'pouchdb';
//import fs from 'fs';
//import comdb from 'comdb';

import { spawn } from 'child_process';
//const pythonProcess = 



function runCommand(command, args, useShell=false) {
    return new Promise((resolve, reject) => {
        let child = null, output = '', errorOutput = '';
        if (useShell){child = spawn(command,args, { shell: true });}
        else{child = spawn(command,args);}
        child.stdout.on('data', (data) => {output += data.toString();});
        child.stderr.on('data', (data) => {errorOutput += data.toString();});
        child.on('exit', (code) => {
            if (code === 0) {resolve(output)}
            else {
                if(command.toLowerCase().includes('nssm')){resolve(`${code}`)}
                else{reject(new Error(`${code}: ${errorOutput}`));}
            }
        });
    });
}

async function mainfunc(){
    //await pdbInsert({subsystem: 'anime' ,series: 'My Dress-Up Darling',season: 2 ,episode: 23,title: 'test title'})
    //await pdbInsert({subsystem: 'anime' ,series: 'the apothecary diaries',season: 2 ,episode: 47,title: 'test title'})
    //await pdbInsert({subsystem: 'anime' ,series: 'The Rising of the Shield hero',season: 4 ,episode: 11,title: 'test title'})
    let all = await pdbGetAll('anime')
    console.log(JSON.stringify(all))
}

async function updateFunc(){
    console.log('update something')
    console.log(process.argv[3])
    let newDub = JSON.parse(process.argv[3])
    const response = await pdbUpdate(newDub)
}

async function insertFunc(){
    console.log('insert something')
    console.log(process.argv[3])
    let newDub = JSON.parse(process.argv[3])
    const response = await pdbInsert(newDub)
}

async function test(){
    console.log('js test print')
    let pythonProcess = await runCommand('python', ['crunchyroll.py','test']);
    console.log(pythonProcess)//.on('data', (data) => {
    //console.log(data.toString());
//});
}

async function insertAnime(){
    //console.log('insert something')
    //console.log(process.argv[3])
    let newDub = JSON.parse(process.argv[3])
    const response = await pdbInsert(newDub)
}

async function checkAnimes(){
    let allAnime = await pdb.getBySubsystem('anime')
    for (let index in allAnime.docs){
        let anime = allAnime.docs[index]
        //console.log(anime)
        let LastDub = JSON.parse(await runCommand('python', ['crunchyrollApi.py',anime.series]))
        if (LastDub.season_number != anime.season || LastDub.episode_number != anime.episode){
            await runCommand('node',['../bot/embedAnnounce.js',`S${LastDub.season_number}E${LastDub.episode_number}:${LastDub.title}`,`${LastDub.season_title.split("Season")[0]}`,LastDub.images.thumbnail[0].url,`https://www.crunchyroll.com/watch/${LastDub.id}/${LastDub.slug}`,'F47521','🔥 NEW Dubbed Episode 🔥','https://www.crunchyroll.com/discover','https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png'])
            await pdb.updateAnime(anime.series,LastDub.season_number,LastDub.episode_number,LastDub.title,LastDub.images.thumbnail[0].url)
        }
    }
}

async function addAnime(){
    try{
        console.log(`try to add: [${process.argv[3]}]`)
        let LastDub = JSON.parse(await runCommand('python', ['crunchyrollApi.py',process.argv[3]]))
        //console.log(LastDub)
        //series,season,episode,title,thumbnail
        await pdb.insertAnime(LastDub.series_slug.replace('-',' '),LastDub.season_number,LastDub.episode_number,LastDub.title,LastDub.images.thumbnail[0].url)
        await runCommand('node',['../bot/embedAnnounce.js',`S${LastDub.season_number}E${LastDub.episode_number}:${LastDub.title}`,`${LastDub.season_title.split("Season")[0]}`,LastDub.images.thumbnail[0].url,`https://www.crunchyroll.com/watch/${LastDub.id}/${LastDub.slug}`,'F47521','🔥 NEW Dubbed Episode 🔥','https://www.crunchyroll.com/discover','https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png'])
        await pdb.updateAnime(LastDub.series_slug.replace('-',' '),LastDub.season_number,LastDub.episode_number,LastDub.title,LastDub.images.thumbnail[0].url)
    } catch{
        console.log('no series found')
    }
    //const response = await insertAnime(newDub)
}

async function deleteAnime(){
    try{
        console.log(`try to add: [${process.argv[3]}]`)
        let LastDub = JSON.parse(await runCommand('python', ['crunchyrollApi.py',process.argv[3]]))
        //console.log(LastDub)
        //series,season,episode,title,thumbnail
        await pdb.insertAnime(LastDub.series_slug.replace('-',' '),LastDub.season_number,LastDub.episode_number,LastDub.title,LastDub.images.thumbnail[0].url)
        await runCommand('node',['../bot/embedAnnounce.js',`S${LastDub.season_number}E${LastDub.episode_number}:${LastDub.title}`,`${LastDub.season_title.split("Season")[0]}`,LastDub.images.thumbnail[0].url,`https://www.crunchyroll.com/watch/${LastDub.id}/${LastDub.slug}`,'F47521','🔥 NEW Dubbed Episode 🔥','https://www.crunchyroll.com/discover','https://logos-world.net/wp-content/uploads/2021/02/Crunchyroll-Symbol.png'])
        await pdb.updateAnime(LastDub.series_slug.replace('-',' '),LastDub.season_number,LastDub.episode_number,LastDub.title,LastDub.images.thumbnail[0].url)
    } catch{
        console.log('no series found')
    }
    //const response = await insertAnime(newDub)
}

//console.log(process.argv)
if (process.argv[2].toLowerCase() == 'add'){
    addAnime()
}
else if (process.argv[2].toLowerCase() == 'check'){
    checkAnimes()
}
else if (process.argv[2].toLowerCase() == 'delete'){
    deleteAnime()
}
/*} else if(process.argv[2].toLowerCase() == 'update') {
    updateFunc()
} else if(process.argv[2].toLowerCase() == 'add') {
    insertFunc()
} else if(process.argv[2].toLowerCase() == 'test') {
    test()
}
*/