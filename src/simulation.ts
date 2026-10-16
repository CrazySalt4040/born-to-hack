import {advance,applyChoice,canChoose,createGame,nextAvailableEvent,progress,type State} from './engine';
import {mixSeed,random} from './random';
/** Uniform eligible-action policy with a separate random stream. */
export function play(seed:number):State {
  let s=createGame(seed),policy=mixSeed(seed^0xa5a5a5a5),steps=0;
  while(s.alive){
    if(++steps>1000)throw Error('Progress stalled');
    s=progress(s);if(!s.alive)break;
    const event=nextAvailableEvent(s)!;
    const options=event.choices.map((c,i)=>canChoose(s,c)?i:-1).filter(i=>i>=0);
    if(!options.length){s=advance(s,1);continue;}
    const [roll,next]=random(policy);policy=next;
    s=applyChoice(s,event,options[Math.floor(roll*options.length)]).state;
  }
  return s;
}
export function gameplaySummary(samples=2000,seed=9001){
  let age=0,recruited=0,interviewed=0,legends=0;
  const careerCounts:Record<string,number>={},endings=new Set<string>(),events=new Set<string>();
  for(let i=0;i<samples;i++){
    const s=play(mixSeed(seed+i));age+=s.age;
    if(s.flags.includes('recruited'))recruited++;
    if(s.flags.includes('interviewed'))interviewed++;
    if(s.achievements.length)legends++;
    careerCounts[s.career]=(careerCounts[s.career]??0)+1;
    endings.add(s.ending!.id);s.flags.filter(f=>f.startsWith('event:')).forEach(f=>events.add(f.split(':')[1]));
  }
  return {samples,seed,policy:'uniform eligible choices',meanDeathAge:age/samples,recruitedRate:recruited/samples,interviewedRate:interviewed/samples,legendaryRate:legends/samples,careerCounts,observedEndings:endings.size,observedEvents:events.size};
}
