import PouchDB from 'pouchdb';
import fs from 'fs';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change the working directory



const pdbPath = '../localDB/my_databasetest';
//console.log(`PDB.js_DIR=${process.cwd()}\nPDB.js_PATH=${pdbPath}`)

export async function pdbInit(){
  chdir(__dirname);
  let pdb = new PouchDB(pdbPath);
  //await pdb.setPassword(pdbPass);
  return pdb;
}

export async function pdbInsert(iVal){
  let pdb = await pdbInit()
  try {
    await pdb.post(iVal);
    await pdb.close()
    return true
  } catch (err) {
    console.log(err);
    await pdb.close()
    return false
  }
}

export async function pdbUpdate(newDub){
  let pdb = await pdbInit()
  try {
    const response = await pdb.put({
        _id: newDub._id,
        _rev: newDub._rev,
        series: newDub.series,
        season: newDub.season,
        episode: newDub.episode,
        title: newDub.title,
        subsystem: newDub.subsystem
    });
  } catch (err) {
    console.log(err);
    return false
  }
}

export async function pdbUpdate2(obj){
  let pdb = await pdbInit()
  try {
    const response = await pdb.put(obj);
  } catch (err) {
    console.log(err);
    return false
  }
}

export async function pdbGetAll(iSubsystem) {
try {
  let pdb = await pdbInit()
  let result = null
  if (iSubsystem){
    //console.log(`PDB: check subsystem ${iSubsystem}\n${process.cwd()}`)
    result = await pdb.find({
      selector: {'subsystem': iSubsystem}
    });
    //console.log(result)
  } else{
    result = await pdb.allDocs({
      include_docs: true,
      attachments: false
    });
  }
  //await pdb.close()
  return result;
} catch (err) {
  console.log(err);
}
}

export async function pdbDeleteItem(ItemId,ItemRev) {
try {
  let pdb = await pdbInit()
  let result = null
  if (ItemId){
    console.log(`attempt to remove ${ItemId}`)
    result = await pdb.remove(ItemId,ItemRev);
  }
  
  return result;
} catch (err) {
  console.log(err);
}
}

export async function pdbTest() {
 let pdb = await pdbInit()
  try {
    await pdb.post({
    title: 'test'
  });
    return true
  } catch (err) {
    console.log(err);
    return false
  }

}

export async function pdbExport(){
  let pdb = await pdbInit()
  pdb.allDocs({ include_docs: true }).then(function (result) {
      const json = JSON.stringify(result.rows.map(row => row.doc));
      // Save json to a file
      //downloadJSON(docs, 'my_database_export.json');
      fs.writeFile('data.json', json, (err) => {
          if (err) throw err;
          console.log('File has been saved!');
      });
    });
  return 0;

}