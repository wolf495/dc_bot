import PouchDB from 'pouchdb';
//import fs, { mkdir } from 'fs';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
//import { chdir } from 'process';
import config from '../../config.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initialize(){ let pdb = new PouchDB(config.db_path);return pdb;}

export async function insertDirect(iJsonData){
  let pdb = await initialize()
  try {
    await pdb.post(iJsonData);
    await pdb.close()
    return true
  } catch (err) {
    console.log(err);
    await pdb.close()
    return false
  }
}

export async function updateDirect(iJsonData){
  let pdb = await initialize()
  try{
    let response = await pdb.put(iJsonData);
    return true;
  }catch{ console.log(err);return false;}
}

export async function deleteDirect(ItemId,ItemRev) {
try {
  let pdb = await initialize()
  await pdb.remove(ItemId,ItemRev)
  return true
} catch (err) {
  console.log(err);
  return false;
}
}

export async function getBySubsystem(iSubsystem){
  try {
    let pdb = await initialize()
    let result = await pdb.find({selector: {'subsystem': iSubsystem}});
    return result;
  } catch (err) {console.log(err);}
}

export async function get(){
  try {
    let pdb = await initialize()
    let result = await pdb.allDocs({include_docs: true, attachments: false });
    return result;
  } catch (err) {console.log(err);}
}

export async function exportData(){
  let pdb = await initialize()
  pdb.allDocs({ include_docs: true }).then(function (result) {
      const json = JSON.stringify(result.rows.map(row => row.doc));
      fs.writeFile(__dirname+'/pdbExportData.json', json, (err) => { if (err) throw err;});
    });
  return 0;

}

export async function insertAnime(series,season,episode,title,thumbnail){
  let pdb = await initialize()
  let checkAnime = await getAnime(series)

  if (checkAnime.docs.length == 0 ){
    try {
      await pdb.post({subsystem: 'anime',
                      series: series,
                      season: season ,
                      episode: episode,
                      title: title,
                      announced: false,
                      thumbnail: thumbnail });
      await pdb.close()
      return true
    } catch (err) {
      console.log(err);
      await pdb.close()
      return false
    }
  }else{
    return false
  }
}

export async function updateAnime(series,season,episode,title,thumbnail){
  let pdb = await initialize()
  try{
    let dirtyRecord = await pdb.find({selector: {'series': series}});
    if (dirtyRecord.docs.length > 0){
    dirtyRecord.docs[0].season = season
    dirtyRecord.docs[0].episode = episode
    dirtyRecord.docs[0].title = title
    dirtyRecord.docs[0].announced = true
    dirtyRecord.docs[0].thumbnail = thumbnail
    let response = await updateDirect(dirtyRecord.docs[0]);
    return true;
    } else {
      return false;
    }
  }catch(err){ console.log(err);return false;}
}

export async function getAnime(series){
  try {
    let pdb = await initialize()
    let result = await pdb.find({selector: {'series': series}});
    return result;
  } catch (err) {console.log(err);}
}

export async function deleteAnime(series) {
try {
  let pdb = await initialize()
  let anime = await getAnime(series)
  if (anime.docs.length > 0){
    //console.log(anime.docs[0]._id)
    //console.log(anime.docs[0]._rev)
    return await deleteDirect(anime.docs[0]._id,anime.docs[0]._rev)
    //return true;
    //console.log(`attempt to remove ${ItemId}`)
  //  result = await pdb.remove(ItemId,ItemRev);
  }else{
    return false;
  }
} catch (err) {
  console.log(err);
}
}

/*
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
*/

/*
export async function pdbShowCreate(showObj){
  let pdb = await pdbInit()
  await pdb.post(showObj);
  /*try {

    if (showObj._id){const doc = await db.get(showObj._id);}

    if (doc){
      const response = await pdb.put({
        _id: showObj._id,
        _rev: showObj._rev,
        series: showObj.series,
        season: showObj.season,
        episode: showObj.episode,
        title: showObj.title,
        subsystem: showObj.subsystem,
        announced: showObj.announced
      });
    }else{
      await pdb.post(showObj);
    }
    
  } catch (err) {console.log(err); return false}
}

*/


  //const origDir = process.cwd()
  //console.log(`PDB.js_DIR=${process.cwd()}\nPDB.js_PATH=${config.db_path}`)
  //if (!fs.existsSync(config.db_path))
  //  fs.mkdirSync(config.db_path, { recursive: true });
  //chdir(config.db_path)
  //await pdb.setPassword(pdbPass);
  //chdir(origDir);