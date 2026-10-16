import {random, mixSeed} from './random';
import {mortality, type Risks} from './mortality';
import {EVENTS as ORIGINAL, SUPPLEMENTAL_EVENTS} from './legacy-events';
import {buildEvents} from './life-events';
export {random, mortality, SUPPLEMENTAL_EVENTS};
export type Stat = 'tech'|'language'|'network'|'loyalty'|'suspicion'|'health'|'wealth'|'ethics'|'creativity'|'politics';
export const statNames: Stat[] = ['tech','language','network','loyalty','suspicion','health','wealth','ethics','creativity','politics'];
export type FamilyStatus = 'single'|'married'|'divorced'|'widowed';
export type State = {
  version:3; age:number; birthYear:number; alive:boolean; stats:Record<Stat,number>;
  flags:string[]; history:{age:number;title:string;detail:string}[]; career:string; country:string;
  family:number; familyStatus:FamilyStatus; children:number; grandchildren:number;
  risks:Risks; retired:boolean; residenceSince:number; eventIndex:number; seed:number;
  ending?:Ending; achievements:string[];
};
export type Choice = {
  text:string; description?:string; effects?:Partial<Record<Stat,number>>; flags?:string[];
  removeFlags?:string[]; requires?:string[]; minimum?:Partial<Record<Stat,number>>;
  countries?:string[]; residentYears?:number; base?:number; risk?:number;
  success?:string; failure?:string; career?:string; country?:string;
  familyStatus?:FamilyStatus; children?:number; grandchildren?:number; family?:number;
  risks?:Partial<Risks>; retired?:boolean; failureFlags?:string[]; failureCareer?:string;
  successEffects?:Partial<Record<Stat,number>>; failureFamilyStatus?:FamilyStatus;
};
export type Event = {id:string;min:number;max:number;title:string;story:string;choices:Choice[];requires?:string[];excludes?:string[];countries?:string[];repeat?:number;priority?:number;deferUntilQualified?:boolean};
export type Ending = {id:string;title:string;story:string;rarity:'normal'|'rare'|'legendary';career:string;age:number;facts:EndingFacts;source:'template'|'ai';resolved?:boolean};
export type EndingFacts = {birthYear:number;age:number;career:string;country:string;familyStatus:FamilyStatus;children:number;grandchildren:number;wealth:number;health:number;family:number;retired:boolean;flags:string[];achievements:string[];choices:State['history']};
export const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
export function createGame(seed=Date.now()>>>0):State {
  let n=seed>>>0;const roll=()=>{const v=random(n);n=v[1];return v[0]};
  return {version:3,age:0,birthYear:1998,alive:true,stats:{tech:15+Math.floor(roll()*26),language:5+Math.floor(roll()*20),network:5+Math.floor(roll()*25),loyalty:35+Math.floor(roll()*35),suspicion:0,health:55+Math.floor(roll()*40),wealth:3+Math.floor(roll()*15),ethics:35+Math.floor(roll()*45),creativity:20+Math.floor(roll()*40),politics:5+Math.floor(roll()*20)},flags:[],history:[{age:0,title:'北朝鮮に誕生',detail:'あなたの人生が始まった。'}],career:'学生',country:'北朝鮮',family:50,familyStatus:'single',children:0,grandchildren:0,risks:{nutrition:50,medical:50,stress:0,childhoodHealth:70},retired:false,residenceSince:0,eventIndex:0,seed:n,achievements:[]};
}
export const careers=['国家IT技術者','海外IT請負業者','セキュリティ研究者','ホワイトハッカー','AI研究者','ゲーム開発者','大学教授','起業家','サイバー犯罪組織幹部','情報機関協力者','サイバー防衛専門家','技術顧問','ジャーナリスト','外交官','社会活動家','教育者','作家','翻訳者','政治家','投資家','フリーランス','企業役員','公務員','芸術家','引退した技術者','学生','国家指導者','任天堂クリエイター','パリ市長','ニューヨーク市長'];
const standings=['困窮','質素','安定','富裕','大富豪'];
export const familyStatuses:FamilyStatus[]=['single','married','divorced','widowed'];
export const familyLabels={single:'未婚',married:'既婚',divorced:'離婚後',widowed:'死別後'};
export const flagLabels:Record<string,string>={child_code:'幼い日のプログラミング',child_language:'幼少期の語学',child_friend:'幼なじみとの友情',child_secret:'家族の秘密',nourished:'栄養を守った食卓',lean_childhood:'厳しい幼少期の食生活',family_inheritance:'親族からの遺産',chronic:'慢性疾患',imprisoned:'拘束',disgraced:'失脚',retired:'引退',will:'家族への遺言',charitable_will:'社会への遺贈',memoir:'回想録',game_portfolio:'創作作品',recruited:'国家ITへの配属',interviewed:'AI面接',international_work:'国際案件',resettled:'国外再定住',outside_network:'国外の人脈',state_path:'国家組織での昇進',underground:'犯罪組織との関係',hazardous_work:'危険を伴う仕事',elite:'専門教育',outside_interest:'国外文化への関心',early_contact:'若年期の国外との接点',early_attempt:'早期逃亡の試み',mentor_returned:'恩師との再会',business:'起業',sold_business:'事業売却',partner:'伴侶',parent:'子育て',bereaved:'伴侶との死別',japan_legal:'日本の就労許可',france_resident:'フランスでの合法居住',paris_resident:'パリ居住',france_citizen:'フランス国籍',paris_council:'パリ市議会の議席',us_permanent:'米国永住資格',us_citizen:'米国市民権',nyc_resident:'ニューヨーク居住',nyc_campaign:'ニューヨークでの政治活動',fictional_succession_reform:'架空の継承制度変更',succession:'最高指導部への選出'};
// Career × wealth × marital state are independent. No adult marital endings for students.
export const endingCatalog=careers.flatMap((career,i)=>standings.flatMap((standing,j)=>(career==='学生'?['single'] as FamilyStatus[]:familyStatuses).map(status=>({id:`E3-${String(i+1).padStart(2,'0')}-${j}-${status}`,career,standing,legacy:familyLabels[status],familyStatus:status,wealthBand:j}))));
export const legendary=[{id:'L-01',name:'北朝鮮の総書記',condition:'架空の継承制度変更・国内支持・政治90・忠誠85'},{id:'L-02',name:'任天堂のクリエイター',condition:'日本の合法就労・作品・技術85・語学80・創造85・採用'},{id:'L-03-P',name:'パリ市長',condition:'フランス国籍・パリ居住・市議会・政治90・選出'},{id:'L-03-N',name:'ニューヨーク市長',condition:'米国市民権・NYC居住・政治90・選挙'}];
const legendCareer:Record<string,string>={'国家指導者':'L-01','任天堂クリエイター':'L-02','パリ市長':'L-03-P','ニューヨーク市長':'L-03-N'};
export const eligibleLegendary=(s:State)=>s.achievements[0];
export function endingFacts(s:State):EndingFacts {
  return {birthYear:s.birthYear,age:s.age,career:s.career,country:s.country,familyStatus:s.familyStatus,children:s.children,grandchildren:s.grandchildren,wealth:s.stats.wealth,health:s.stats.health,family:s.family,retired:s.retired,flags:[...s.flags].sort(),achievements:[...s.achievements].sort(),choices:s.history.map(h=>({...h}))};
}
export function factSentences(f:EndingFacts):string[] {
  return [`${f.birthYear}年、北朝鮮に生まれ、${f.age}歳で生涯を閉じた。`,`最後の職業は${f.career}、居住地は${f.country}。${f.retired?'引退していた。':f.career==='学生'?'学びの途中で人生を終えた。':'現役のまま人生を終えた。'}`,`家族関係は${familyLabels[f.familyStatus]}。子ども${f.children}人、孫${f.grandchildren}人。家族との親密さは${f.family}/100だった。`,`資産水準は${f.wealth}/100、最期の健康は${f.health}/100。`,`実績：${f.achievements.map(id=>legendary.find(l=>l.id===id)?.name??id).join('、')||'特別実績なし'}。`,`人生に残った選択：${f.choices.filter(h=>h.title!=='人生の終わり').slice(-4).map(h=>`${h.age}歳「${h.title}」${h.detail.replace(/。$/,'')}`).join('／')}。`,`過去の影響：${f.flags.map(x=>flagLabels[x]).filter(Boolean).join('、')||'記録なし'}。`];
}
export function makeEnding(s:State):Ending {
  if(s.alive)throw Error('A living person has no ending');
  const band=Math.min(4,Math.floor(s.stats.wealth/20));
  const item=endingCatalog.find(x=>x.career===s.career&&x.wealthBand===band&&x.familyStatus===s.familyStatus);
  if(!item)throw Error('Inconsistent ending facts');
  const facts=endingFacts(s);
  return {id:item.id,title:`${item.career} — ${item.standing}・${item.legacy}`,story:factSentences(facts).join('\n'),rarity:s.achievements.length?'legendary':band===4?'rare':'normal',career:s.career,age:s.age,facts,source:'template'};
}
function eventMark(e:Event,age:number){return `event:${e.id}${e.repeat?':'+age:''}`;}
export function isEventEligible(s:State,e:Event) {
  if(!s.alive||s.age<e.min||s.age>e.max)return false;
  if(e.requires?.some(f=>!s.flags.includes(f))||e.excludes?.some(f=>s.flags.includes(f)))return false;
  if(e.countries&&!e.countries.includes(s.country))return false;
  if(e.deferUntilQualified&&!e.choices.slice(0,-1).some(c=>canChoose(s,c)))return false;
  if(e.repeat&&(s.age-e.min)%e.repeat!==0)return false;
  return !s.flags.includes(eventMark(e,s.age));
}
export function canChoose(s:State,c:Choice) {
  return s.alive&&!c.requires?.some(f=>!s.flags.includes(f))&&!(c.countries&&!c.countries.includes(s.country))&&!(c.residentYears!==undefined&&s.age-s.residenceSince<c.residentYears)&&Object.entries(c.minimum??{}).every(([key,n])=>s.stats[key as Stat]>=n);
}
export function successChance(s:State,c:Choice) {
  if(!canChoose(s,c))return 0;
  if(c.base===100)return 100;
  if(c.base!==undefined&&c.base<=3)return c.base*.025;
  return Math.max(1,Math.min(95,Math.round((c.base??80)+s.stats.tech*.1+s.stats.language*.07+s.stats.network*.06-s.stats.suspicion*.16-(s.age<18&&c.risk?c.risk:0))));
}
export function applyChoice(state:State,event:Event,index:number):{state:State;result:string;success:boolean} {
  if(!isEventEligible(state,event))throw Error('Event unavailable');
  const c=event.choices[index];if(!c||!canChoose(state,c))throw Error('Choice unavailable');
  const s=copyState(state);const [roll,seed]=random(s.seed);s.seed=seed;
  const success=roll*100<successChance(s,c);
  for(const [key,value] of Object.entries(c.effects??{}))s.stats[key as Stat]=clamp(s.stats[key as Stat]+value);
  for(const [key,value] of Object.entries(c.risks??{}))s.risks[key as keyof Risks]=clamp(s.risks[key as keyof Risks]+value);
  s.family=clamp(s.family+(c.family??0));
  if(!success){s.stats.suspicion=clamp(s.stats.suspicion+(c.risk??4));s.stats.health=clamp(s.stats.health-(c.risk??0)/4);s.risks.stress=clamp(s.risks.stress+(c.risk??0)/3);if(c.failureCareer)s.career=c.failureCareer;}
  s.flags=[...new Set([...s.flags.filter(f=>!success||!c.removeFlags?.includes(f)),...(success?c.flags??[]:c.failureFlags??[]),eventMark(event,s.age)])];
  if(!success&&c.failureFamilyStatus){s.familyStatus=c.failureFamilyStatus;s.flags=s.flags.filter(f=>f!=='partner');}
  if(success){
    for(const [key,value] of Object.entries(c.successEffects??{}))s.stats[key as Stat]=clamp(s.stats[key as Stat]+value);
    if(c.career){s.career=c.career;s.retired=false;const a=legendCareer[c.career];if(a)s.achievements=[...new Set([...s.achievements,a])];}
    if(c.country&&c.country!==s.country){s.country=c.country;s.residenceSince=s.age;}
    if(c.familyStatus)s.familyStatus=c.familyStatus;
    s.children+=c.children??0;s.grandchildren+=c.grandchildren??0;
    if(c.retired!==undefined)s.retired=c.retired;
  }
  if(s.age<15)s.risks.childhoodHealth=clamp((s.risks.childhoodHealth+s.stats.health)/2);
  s.eventIndex++;
  const result=success?(c.success??'選択は将来に影響を残した。'):(c.failure??'思い通りには進まなかった。');
  s.history.push({age:s.age,title:event.title,detail:`${c.text} — ${result}`});return {state:s,result,success};
}
export function markEvent(s:State,id:string):State{return {...s,flags:[...new Set([...s.flags,'event:'+id])]};}
function copyState(s:State):State{return {...s,stats:{...s.stats},risks:{...s.risks},flags:[...s.flags],history:[...s.history],achievements:[...s.achievements]};}
export function advance(state:State,years:number):State {
  if(!Number.isInteger(years)||years<0)throw Error('Years must be nonnegative integer');
  if(!state.alive)return state;
  const s=copyState(state);
  for(let i=0;i<years&&s.alive;i++){
    const [r,seed]=random(s.seed);s.seed=seed;
    // q_x covers [x,x+1), including infancy. Midpoint death convention.
    if(r<mortality(s.age,s.stats.health,s.country,s.risks,s.flags)){
      s.age+=.5;s.alive=false;s.history.push({age:s.age,title:'人生の終わり',detail:'病気・事故等を含む総死亡リスクの判定により生涯を閉じた。'});s.ending=makeEnding(s);
    }else{s.age++;if(s.age>=55&&s.age%3===0)s.stats.health=clamp(s.stats.health-1);}
  }
  return s;
}
export const EVENTS:Event[]=buildEvents(ORIGINAL,careers);
export const ALL_EVENTS:Event[]=[...EVENTS,...SUPPLEMENTAL_EVENTS].sort((a,b)=>(b.priority??0)-(a.priority??0)||a.min-b.min||a.id.localeCompare(b.id));
export function nextAvailableEvent(s:State){return ALL_EVENTS.find(e=>isEventEligible(s,e));}
export const nextEvent=nextAvailableEvent;
export function progress(state:State):State{let s=state;while(s.alive&&!nextAvailableEvent(s))s=advance(s,1);return s;}
export function simulateLife(seed:number,health=70,country='北朝鮮'):number {
  let n=seed>>>0;for(let age=0;age<120;age++){const [r,next]=random(n);n=next;if(r<mortality(age,health,country))return age+.5;}throw Error('Terminal mortality missing');
}
export function cohortSummary(samples=10000,seed=1){
  if(!Number.isInteger(samples)||samples<1)throw Error('Invalid sample count');
  let sum=0,sum2=0,alive15=0,adultSum=0,infant=0;
  for(let i=0;i<samples;i++){const age=simulateLife(mixSeed(seed+i));sum+=age;sum2+=age*age;if(age<1)infant++;if(age>=15){alive15++;adultSum+=age;}}
  return {birthMean:sum/samples,standardError:Math.sqrt(Math.max(0,sum2/samples-(sum/samples)**2)/samples),conditional15Mean:adultSum/Math.max(1,alive15),remainingAt15:adultSum/Math.max(1,alive15)-15,infantRate:infant/samples,samples};
}
