import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {factSentences,makeEnding,type Ending,type State} from '../src/engine';
import {deserialize} from '../src/save';
export type Composer=(sentences:string[])=>Promise<unknown>;
export function composeEnding(state:State,order:unknown):Ending {
  const ending=makeEnding(state),sentences=factSentences(ending.facts);
  if(!Array.isArray(order)||order.length!==sentences.length||new Set(order).size!==sentences.length||order.some(i=>!Number.isInteger(i)||i<0||i>=sentences.length))throw Error('Invalid composition');
  return {...ending,story:order.map(i=>sentences[i]).join('\n'),source:'ai',resolved:true};
}
/** File-backed, content-addressed and single-flight. Fallbacks are cached too. */
export function endingService(directory:string,composer?:Composer){
  const pending=new Map<string,Promise<Ending>>();
  let remainingCalls=Number(process.env.AI_MAX_CALLS??20);
  return async(text:string)=>{
    const state=deserialize(text);
    if(state.alive)throw Error('Life must be complete');
    const base=makeEnding(state);
    const key=createHash('sha256').update(JSON.stringify(base.facts)).digest('hex');
    const existing=pending.get(key);if(existing)return existing;
    const work=(async()=>{
      const path=join(directory,key+'.json');
      try {const cached=JSON.parse(await readFile(path,'utf8'));return deserialize(JSON.stringify({...state,ending:cached})).ending!;}catch{/* Cache absent or invalid: recompute. */}
      let ending:Ending={...base,resolved:true};
      if(composer&&remainingCalls>0){remainingCalls--;try{ending=composeEnding(state,await composer(factSentences(base.facts)));}catch{/* Deterministic fallback. */}}
      await mkdir(directory,{recursive:true});
      await writeFile(path,JSON.stringify(ending),{flag:'wx'}).catch(async error=>{if(error.code!=='EEXIST')throw error;});
      // In a race between processes, the first persisted result wins.
      return deserialize(JSON.stringify({...state,ending:JSON.parse(await readFile(path,'utf8'))})).ending!;
    })();
    pending.set(key,work);
    try{return await work;}finally{pending.delete(key);}
  };
}
