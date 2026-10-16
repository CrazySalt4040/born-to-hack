import {expect,it} from 'vitest';
import {createGame,advance,applyChoice,EVENTS,successChance,type State} from './engine';
import {initialClimate,politicalYear,availableCompanions} from './social-world';
import {serialize,deserialize} from './save';
const event=(id:string)=>EVENTS.find(e=>e.id===id)!;
function adult():State{const s=createGame(42);s.age=25;s.seed=0;s.career='国家IT技術者';s.flags=['recruited','interviewed'];return s;}
it('records three or four automatic moments per childhood year without extra choices',()=>{
  let s=createGame(42);
  for(let age=1;age<18;age++){s={...s,seed:0};s=advance(s,1);expect(s.alive).toBe(true);expect(s.history.filter(h=>h.age===age&&h.kind==='daily').length).toBeGreaterThanOrEqual(3);expect(s.history.filter(h=>h.age===age&&h.kind==='daily').length).toBeLessThanOrEqual(4);}
  expect(s.eventIndex).toBe(0);expect(s.flags).toEqual([]);
});
it('political climate is bounded, reproducible and independent of player outcome RNG',()=>{
  const a=adult(),b=adult();b.seed=999;b.stats.loyalty=100;
  for(let i=0;i<300;i++){politicalYear(a);politicalYear(b);expect(a.world).toEqual(b.world);expect(a.world!.law).toBeGreaterThanOrEqual(35);expect(a.world!.surveillance).toBeLessThanOrEqual(65);}
  expect(deserialize(serialize(a))).toEqual(a);
});
it('hidden suspicion and loyalty can cause concrete daily consequences, only domestically',()=>{
  let surveillanceWitness=false,loyaltyWitness=false;
  for(let seed=0;seed<2000;seed++){
    const a=adult(),b=adult();a.world=initialClimate(seed);b.world=initialClimate(seed);a.stats.suspicion=100;b.stats.suspicion=0;
    const ra=politicalYear(a),rb=politicalYear(b);
    if(ra.consequence&&!rb.consequence){expect(a.stats.wealth).toBeLessThan(b.stats.wealth);surveillanceWitness=true;}
    const c=adult();c.world=initialClimate(seed);c.stats.loyalty=100;c.stats.suspicion=0;
    if(politicalYear(c).consequence?.includes('紹介'))loyaltyWitness=true;
    if(surveillanceWitness&&loyaltyWitness)break;
  }
  expect(surveillanceWitness&&loyaltyWitness).toBe(true);
  const abroad=adult();abroad.country='韓国';abroad.stats.suspicion=100;
  for(let i=0;i<100;i++)expect(politicalYear(abroad).consequence).toBeUndefined();
});
it('dating, marriage, children and shared work are explicit choices',()=>{
  let s=adult();expect(()=>applyChoice(s,event('marriage'),0)).toThrow();
  s=applyChoice(s,event('dating'),0).state;expect(s.flags).toContain('dating');
  s.seed=0;s=applyChoice(s,event('marriage'),0).state;expect(s.familyStatus).toBe('married');expect(s.flags).not.toContain('dating');
  s.seed=0;s=applyChoice(s,event('child'),0).state;expect(s.children).toBe(1);
  s.seed=0;s=applyChoice(s,event('household-work'),0).state;expect(s.flags).toContain('dual_income');
  const wealth=s.stats.wealth;s.seed=0;s=advance(s,1);expect(s.stats.wealth).toBeGreaterThanOrEqual(wealth);
});
it('departure records exactly the chosen family groups, and failed departures move nobody',()=>{
  const s=adult();s.familyStatus='married';s.children=1;s.flags.push('partner');
  const c=event('pivot').choices[1];expect(availableCompanions(s)).toHaveLength(4);
  expect(successChance(s,c,['parents','children'])).toBeLessThan(successChance(s,c));
  const moved=applyChoice(s,event('pivot'),1,['parents','children']).state;
  expect(moved.country).toBe('韓国');expect(moved.journey?.accompanied).toEqual(['parents','children']);expect(moved.journey?.leftBehind).toEqual(['siblings','spouse']);
  expect(deserialize(serialize(moved))).toEqual(moved);
  let failed:State|undefined;
  for(let seed=0;seed<2000;seed++){const r=applyChoice({...s,seed},event('pivot'),1,['parents']);if(!r.success){failed=r.state;break;}}
  expect(failed?.country).toBe('北朝鮮');expect(failed?.journey?.accompanied).toEqual([]);
  expect(()=>applyChoice(adult(),event('pivot'),1,['spouse'])).toThrow();
  expect(()=>applyChoice(s,event('pivot'),0,['parents'])).toThrow();
});
it('loads legacy saves without inventing a political or family history',()=>{
  const old=adult();delete old.world;const loaded=deserialize(serialize(old));expect(loaded.world).toBeUndefined();expect(advance(loaded,1).world).toBeDefined();
  expect(()=>deserialize(JSON.stringify({...old,world:{seed:1,surveillance:999,law:50,headline:''}}))).toThrow();
});
