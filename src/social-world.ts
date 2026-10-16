import type {State} from './engine';
import {mixSeed,random} from './random';
export type Companion='parents'|'siblings'|'spouse'|'children';
export const companionLabels:Record<Companion,string>={parents:'親',siblings:'きょうだい',spouse:'配偶者',children:'子ども'};
export type PoliticalClimate={seed:number;surveillance:number;law:number;headline:string};
export const initialClimate=(seed:number):PoliticalClimate=>({seed:mixSeed(seed^0x71ca),surveillance:50,law:50,headline:'大きな変化は伝わってこない。'});
export function availableCompanions(s:State):Companion[]{return ['parents','siblings',...(s.familyStatus==='married'?['spouse']:[]),...(s.children?['children']:[])] as Companion[];}
export const isDeparture=(s:State,c:{country?:string})=>s.country==='北朝鮮'&&!!c.country&&c.country!=='北朝鮮';
export function politicalYear(s:State):{news?:string;consequence?:string}{
  const world=s.world??initialClimate(s.seed);s.world={...world};
  const [r,n]=random(world.seed),[direction,n2]=random(n),[incident,n3]=random(n2);s.world.seed=n3;
  let news:string|undefined,consequence:string|undefined;
  if(r<.35){
    const delta=direction<.5?-3:3;
    s.world.surveillance=Math.max(35,Math.min(65,world.surveillance+delta));
    s.world.law=Math.max(35,Math.min(65,world.law+delta));
    s.world.headline=delta>0?'中央の方針見直しが伝えられ、検査や規則の運用が少し厳しくなった。':'行政の重点が移り、一部の検査や規則の運用が少し緩んだ。';
    news='【架空の国内情勢】'+s.world.headline;
  }
  if(s.country==='北朝鮮'&&s.age>=10){
    const pressure=(s.stats.suspicion/100)*.25+s.world.surveillance/100*.08;
    if(incident<pressure){
      s.risks.stress=Math.min(100,s.risks.stress+3);s.stats.wealth=Math.max(0,s.stats.wealth-2);
      consequence=s.age<18?'家族が追加の聞き取りを受け、予定がずれた。家計にも小さな負担が残った。':'書類の再確認に呼ばれ、仕事の時間を失った。出費と気疲れが残った。';
    }else if(incident>.9&&s.stats.loyalty>=65){
      s.stats.network=Math.min(100,s.stats.network+1);s.risks.stress=Math.max(0,s.risks.stress-1);
      consequence=s.age<18?'普段の振る舞いが学校で評価され、先生から声をかけられた。':'日頃の組織での評価から、紹介を一つ受けた。少し肩の力が抜けた。';
    }
  }
  return {news:s.country==='北朝鮮'?news:undefined,consequence};
}
