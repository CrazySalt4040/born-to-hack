import {describe,it,expect,vi} from 'vitest';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {endingService,composeEnding} from './ending-service';
import {createEndingServer} from './http';
import {play} from '../src/simulation';
import {createGame,factSentences} from '../src/engine';
import {serialize,deserialize} from '../src/save';
async function cleanup(dir:string){if(!resolve(dir).startsWith(resolve(tmpdir())+sep+'bth-'))throw Error('Unsafe cleanup path');await rm(dir,{recursive:true,force:true});}
describe('server-only ending composition',()=>{
  it('rejects missing, repeated and invented fact IDs',()=>{
    const dead=play(42);expect(()=>composeEnding(dead,[0,0,0])).toThrow();
    expect(()=>composeEnding(dead,[0,1,2,3,4,5,999])).toThrow();
    const ending=composeEnding(dead,[0,4,1,2,3,5,6]);
    expect(ending.facts).toEqual(dead.ending!.facts);expect(ending.story.split('\n').sort()).toEqual(factSentences(ending.facts).sort());
  });
  it('persists one result across concurrent requests and server restarts',async()=>{
    const dir=await mkdtemp(join(tmpdir(),'bth-cache-'));
    try{
      const composer=vi.fn(async()=>[0,4,1,2,3,5,6]);const service=endingService(dir,composer);const text=serialize(play(42));
      const [a,b]=await Promise.all([service(text),service(text)]);expect(a).toEqual(b);expect(a.source).toBe('ai');expect(composer).toHaveBeenCalledTimes(1);
      expect(await endingService(dir,async()=>[6,5,4,3,2,1,0])(text)).toEqual(a);
      expect(deserialize(JSON.stringify({...play(42),ending:a})).ending).toEqual(a);
    }finally{await cleanup(dir);}
  });
  it('caches template when AI is unavailable or malformed',async()=>{
    const dir=await mkdtemp(join(tmpdir(),'bth-fallback-'));
    try{
      const text=serialize(play(9)),service=endingService(dir,async()=>{throw Error('offline');});
      const e=await service(text);expect(e.source).toBe('template');expect(e.resolved).toBe(true);
      expect(await endingService(dir)(text)).toEqual(e);
      await expect(service(serialize(createGame(1)))).rejects.toThrow();
    }finally{await cleanup(dir);}
  });
  it('serves the actual HTTP endpoint with origin, body and method validation',async()=>{
    const dir=await mkdtemp(join(tmpdir(),'bth-http-'));const server=createEndingServer(endingService(dir));
    await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
    const addr=server.address();if(!addr||typeof addr==='string')throw Error('No port');const url=`http://127.0.0.1:${addr.port}/api/endings`;
    try{
      expect((await fetch(url)).status).toBe(405);
      expect((await fetch(url,{method:'POST',headers:{Origin:'https://wrong.example'}})).status).toBe(403);
      const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:serialize(play(42))});
      expect(response.status).toBe(200);const ending=await response.json();expect(ending.source).toBe('template');expect(ending.resolved).toBe(true);
      expect((await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status).toBe(400);
    }finally{await new Promise<void>((resolve,reject)=>server.close(err=>err?reject(err):resolve()));await cleanup(dir);}
  });
});
