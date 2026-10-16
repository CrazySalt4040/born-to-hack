import type {State, Stat} from './engine';
import {mixSeed} from './random';
import {politicalYear} from './social-world';

/** Ordinary years never make major life decisions or consume the outcome RNG. */
export function dailyLife(s:State):void {
  const atmosphere=politicalYear(s);
  const childhood=['窓から差す光を追って、一日が過ぎた。','食卓の湯気と家族の声が、日々の記憶になった。','雨の日は家の中で、身近な物を遊び道具にした。','寒い朝、家族が服の襟を直してくれた。'];
  const school=['ノートの余白に、授業とは関係のない図を描いた。','帰り道の景色を眺めながら、覚えた言葉を口の中で繰り返した。','難しい問題を解けた日は、少しだけ足取りが軽かった。','古い教科書を読み返すうちに、夕方になった。','休み時間の何でもない会話が、妙に心に残った。'];
  const work=['昨日の作業を見直し、小さな間違いを一つ直した。','同じ道を行き来するうちに、季節が変わっていた。','慌ただしい週が終わり、ようやく机の上を片づけた。','読みかけの本を数ページ進めてから、明かりを消した。','誰にも見せないメモに、思いついたことを書き留めた。','いつもより早く起きて、静かな朝を過ごした。'];
  const later=['窓を開け、外の空気をゆっくり吸い込んだ。','古い持ち物を整理して、忘れていた記憶に出会った。','無理をせず、休みながら一日の用事を済ませた。','若い頃に好きだったものを、ふと思い出した。','温かい飲み物を手に、午後の時間を過ごした。'];
  const pool=s.age<6?childhood:s.age<19?school:s.retired||s.age>=70?later:work;
  // Stable offset plus age avoids adjacent repeated prose, including after reload.
  const line=pool[(mixSeed(s.birthYear)+s.age)%pool.length];
  let context=s.age<6?'少しずつ、身の回りの世界が広がっていく。':s.age<19?'日々の学びが、少しずつ自分の力になっていく。':s.flags.includes('imprisoned')?'拘束下では、限られた日課が一日の区切りになる。':`${s.country}での暮らしにも、いつもの日課がある。`;
  if(s.age>=19&&s.age%3===0){
    if(s.grandchildren)context='孫たちのことを思いながら、次に会う日を楽しみにした。';
    else if(s.children)context='子どもの近況を思い浮かべ、家族のための時間を考えた。';
    else if(s.familyStatus==='married')context='伴侶と交わす何気ない言葉が、一日の区切りになった。';
    else if(s.flags.includes('chronic'))context='体調を気にかけながら、予定を詰め込みすぎないようにした。';
  }
  const grow=(stat:Stat,n=1)=>s.stats[stat]=Math.min(100,s.stats[stat]+n);
  if(s.age>=6&&s.age<=29){grow('tech');if(s.age%2===0){grow('language');grow('network');grow('creativity');}}
  if(s.age>=30&&s.age<=74&&!s.retired&&!s.flags.includes('imprisoned')){
    const focuses:[string,Stat[]][]=[['routine:craft',['tech','creativity']],['routine:language',['language','network']],['routine:policy',['politics','loyalty','network']],['routine:saving',['wealth']],['routine:community',['ethics']]];
    const focus=focuses.find(([flag])=>s.flags.includes(flag));
    if(focus){focus[1].forEach(stat=>grow(stat));context+=' 選んだ日々の取り組みを、今年も続けた。';}
  }
  if(s.familyStatus==='married'&&!s.flags.includes('separated:spouse')&&!s.retired){
    if(s.flags.includes('dual_income')){grow('wealth',2);s.risks.stress=Math.min(100,s.risks.stress+1);}
    if(s.flags.includes('home_focus')){s.family=Math.min(100,s.family+1);s.risks.stress=Math.max(0,s.risks.stress-1);}
  }
  if(s.flags.some(f=>f.startsWith('separated:'))&&s.age%3===0)context='国内に残した家族を思い、離れて暮らす年月の長さを感じた。';
  else if(s.flags.includes('dating')&&s.familyStatus==='single')context='交際相手と近況を話し合う時間をつくった。';
  else if(s.familyStatus==='married'&&s.flags.includes('dual_income'))context='ふたりの仕事と家事をやりくりし、少しずつ生活費を蓄えた。';
  const count=s.age<18?3+(mixSeed(s.seed^s.age)%2):1;
  const seasons=count===3?['春','夏','冬']:['春','夏','秋','冬'];
  for(let i=0;i<count;i++){
    let detail=count===1?line:pool[(mixSeed(s.birthYear)+s.age*3+i)%pool.length];
    if(i===count-1&&s.age%3===0)detail+=' '+context;
    if(i===0&&atmosphere.news)detail=atmosphere.news;
    if((count===1||i===1)&&atmosphere.consequence)detail+=(detail?' ':'')+atmosphere.consequence;
    s.history.push({age:s.age,kind:'daily',title:count===1?'日々の記録':seasons[i]+'の記録',detail});
  }
}
