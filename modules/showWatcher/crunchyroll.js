import { pdbUpdate,pdbGetAll,pdbInsert } from "../pdb.js";
import PouchDB from 'pouchdb';
import fs from 'fs';
import comdb from 'comdb';


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

if (process.argv[2].toLowerCase() == 'check'){
    mainfunc()
} else if(process.argv[2].toLowerCase() == 'update') {
    updateFunc()
} else if(process.argv[2].toLowerCase() == 'add') {
    insertFunc()
}
