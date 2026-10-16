import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Terminal,RotateCcw,BookOpen,Heart,ShieldAlert} from 'lucide-react';
import {createGame,ALL_EVENTS,applyChoice,advance,progress,nextAvailableEvent,canChoose,successChance,endingCatalog,legendary,familyLabels,flagLabels,type State} from './engine';
import {SAVE_KEY,serialize,deserialize} from './save';
import {ArtSlot} from './ArtSlot';
import './style.css';
function load():{game:State|null;error:string}{
  try{const text=localStorage.getItem(SAVE_KEY);return {game:text?deserialize(text):null,error:!text&&localStorage.getItem('born-to-hack-v1')?'旧版のセーブは保持しています。v0.3では新しい人生を開始してください。':''};}
  catch(error){return {game:null,error:String(error)}}
}
const labels:Record<string,string>={tech:'技術',language:'語学',network:'人脈',loyalty:'忠誠',suspicion:'疑惑',health:'健康',wealth:'資産',ethics:'倫理',creativity:'創造',politics:'政治'};
function App(){
  const [initial]=useState(load);
  const [game,setGame]=useState<State|null>(initial.game);
  const [error,setError]=useState(initial.error);
  const [tab,setTab]=useState<'game'|'history'|'catalog'>('game');
  const [message,setMessage]=useState('');
  const [pending,setPending]=useState(false);
  const [busy,setBusy]=useState(false);
  const [seed,setSeed]=useState('');
  function save(s:State){setGame(s);try{localStorage.setItem(SAVE_KEY,serialize(s));setError('');}catch(e){setError(`保存できませんでした。書き出しで保管してください：${e}`);}}
  function start(){save(createGame(seed.trim()?Number(seed)>>>0:undefined));setMessage('');setPending(false);setTab('game');}
  const event=game?nextAvailableEvent(game):undefined;
  function choose(i:number){if(!game||!event)return;const x=applyChoice(game,event,i);setMessage((x.success?'成功：':'失敗：')+x.result);setPending(true);save(x.state);}
  function next(){if(!game)return;save(progress(game));setPending(false);setMessage('');}
  function finish(){if(!game)return;save(advance(game,120));setMessage('');}
  function download(){if(!game)return;const blob=new Blob([JSON.stringify(game)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='born-to-hack-v3.json';a.click();URL.revokeObjectURL(url);}
  async function narrate(){
    if(!game?.ending||game.ending.resolved||busy)return;
    const snapshot=game;setBusy(true);
    try{
      const response=await fetch('/api/endings',{method:'POST',headers:{'Content-Type':'application/json'},body:serialize(snapshot),signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw Error('AIサービスは利用できません');
      const ending=await response.json();const checked=deserialize(JSON.stringify({...snapshot,ending}));save(checked);
    }catch{save({...snapshot,ending:{...snapshot.ending!,resolved:true}});setMessage('テンプレートの人生総括を保存しました。');}
    finally{setBusy(false);}
  }
  return <div className="shell"><header><div className="brand"><Terminal size={23}/><span>BORN TO HACK</span></div><span className="subtitle">人生は選べない。行動は選べる。</span></header>
    <nav>{(['game','history','catalog'] as const).map((t,i)=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{['人生','年表','結末図鑑'][i]}</button>)}</nav>
    {error&&<p role="alert">{error}</p>}
    {!game?<section className="panel hero"><ArtSlot alt="タイトル画面"/><div className="eyebrow">NORTH KOREA · 1998</div><h1>その才能は、<br/>誰のものなのか。</h1><p>北朝鮮に生まれたあなたは国家管理下のITエンジニアを目指す。15歳からの選択が何十年も後の運命を変える。幼くして亡くなる人生もある。キャリアを達成しても人生は続く。</p><label>乱数シード（省略可）<input aria-label="乱数シード" inputMode="numeric" value={seed} onChange={e=>setSeed(e.target.value.replace(/[^0-9]/g,''))}/></label><button className="primary" onClick={start}>新しい人生を始める →</button></section>:<>
      <div className="status"><div><small>年齢</small><strong>{game.age}歳</strong></div><div><small>居住地</small><strong>{game.country}</strong></div><div><small>職業{game.retired?'（引退）':''}</small><strong>{game.career}</strong></div><div><small>家族</small><strong>{familyLabels[game.familyStatus]}・子{game.children}人</strong></div></div>
      {tab==='game'?<><div className="stats">{Object.entries(game.stats).map(([k,v])=><div key={k}><div className="statlabel"><span>{labels[k]}</span><span>{v}</span></div><div className="track"><div className={k==='suspicion'?'danger':''} style={{width:`${v}%`}}/></div></div>)}</div>
        {!game.alive?<section className="panel ending"><ArtSlot alt="人生の結末"/><div className="eyebrow">THE END · {game.ending?.id}</div><h1>{game.ending?.title}</h1><p className="ending-prose">{game.ending?.story}</p><p>{game.ending?.source==='ai'?'AI構成による人生総括':'確定した人生の事実による総括'}</p><button disabled={busy||game.ending?.resolved} onClick={narrate}>{busy?'総括を構成中…':game.ending?.resolved?'総括を保存済み':'AIによる総括の構成を試す'}</button><button disabled={busy} className="primary" onClick={start}>もう一度、生まれる →</button></section>:
        <section className="panel story"><ArtSlot alt={`${game.age}歳の人生`}/><div className="eyebrow">{game.birthYear+game.age}年 · {game.age}歳</div>{pending?<><h2>選択の結果</h2><p aria-live="polite">{message}</p><button className="primary" onClick={next}>人生を進める →</button></>:event?<><h2>{event.title}</h2><p>{event.story}</p><div className="choices">{event.choices.map((c,i)=>{
          const available=canChoose(game,c);
          return <button disabled={!available} key={i} onClick={()=>choose(i)}><b>{String(i+1).padStart(2,'0')}　{c.text}</b><small>{available?`成功確率 ${successChance(game,c)}%`:`条件未達：${[...(c.requires??[]).map(f=>flagLabels[f]??'必要な経歴'),...Object.entries(c.minimum??{}).map(([k,v])=>`${labels[k]}${v}`),...(c.residentYears?[`居住${c.residentYears}年`]:[])].join('・')}`}</small>{c.description&&<small>{c.description}</small>}</button>;
        })}</div></>:<><h2>時は流れる</h2><p>次の出来事まで、毎年の死亡リスクを判定する。</p><button className="primary" onClick={next}>人生を進める →</button></>}{game.age>=70&&<button className="secondary" onClick={finish}>以後の選択を省略し、晩年を最後まで進める</button>}</section>}
        <div className="foot"><span><Heart size={15}/> 死亡まで続く人生</span><button disabled={busy} onClick={()=>{if(confirm('現在の人生を破棄して最初から始めますか？'))start();}}><RotateCcw size={14}/> やり直す</button></div>
      </>:tab==='history'?<section className="panel"><h2><BookOpen size={22}/> 人生年表</h2>{game.history.map((h,i)=><div className="history" key={i}><b>{h.age}歳　{h.title}</b><p>{h.detail}</p></div>)}</section>:<section className="panel"><h2><ShieldAlert size={22}/> エンディング図鑑</h2><p>職業・資産・家族状態で区別される{endingCatalog.length}種類。居住地、健康、実績、過去の選択も総括に反映する。学生の結婚等の組合せは除外。激レア3系統は生涯実績として保持する。</p><div className="legends">{legendary.map(x=><div key={x.id}><b>{x.id}　{x.name}</b><small>{x.condition}</small></div>)}</div><p>収録イベント：{ALL_EVENTS.length}件（既存の100件はテーマ別テンプレート）</p><div className="catalog">{endingCatalog.map(x=><span key={x.id}>{x.id} {x.career}・{x.standing}・{x.legacy}</span>)}</div></section>}
    </>}
    <div className="foot">{game&&<button onClick={download}>セーブを書き出す</button>}<label>セーブを読み込む<input type="file" accept=".json" disabled={busy} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>500000)throw Error('ファイルが大きすぎます');const s=deserialize(await file.text());save(s);setPending(false);setMessage('');}catch(err){setError(String(err));}e.target.value='';}}/></label></div>
    <footer>Fictional narrative game · v0.3 · Local save<br/>寿命：WHO 2021・男女計の出生時平均余命に校正した合成年齢曲線。実測年齢別死亡率ではありません。</footer>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
