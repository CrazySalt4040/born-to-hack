import {expect,it} from 'vitest';
import {createGame,advance,applyChoice,EVENTS,makeEnding} from './engine';
import {setHabits,applyHabits,assetValue,formatMoney,chanceLabel} from './lifestyle';
import {serialize,deserialize} from './save';
it('changing habits costs nothing immediately and persists across reload',()=>{
 const s=createGame(42);const changed=setHabits(s,{time:'exercise',spending:'health'});
 expect(changed.age).toBe(s.age);expect(changed.seed).toBe(s.seed);expect(changed.stats).toEqual(s.stats);expect(s.habits).toBeUndefined();
 expect(deserialize(serialize(changed))).toEqual(changed);
 expect(()=>setHabits({...s,alive:false},{time:'study',spending:'saving'})).toThrow();
});
it('annual habits trade spending for skills, while exercise improves health',()=>{
 const base=createGame(42);base.age=20;base.stats.wealth=20;base.stats.health=50;
 const learner=structuredClone(setHabits(base,{time:'study',spending:'learning'}));
 const saver=structuredClone(setHabits(base,{time:'exercise',spending:'saving'}));
 applyHabits(learner);applyHabits(saver);
 expect(learner.stats.tech).toBeGreaterThan(saver.stats.tech);expect(saver.stats.health).toBeGreaterThan(learner.stats.health);
 expect(assetValue(learner.stats.wealth)).toBeLessThan(assetValue(base.stats.wealth));expect(assetValue(saver.stats.wealth)).toBeGreaterThan(assetValue(base.stats.wealth));
 learner.stats.wealth=0;const tech=learner.stats.tech;applyHabits(learner);expect(learner.stats.wealth).toBe(0);expect(learner.stats.tech).toBe(tech+1);
});
it('habits respect childhood ages, confinement, deterministic annual replay and death',()=>{
 let s=setHabits(createGame(42),{time:'study',spending:'learning'});const original=structuredClone(s);applyHabits(s);expect(s).toEqual(original);
 s.age=6;const w=s.stats.wealth;applyHabits(s);expect(s.stats.wealth).toBe(w);
 s.age=20;s.flags.push('imprisoned');const before=structuredClone(s);applyHabits(s);expect(s).toEqual(before);
 s.flags=[];expect(advance(s,10)).toEqual(advance(deserialize(serialize(s)),10));
 const dead=advance(s,120);expect(advance(dead,2)).toBe(dead);
});
it('presents qualitative likelihood and estimated amounts without numeric probabilities',()=>{
 for(const chance of [0,.075,1,15,40,60,80,95,100])expect(chanceLabel(chance)).not.toMatch(/[0-9%]/);
 expect(chanceLabel(.075)).toContain('奇跡');expect(chanceLabel(100)).toContain('意思');
 expect(assetValue(0)).toBe(0);expect(assetValue(80)).toBeGreaterThan(assetValue(20));expect(formatMoney(assetValue(20))).toContain('$');
});
it('produces event consequences and never awards sale proceeds after rejection',()=>{
 const s=createGame(42);s.age=50;s.career='起業家';s.flags=['recruited','interviewed','business'];
 const e=EVENTS.find(x=>x.id==='sale')!;
 let failed=false,won=false;
 for(let seed=0;seed<3000&&(!failed||!won);seed++){
  const r=applyChoice({...s,seed},e,0);expect(r.result).not.toMatch(/成功：|失敗：|選択は将来に影響/);
  if(r.success){won=true;expect(r.state.flags).toContain('sold_business');expect(r.result).toContain('合意');}
  else{failed=true;expect(r.state.stats.wealth).toBe(s.stats.wealth);expect(r.result).toContain('折り合わず');}
 }
 expect(failed&&won).toBe(true);
});
it('preserves old ending text and uses money in new endings',()=>{
 const old=createGame(42);delete old.moneyDisplay;old.alive=false;old.age=.5;old.ending=makeEnding(old);
 expect(deserialize(serialize(old)).ending?.story).toBe(old.ending.story);
 const modern=createGame(42);modern.alive=false;modern.age=.5;modern.ending=makeEnding(modern);
 expect(modern.ending.story).toContain('ゲーム内換算');expect(deserialize(serialize(modern))).toEqual(modern);
 expect(()=>deserialize(JSON.stringify({...createGame(42),habits:{time:'bogus',spending:'saving'}}))).toThrow();
});
