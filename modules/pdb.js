import PouchDB from 'pouchdb';
import fs from 'fs';
//import comdb from 'comdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
//PouchDB.plugin(comdb);
const pdbPath = 'C:/_DEV/dc_bot/localDB/my_databasetest';
const pdbPass = fs.readFileSync('C:/_DEV/dc_bot/secure_config/configDbPass', 'utf8');
//let pdb = null;

export async function pdbInit(){
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
    result = await pdb.find({
      selector: {'subsystem': iSubsystem}
    });
  } else{
    result = await pdb.allDocs({
      include_docs: true,
      attachments: false
    });
  }
  await pdb.close()
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
