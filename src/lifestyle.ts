import type {State} from './engine';
export const timePriorities={balanced:'無理なく過ごす',study:'勉強',exercise:'運動',friends:'交友',family:'家族',craft:'創作'};
export const spendingPriorities={balanced:'必要なものを優先',learning:'本や学習',health:'食事・健康',social:'人付き合い',saving:'貯蓄'};
export type Habits={time:keyof typeof timePriorities;spending:keyof typeof spendingPriorities};
export const defaultHabits:Habits={time:'balanced',spending:'balanced'};
export function setHabits(s:State,habits:Habits):State{
  if(!s.alive||!Object.hasOwn(timePriorities,habits.time)||!Object.hasOwn(spendingPriorities,habits.spending))throw Error('Invalid lifestyle');
  return {...s,habits:{...habits}};
}
// A fictional, fixed valuation curve, not exchange rates or measured local prices.
export const assetValue=(wealth:number)=>Math.round(100*(Math.pow(1.14,wealth)-1));
export const formatMoney=(amount:number)=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(amount);
export function applyHabits(s:State):string{
  const h=s.habits??defaultHabits;if(s.age<6)return '';
  const up=(key:keyof State['stats'],amount=1)=>s.stats[key]=Math.max(0,Math.min(100,s.stats[key]+amount));
  const stress=(amount:number)=>s.risks.stress=Math.max(0,Math.min(100,s.risks.stress+amount));
  const lines:string[]=[];
  if(s.flags.includes('imprisoned'))return '拘束下では、普段の予定どおりに時間やお金を使うことができなかった。';
  switch(h.time){
    case 'study':up('tech');up('language');stress(1);lines.push('空いた時間に教科書を開いた。知識は増えたが、少し気疲れも残った。');break;
    case 'exercise':up('health');stress(-2);lines.push('無理のない運動を続け、体を動かして気分を整えた。');break;
    case 'friends':up('network');stress(-1);lines.push('知人と話す時間をつくり、顔を合わせる相手が増えた。');break;
    case 'family':s.family=Math.min(100,s.family+1);stress(-1);lines.push(s.flags.some(f=>f.startsWith('separated:'))?'離れている家族の近況を気にかけて過ごした。':'家族に時間を使い、近況を聞く機会が増えた。');break;
    case 'craft':up('tech');up('creativity');lines.push('小さな作品を作り続け、試行錯誤の跡がノートに残った。');break;
  }
  if(s.age>=12&&h.spending!=='balanced'){
    if(h.spending==='saving'){const full=s.stats.wealth>=100;up('wealth');stress(1);lines.push(full?'支出を抑え、これまでの蓄えを守った。':'欲しい物を一つ見送り、蓄えを少し増やした。');}
    else if(s.stats.wealth<1)lines.push('今は余裕がなく、予定していた出費を見送った。');
    else{up('wealth',-1);
      if(h.spending==='learning'){up('tech');lines.push('蓄えの一部を教材に回し、学んだことを試した。');}
      if(h.spending==='health'){up('health');s.risks.nutrition=Math.min(100,s.risks.nutrition+1);lines.push('食事や体調管理にお金を回し、生活を整えた。');}
      if(h.spending==='social'){up('network');lines.push('人付き合いにお金を使い、近況を交わす時間を持った。');}
    }
  }
  return lines.join(' ');
}
export function chanceLabel(chance:number):string{
  if(chance>=100)return '自分の意思で決められる';
  if(chance>=80)return '見込みは高い';
  if(chance>=60)return '十分に可能性がある';
  if(chance>=40)return '先行きは五分五分';
  if(chance>=15)return 'かなり難しい';
  if(chance>=1)return '望みは薄い';
  return '奇跡的な巡り合わせが必要';
}
