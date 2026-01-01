import * as pdb from "./modules/database/pdb.js";

/*
series: showObj.series,
        season: showObj.season,
        episode: showObj.episode,
        title: showObj.title,
        subsystem: showObj.subsystem,
        announced: showObj.announced
*/

/*
pdb.pdbInsert({     subsystem: 'anime',
                    series: 'My Dress-Up Darling',
                    season: 1 ,
                    episode: 1,
                    title: 'test title',
                    announced: false });
*/


(async()=>{
    //pdb.exportData();
    console.log(await pdb.insertAnime('My Dress-Up Darling',2,1,'test insertAnime'));
    //console.log(await pdb.updateAnime('My Dress-Up Darling',2,1,'test titleUPDATE2'));

    let out = await pdb.get()
    for (let index in out.rows){
        console.log(out.rows[index].doc)
    }

    //console.log(await pdb.deleteAnime('My Dress-Up Darling'))
})()

