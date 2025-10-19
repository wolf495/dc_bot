const PouchDB = require('pouchdb');
PouchDB.plugin(require('comdb'));
const pdbPath = 'localDB/my_databasetest';
const pdbPass = 'testPass';
let pdb = null;
//let result = null;

async function pdbInit(){
  if(pdb == null){
    pdb = new PouchDB(pdbPath);
    await pdb.setPassword(pdbPass);
  }
  return pdb;
}

async function getDocs() {
try {
  let result = await pdb.allDocs({
    include_docs: true,
    attachments: true
  });
  return result;
} catch (err) {
  console.log(err);
}
}

async function putDoc() {
try {
    console.log('IN PUTDOC')
  const response = await pdb.put({
    _id: 'mydoc4',
    title: 'Heroes'
  });
  console.log(response);
} catch (err) {
  console.log(err);
}
}

pdbInit()
putDoc()
getDocs()