import {describe,it,expect} from 'vitest';
import {createGame,advance,EVENTS,applyChoice,endingCatalog,legendary,makeEnding,ALL_EVENTS,cohortSummary,mortality,canChoose,nextAvailableEvent,progress,careers,type State,type Event} from './engine';
import {remainingLifeExpectancy} from './mortality';
import {serialize,deserialize} from './save';
import {play,gameplaySummary} from './simulation';
const event=(id:string)=>EVENTS.find(e=>e.id===id)!;
function adult(age=40):State {const s=createGame(42);s.age=age;s.career='国家IT技術者';s.flags=['recruited','interviewed'];return s;}
function outcome(s:State,e:Event,index:number,want=true):State {
  // Transition witness only: find RNG state without bypassing eligibility/effects.
  for(let seed=0;seed<200000;seed++){const r=applyChoice({...s,seed},e,index);if(r.success===want)return r.state;}
  throw Error('No outcome witness');
}
describe('time, prerequisites and common origin',()=>{
  it('allows actual high risk choice at 15, rejects 14',()=>{
    const s={...createGame(1),age:15};const r=applyChoice(s,event('early'),3);
    expect(r.state.history.at(-1)?.age).toBe(15);expect(()=>applyChoice({...s,age:14},event('early'),3)).toThrow();
  });
  it('retains childhood choices and gates adult echoes',()=>{
    const s=outcome({...createGame(2),age:6},event('school'),0);
    const grown={...s,age:26,career:'国家IT技術者',flags:[...s.flags,'recruited','interviewed']};
    expect(applyChoice(grown,event('child-echo'),0).state.history).toHaveLength(3);
    expect(()=>applyChoice({...grown,flags:['recruited','interviewed']},event('child-echo'),0)).toThrow();
  });
  it('requires recruitment before AI interview and records failed interview too',()=>{
    const s={...createGame(4),age:19};expect(()=>applyChoice(s,event('interview'),0)).toThrow();
    const hired=applyChoice({...s,age:17},event('recruit'),0).state;expect(hired.career).toBe('国家IT技術者');
    const failed=outcome({...hired,age:19},event('interview'),0,false);expect(failed.flags).toContain('interviewed');
  });
  it('cannot repeat a choice or mutate a dead life',()=>{
    const s=applyChoice({...createGame(1),age:15},event('early'),0).state;
    expect(()=>applyChoice(s,event('early'),0)).toThrow();
    const dead=advance(s,120);expect(dead.alive).toBe(false);expect(nextAvailableEvent(dead)).toBeUndefined();expect(advance(dead,30)).toBe(dead);
    expect(()=>applyChoice(dead,event('old'),0)).toThrow();expect(()=>makeEnding(s)).toThrow();
  });
  it('skips expired events and never repeats resolved ordinary crossroads',()=>{
    expect(progress(adult(111)).alive).toBe(false);
    const old=applyChoice(adult(75),event('old'),2).state;
    expect(()=>applyChoice(old,event('old'),2)).toThrow();expect(()=>applyChoice({...old,age:76},event('old'),2)).toThrow();
    expect(()=>applyChoice({...old,age:80},event('old'),2)).toThrow();
    expect(()=>applyChoice({...adult(80),flags:[...adult(80).flags,'event:old:75']},event('old'),2)).toThrow();
  });
  it('covers infancy and rejects invalid time travel',()=>{
    const s=createGame(1);s.seed=1972;expect(advance(s,1).age).toBe(.5);
    expect(()=>advance(s,-1)).toThrow();expect(()=>advance(s,1.5)).toThrow();
  });
  it('has unique events and a legal fallback for every event',()=>{
    expect(new Set(ALL_EVENTS.map(e=>e.id)).size).toBe(ALL_EVENTS.length);
    for(const e of ALL_EVENTS)expect(e.choices.some(c=>!c.requires&&!c.minimum&&!c.residentYears)).toBe(true);
  });
});
describe('late life and rare transitions',()=>{
  it('models marriage, children, divorce, care and inheritance',()=>{
    let s=outcome(adult(35),event('marriage'),0);expect(s.familyStatus).toBe('married');
    s=outcome(s,event('child'),0);expect(s.children).toBe(1);
    s=outcome({...s,age:60},event('grandchild'),0);expect(s.grandchildren).toBe(1);
    s=outcome(s,event('divorce'),1);expect(s.familyStatus).toBe('divorced');expect(s.flags).not.toContain('partner');
    s=applyChoice({...s,age:70},event('inheritance'),0).state;expect(s.flags).toContain('will');
    expect(applyChoice({...s,age:75},event('care'),0).state.family).toBeGreaterThanOrEqual(0);
  });
  it('tracks bereavement and prevents later partner events',()=>{
    let s=outcome(adult(35),event('marriage'),0);s=outcome({...s,age:70},event('bereavement'),0,false);
    expect(s.familyStatus).toBe('widowed');expect(s.flags).not.toContain('partner');
  });
  it('enforces migration, residence and nationality before political candidacy',()=>{
    const s=adult(40);s.stats.language=100;s.stats.ethics=100;
    expect(()=>applyChoice(s,event('naturalize-fr'),0)).toThrow();s.flags.push('resettled');
    let fr=outcome(s,event('legal-move'),1);expect(fr.country).toBe('フランス');
    expect(canChoose(fr,event('naturalize-fr').choices[0])).toBe(false);
    fr=outcome({...fr,age:45},event('naturalize-fr'),0);expect(fr.flags).toContain('france_citizen');
    expect(()=>applyChoice(fr,event('legend-paris'),0)).toThrow();
  });
  it.each([
    ['legend-leader','北朝鮮',['fictional_succession_reform'],'L-01'],
    ['legend-nintendo','日本',['japan_legal','game_portfolio'],'L-02'],
    ['legend-paris','フランス',['france_citizen','paris_resident','paris_council'],'L-03-P'],
    ['legend-nyc','米国',['us_citizen','nyc_resident','nyc_campaign'],'L-03-N'],
  ])('%s has a winning transition and continues living',(id,country,flags,achievement)=>{
    const s=adult(60);s.country=country as string;s.flags.push(...flags as string[]);
    for(const k of Object.keys(s.stats))s.stats[k as keyof State['stats']]=100;
    const won=outcome(s,event(id as string),0);
    expect(won.achievements).toContain(achievement);expect(won.alive).toBe(true);expect(won.ending).toBeUndefined();
    const retired=applyChoice(won,event('retire'),0).state;expect(retired.achievements).toContain(achievement);
    expect(advance(retired,120).ending?.facts.achievements).toContain(achievement);
  });
  it('all careers have an executable eligible successful choice',()=>{
    const produced=new Set(['学生']);
    for(const e of EVENTS)for(let index=0;index<e.choices.length;index++){
      const c=e.choices[index];if(!c.career)continue;
      const s=adult(e.min);s.flags=[...new Set([...(e.requires??[]),...(c.requires??[])])];s.country=e.countries?.[0]??c.countries?.[0]??'北朝鮮';
      for(const k of Object.keys(s.stats))s.stats[k as keyof State['stats']]=100;
      produced.add(outcome(s,e,index).career);
    }
    expect([...produced].sort()).toEqual([...careers].sort());
  });
});
describe('endings, persistence and population',()=>{
  it('585 IDs map from consistent fact states (not 585 sampled lives)',()=>{
    expect(endingCatalog).toHaveLength(585);expect(legendary).toHaveLength(4);
    const ids=new Set<string>();
    for(const entry of endingCatalog){const s=adult(80);s.alive=false;s.career=entry.career;s.familyStatus=entry.familyStatus;s.stats.wealth=entry.wealthBand*20+5;if(s.career==='学生')s.age=12.5;ids.add(makeEnding(s).id);}
    expect(ids.size).toBe(585);expect(endingCatalog.some(e=>e.career==='学生'&&e.familyStatus!=='single')).toBe(false);
  });
  it('restores live/dead state, RNG and ending exactly; rejects corrupt saves',()=>{
    const s=applyChoice({...createGame(100),age:15},event('early'),1).state;
    expect(deserialize(serialize(s))).toEqual(s);expect(advance(deserialize(serialize(s)),10)).toEqual(advance(s,10));
    const dead=play(42);expect(deserialize(serialize(dead))).toEqual(dead);
    expect(()=>deserialize('{bad')).toThrow();expect(()=>deserialize(JSON.stringify({...s,version:1}))).toThrow();
    expect(()=>deserialize(JSON.stringify({...s,stats:{...s.stats,health:500}}))).toThrow();
  });
  it('replays an entire life with the same seed and policy',()=>{expect(play(12345)).toEqual(play(12345));expect(play(12345)).not.toEqual(play(54321));});
  it('calibrates period e0 and distinguishes conditional remaining years',()=>{
    expect(remainingLifeExpectancy()).toBeCloseTo(72.6,8);expect(remainingLifeExpectancy(15)+15).toBeGreaterThan(72.6);
    const x=cohortSummary(100000,123);expect(Math.abs(x.birthMean-72.6)).toBeLessThan(4*x.standardError);
    expect(x.remainingAt15).toBeCloseTo(x.conditional15Mean-15,8);expect(x.infantRate).toBeGreaterThan(.005);expect(x.infantRate).toBeLessThan(.08);
  });
  it('reflects age, health, migration and confinement in mortality',()=>{
    expect(mortality(85)).toBeGreaterThan(mortality(65));expect(mortality(65)).toBeGreaterThan(mortality(45));expect(mortality(65,30)).toBeGreaterThan(mortality(65,80));
    expect(mortality(65,70,'日本')).toBeLessThan(mortality(65));expect(mortality(65,70,'北朝鮮',undefined,['imprisoned'])).toBeGreaterThan(mortality(65));expect(mortality(119)).toBe(1);
  });
  it('detects population regressions in actual gameplay',()=>{
    const r=gameplaySummary(300,9001);
    expect(r.meanDeathAge).toBeGreaterThan(45);expect(r.meanDeathAge).toBeLessThan(90);expect(r.recruitedRate).toBeGreaterThan(.75);expect(r.interviewedRate).toBeGreaterThan(.7);
    expect(r.legendaryRate).toBeLessThan(.02);expect(Object.keys(r.careerCounts).length).toBeGreaterThan(15);
  },60000);
});
