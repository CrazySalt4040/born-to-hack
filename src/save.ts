import {careers, familyStatuses, statNames, makeEnding, factSentences, type State} from './engine';
export const SAVE_KEY='born-to-hack-v3';
const record=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const number=(x:unknown,min:number,max:number)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const strings=(x:unknown)=>Array.isArray(x)&&x.length<=2000&&x.every(v=>typeof v==='string'&&v.length<200);
export function deserialize(text:string):State {
  if(text.length>500000)throw Error('セーブデータが大きすぎます');
  const s:unknown=JSON.parse(text);
  if(!record(s)||s.version!==3)throw Error('v0.3以外のセーブ形式です。旧データは保持されています。');
  if(!number(s.age,0,119.5)||s.birthYear!==1998||typeof s.alive!=='boolean'||!number(s.seed,0,4294967295)||!Number.isInteger(s.seed)||!number(s.eventIndex,0,2000)||!Number.isInteger(s.eventIndex)||!record(s.stats)||!statNames.every(k=>number((s.stats as Record<string,unknown>)[k],0,100))||!record(s.risks)||!['nutrition','medical','stress','childhoodHealth'].every(k=>number((s.risks as Record<string,unknown>)[k],0,100))||!strings(s.flags)||!strings(s.achievements)||!careers.includes(s.career as string)||!['北朝鮮','韓国','日本','フランス','米国'].includes(s.country as string)||!familyStatuses.includes(s.familyStatus as State['familyStatus'])||!number(s.family,0,100)||!number(s.children,0,10)||!number(s.grandchildren,0,20)||!Number.isInteger(s.children)||!Number.isInteger(s.grandchildren)||!number(s.residenceSince,0,s.age as number)||typeof s.retired!=='boolean'||!Array.isArray(s.history)||s.history.length>2000||!s.history.every(h=>record(h)&&number(h.age,0,s.age as number)&&typeof h.title==='string'&&h.title.length<=200&&typeof h.detail==='string'&&h.detail.length<=2000))throw Error('セーブデータが破損しています');
  const state=s as unknown as State;
  if(state.alive&&!Number.isInteger(state.age))throw Error('Invalid living age');
  if(state.history.some((h,i)=>i>0&&h.age<state.history[i-1].age))throw Error('Invalid chronology');
  if(state.career==='学生'&&state.familyStatus!=='single')throw Error('Invalid family');
  if(state.grandchildren&&!state.children)throw Error('Invalid descendants');
  if(state.alive&&state.ending)throw Error('Invalid ending');
  if(!state.alive){
    const expected=makeEnding(state);
    if(!state.ending||state.ending.id!==expected.id||JSON.stringify(state.ending.facts)!==JSON.stringify(expected.facts))throw Error('Ending facts mismatch');
    const lines=state.ending.story.split('\n'),allowed=factSentences(expected.facts);
    if(lines.length!==allowed.length||new Set(lines).size!==allowed.length||lines.some(l=>!allowed.includes(l)))throw Error('Ending prose mismatch');
    state.ending={...expected,story:state.ending.story,source:state.ending.source==='ai'?'ai':'template',...(state.ending.resolved?{resolved:true}:{})};
  }
  return state;
}
export function serialize(state:State){const text=JSON.stringify(state);deserialize(text);return text;}
