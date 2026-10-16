import {createServer} from 'node:http';
import type {Ending} from '../src/engine';
export function createEndingServer(service:(text:string)=>Promise<Ending>) {
  const requests=new Map<string,{count:number;until:number}>();
  return createServer(async(req,res)=>{
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    if(req.url!=='/api/endings'){res.writeHead(404).end('{}');return;}
    if(req.method!=='POST'){res.writeHead(405).end('{}');return;}
    const origin=req.headers.origin;
    if(origin&&origin!==(process.env.APP_ORIGIN??'http://localhost:5173')){res.writeHead(403).end('{}');return;}
    const now=Date.now();for(const [key,value]of requests)if(value.until<=now)requests.delete(key);
    const ip=req.socket.remoteAddress??'local',entry=requests.get(ip)??{count:0,until:now+60000};
    if(entry.count>=10||requests.size>10000){res.writeHead(429).end('{}');return;}
    entry.count++;requests.set(ip,entry);
    if(!req.headers['content-type']?.startsWith('application/json')){res.writeHead(415).end('{}');return;}
    try{
      let size=0;const chunks:Buffer[]=[];
      for await(const chunk of req){size+=chunk.length;if(size>500000){res.writeHead(413).end('{}');return;}chunks.push(Buffer.from(chunk));}
      const ending=await service(Buffer.concat(chunks).toString('utf8'));res.writeHead(200).end(JSON.stringify(ending));
    }catch{res.writeHead(400).end(JSON.stringify({error:'Invalid life or unavailable storage'}));}
  });
}
