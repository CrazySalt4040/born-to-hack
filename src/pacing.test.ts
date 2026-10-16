import {expect,it} from 'vitest';
import {advance,applyChoice,createGame,nextAvailableEvent,progress,EVENTS} from './engine';
import {serialize,deserialize} from './save';

it('reaches the age-15 crossroads after four meaningful choices, with daily records between them',()=>{
  let s=createGame(42);const seen:string[]=[];
  while(s.alive&&s.age<15){
    s=progress(s);const e=nextAvailableEvent(s)!;
    if(s.age===15)break;
    seen.push(e.id);s=applyChoice(s,e,0).state;
  }
  expect(seen).toEqual(['school','child-inheritance','radio','olympiad']);
  expect(s.age).toBe(15);expect(nextAvailableEvent(s)?.id).toBe('early');
  expect(s.history.filter(h=>h.kind==='daily')).toHaveLength(15);
  expect(progress(s)).toBe(s); // Never chooses at a crossroads.
});
it('daily playback and skipping to a crossroads produce the same saved state',()=>{
  const initial=createGame(42);let s=initial;
  while(s.alive&&!nextAvailableEvent(s))s=advance(deserialize(serialize(s)),1);
  expect(s).toEqual(progress(initial));expect(s.age).toBe(6);
  const logs=s.history.filter(h=>h.kind==='daily');
  expect(logs.every((h,i)=>!i||h.detail!==logs[i-1].detail)).toBe(true);
  expect(initial.history).toHaveLength(1);
});
it('never writes daily records after death or invents family or career milestones',()=>{
  const initial=createGame(1);initial.seed=1972;
  const dead=advance(initial,120);
  expect(dead.age).toBe(.5);expect(dead.history.some(h=>h.kind==='daily')).toBe(false);
  expect(advance(dead,1)).toBe(dead);
  const child=advance(createGame(42),5);
  expect(child.flags).toEqual([]);expect(child.career).toBe('学生');expect(child.children).toBe(0);
});
it('continues the chosen practice through ordinary years without another question',()=>{
  const s=createGame(42);s.age=30;s.flags=['recruited','interviewed'];s.career='国家IT技術者';
  const practice=EVENTS.find(e=>e.id==='practice')!;
  const chosen=applyChoice(s,practice,1).state;
  const later=advance(chosen,1);
  expect(later.alive).toBe(true);expect(later.stats.language).toBe(chosen.stats.language+1);
  expect(later.stats.tech).toBe(chosen.stats.tech);
  expect(()=>applyChoice({...later,age:32},practice,1)).toThrow();
});
