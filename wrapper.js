import process, { argv } from 'process';
import { spawn } from 'child_process';
import { pdbUpdate,pdbGetAll,pdbInsert,pdbDeleteItem,pdbTest,pdbUpdate2 } from "./modules/pdb.js";

process.removeAllListeners('warning');
const rootDir = process.cwd()
const botDir = rootDir+'\\modules\\bot'
const cruDir = rootDir+'\\modules\\showWatcher' 
const wizDir = rootDir+'\\modules\\eventWatcher'
const nsmDir = rootDir+"\\modules\\resources\\nssm\\win64"
const services = []
const tabs = []

function log(str){
    let tabStr = tabs.join('')
    console.log(`${tabStr}${str}`)
}
function tab(){
    tabs.push('\t')
}
function untab(){
    tabs.pop()
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runCommand(command, args, useShell=false) {
    return new Promise((resolve, reject) => {
        //let args2 = ['/user:Administrator'].concat(command).concat(args)
        //console.log(command.concat(',').concat(args))
        let child = null
        if (useShell){
            child = spawn(command,args, { shell: true });
        }else{
            child = spawn(command,args);
        }
        
        //const child = spawn('runas',args);

        let output = '';
        let errorOutput = '';

        // Collect output from the child process
        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Resolve promise when the child process exits
        child.on('exit', (code) => {
            if (code === 0) {
                resolve(output)
            } else {
                if(command.toLowerCase().includes('nssm')){
                    //console.log(errorOutput)
                    resolve(`${code}`)
                }else{
                    reject(new Error(`${code}: ${errorOutput}`));
                }
                //resolve(code);
                //
            }
        });
    });
}

async function helperBot(mode){
    tab();log('~ Bot:Start ~')
    process.chdir(nsmDir)
    let exec = await runCommand('nssm.exe',['status','_dcbotRunner']);
    let execstr = exec.replace(/\s+/g, '').replace(/\x00/g, '');  // Trimming whitespace
    if (exec == '3'){
        log('- Install Service')
        exec = await runCommand('nssm.exe',['install','_dcbotRunner',`${botDir}\\start.bat`]);
        execstr = exec.replace(/\s+/g, '').replace(/\x00/g, '');
    }
    if (execstr === 'SERVICE_STOPPED' && mode === 'on'){
        log('- Start Service')
        exec = await runCommand(`${nsmDir}\\nssm_shrt.lnk`,['start','_dcbotRunner'],true);
    }else if (execstr === 'SERVICE_RUNNING' && mode === 'off'){
        log('- Stop Service')
        exec = await runCommand(`${nsmDir}\\nssm_shrt.lnk`,['stop','_dcbotRunner'],true);
    }else if (execstr === 'SERVICE_RUNNING' && mode === 'on'){
        log('- Service already Running')
    }else if (execstr === 'SERVICE_STOPPED' && mode === 'off'){
        log('- Service already stopped')
    }
    log('~ Bot:End ~');untab()
}

async function helperCrunchyroll(mode){
    tab();log('~ Crunchyroll:Start ~')
    process.chdir(cruDir)
    if (mode === 'check'){
        let exec = await runCommand('python',['crunchyroll.py','check']);
        log(exec)
    }
    log('~ Crunchyroll:End ~');untab()
}

async function helperWizard101(mode){
    tab();log('~ wizard101:Start ~')
    process.chdir(wizDir)
    if (mode === 'check'){
        let exec = await runCommand('node',['wizard101.js']);
        log(exec)
    }
    log('~ wizard101:End ~');untab()
}

async function helperPdb(mode){
    tab();log('~ Pdb:Start ~')
    process.chdir(wizDir)
     //var all = null
    if (mode === 'check'){
        //console.log(process.argv.length)
        if (process.argv.length>=5){
            //console.log(Array.from(process.argv[4]))

            var all = await pdbGetAll(process.argv[4])
            for (var item in all.docs){
            //for(var item2 in all.docs[item]){
                console.log(all.docs[item])
                //if (item2 == 'doc'){
                    //all.rows[item]['doc']['announced']=true
                    //all.rows[item]['doc']['subsystem']='anime'
                  //  console.log(all.rows[item]['doc'])
                    //await pdbUpdate2(all.rows[item]['doc'])

                //}
            //}
            //console.log('THING=',all.rows[item])
            
        }
        }else{
            var all = await pdbGetAll()
            for (var item in all.rows){
            for(var item2 in all.rows[item]){
                //console.log(item2)
                if (item2 == 'doc'){
                    //all.rows[item]['doc']['announced']=true
                    //all.rows[item]['doc']['subsystem']='anime'
                    console.log(all.rows[item]['doc'])
                    //await pdbUpdate2(all.rows[item]['doc'])

                }
            }
            //console.log('THING=',all.rows[item])
            
            }
        }
        //await wait(1000)
        //console.log(all)
        
        //console.log(JSON.stringify(all))
    }else if (mode === 'delete'){
        let all = await pdbDeleteItem(process.argv[4],process.argv[5])
        console.log(all)
        //console.log(JSON.stringify(all))
    }else if (mode === 'test'){
        let all = await pdbTest()
        console.log(all)
        //console.log(JSON.stringify(all))
    }else if (mode === 'update'){
        let all = await pdbTest()
        console.log(all)
        //console.log(JSON.stringify(all))
    }
    log('~ Pdb:End ~');untab()
}

(async()=>{
log('~~ wrapper:Start ~~')
if (process.argv.length<4){
    log('bad exit. not enough args')
    process.exit(1);
}
if (process.argv[2].toLowerCase() == 'bot'){
    await helperBot(process.argv[3].toLowerCase())
} else if(process.argv[2].toLowerCase() == 'crunchyroll') {
    await helperCrunchyroll(process.argv[3].toLowerCase())
} else if(process.argv[2].toLowerCase() == 'wizard101') {
    await helperWizard101(process.argv[3].toLowerCase())
}else if(process.argv[2].toLowerCase() == 'pdb') {
    await helperPdb(process.argv[3].toLowerCase())
}

log('~~ wrapper:End ~~')
})()

