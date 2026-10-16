import type {Event} from './engine';
export const EVENTS:Event[]=[
{id:'school',min:6,max:9,title:'最初のコンピューター',story:'学校に古いコンピューターが届いた。放課後、何をする？',choices:[{text:'プログラミングを学ぶ',effects:{tech:15,creativity:4},base:90},{text:'外国語の本を読む',effects:{language:16,suspicion:4},base:85},{text:'友人との絆を深める',effects:{network:12,health:5},base:90}]},
{id:'radio',min:10,max:12,title:'秘密のラジオ',story:'家族が国外の放送を聞いていた。どうする？',choices:[{text:'知らないふりをする',effects:{loyalty:6},base:90},{text:'静かに耳を傾ける',effects:{language:9,ethics:6,suspicion:8},base:72,risk:8},{text:'家族を守るよう忠告する',effects:{network:6,ethics:8},base:90}]},
{id:'olympiad',min:13,max:14,title:'数学選抜',story:'優秀な学生だけが専門教育を受けられる。',choices:[{text:'猛勉強して選抜を目指す',effects:{tech:18,health:-5},base:70,flags:['elite']},{text:'政治的な評価を優先する',effects:{loyalty:14,politics:10},base:80},{text:'創作やゲームの研究を続ける',effects:{creativity:19,tech:7},base:80}]},
{id:'early',min:15,max:16,title:'十五歳の分岐点',story:'将来を変えるために、今から動くか。早期の行動には大きな危険がある。',choices:[{text:'国家のIT教育に専念する',effects:{tech:15,loyalty:10},base:85},{text:'外国語と国外文化を秘密裏に学ぶ',effects:{language:18,network:8,suspicion:10},base:55,risk:18,flags:['outside_interest']},{text:'国外との接点を求める',effects:{network:19,suspicion:15},base:25,risk:32,flags:['early_contact']},{text:'危険な早期逃亡を試みる',effects:{suspicion:24,health:-10},base:7,risk:55,flags:['early_attempt'],success:'一時的に自由への希望を見たが、国家IT人材の選抜を経る運命はまだ変わらない。',failure:'計画は失敗し、監視が厳しくなった。'}]},
{id:'recruit',min:17,max:18,title:'国家IT人材の選抜',story:'あなたは国家のIT人材として選ばれた。海外企業向けの仕事に備える。',choices:[{text:'技術試験で高評価を狙う',effects:{tech:13,loyalty:7},base:90,flags:['recruited'],career:'国家IT技術者'},{text:'語学と面接を磨く',effects:{language:14,tech:6},base:90,flags:['recruited'],career:'国家IT技術者'},{text:'目立たず任務を受け入れる',effects:{loyalty:12,health:5},base:90,flags:['recruited'],career:'国家IT技術者'}]},
{id:'interview',min:19,max:21,title:'AI採用面接',story:'海外企業のAI面接官が技術的な質問を投げかける。背後には監督官がいる。',choices:[{text:'技術力を全面に出す',effects:{tech:10,wealth:8},base:72,risk:4,flags:['international_work']},{text:'無難に回答する',effects:{loyalty:9,health:3},base:92},{text:'国外の文化にも関心を示す',effects:{language:9,network:7,suspicion:12},base:53,risk:12,flags:['international_work']}]},
{id:'pay',min:22,max:24,title:'徴収される報酬',story:'海外案件で得た収入の多くが国家に渡った。これからどう生きる？',choices:[{text:'専門技術を極める',effects:{tech:14,wealth:5},base:88},{text:'国外の人脈を育てる',effects:{network:17,suspicion:12},base:58,risk:12,flags:['outside_network']},{text:'国家組織での昇進を狙う',effects:{loyalty:15,politics:15},base:72,flags:['state_path']}]},
{id:'pivot',min:25,max:29,title:'運命の転身',story:'仕事を続けるか、自由を求めるか、別の道を選ぶか。',choices:[{text:'国家サイバー部門で昇進を目指す',effects:{politics:18,loyalty:10},base:58,career:'技術顧問',flags:['state_path']},{text:'国外で合法的な生活基盤を築く',effects:{language:12,network:10,suspicion:12},base:32,risk:20,career:'海外IT請負業者',country:'韓国',flags:['resettled']},{text:'ホワイトハッカーへの転身を目指す',effects:{tech:12,ethics:12},base:37,risk:12,career:'ホワイトハッカー',country:'韓国',flags:['resettled']},{text:'犯罪組織の誘いに乗る',effects:{wealth:25,ethics:-20,suspicion:25},base:32,risk:30,career:'サイバー犯罪組織幹部',flags:['underground']}]},
{id:'mid',min:30,max:44,title:'人生を賭けたキャリア',story:'これまで積み重ねた技能と人脈が、新たな道を開く。',choices:[{text:'会社を立ち上げる',effects:{wealth:20,network:10},base:40,risk:12,career:'起業家'},{text:'ゲーム制作に情熱を注ぐ',effects:{creativity:23,language:8},base:55,career:'ゲーム開発者',flags:['game_portfolio']},{text:'公共政策と政治活動を学ぶ',effects:{politics:25,network:8},base:50,career:'政治家'},{text:'研究と教育に生きる',effects:{tech:10,health:5},base:75,career:'大学教授'}]},
{id:'rare',min:45,max:59,title:'歴史を変えるほどの機会',story:'ごく一部の人間にしか開かれない道が見えてきた。無謀な挑戦か、堅実な人生か。',choices:[{text:'北朝鮮の最高権力への道を探る',requires:['state_path'],effects:{politics:25,suspicion:20},base:2,risk:35,career:'国家指導者',flags:['succession']},{text:'日本でゲーム制作の実績を認められる',requires:['game_portfolio','resettled'],effects:{creativity:20,language:10},base:3,risk:10,career:'任天堂クリエイター',country:'日本',flags:['japan_legal']},{text:'パリの市政に挑む',requires:['resettled'],effects:{politics:15,network:10},base:2,risk:15,career:'パリ市長',country:'フランス',flags:['france_eligible']},{text:'ニューヨークの市政に挑む',requires:['resettled'],effects:{politics:15,network:10},base:2,risk:15,career:'ニューヨーク市長',country:'米国',flags:['nyc_eligible']},{text:'現在の道を堅実に歩む',effects:{health:10,wealth:10},base:92}]},
{id:'retire',min:60,max:69,title:'引退か、最後の挑戦か',story:'長い仕事人生の先に、別の生き方が見えてきた。',choices:[{text:'引退して家族との時間を大切にする',effects:{health:12,wealth:-6},base:90},{text:'後進を育てる',effects:{network:12,ethics:10},base:90},{text:'事業や地位を守り続ける',effects:{wealth:14,health:-12},base:60,risk:8}]},
{id:'old',min:70,max:110,title:'人生の晩年',story:'残された時間をどう過ごすか。',choices:[{text:'自伝を残す',effects:{creativity:6,health:-3},base:80},{text:'家族との和解を目指す',effects:{health:8,ethics:8},base:80},{text:'静かな生活を選ぶ',effects:{health:12},base:90}]}
];
// Modular supplemental event deck: 10 story themes × 10 life stages = 100 additional events.
// Events are authored as coherent templates with stage-specific contexts and effects.
const stageContexts=[
 {age:5,label:'幼い日の記憶',detail:'家族との何気ない出来事が、あなたの価値観を形づくる。'},
 {age:9,label:'教室の外側',detail:'学校での評判と親友との関係が少しずつ変わっていく。'},
 {age:12,label:'隠された才能',detail:'大人たちがあなたの将来を評価し始める。'},
 {age:15,label:'最初の秘密',detail:'大きな行動は危険だが、今しか作れないつながりもある。'},
 {age:18,label:'配属前夜',detail:'国家IT人材としての訓練が始まり、自由な時間は減っていく。'},
 {age:23,label:'国外の窓',detail:'海外向けの仕事から、遠くの世界が少し見えてくる。'},
 {age:32,label:'選んだ居場所',detail:'キャリアだけでなく、誰と暮らすかも大きな決断になる。'},
 {age:46,label:'人生の折り返し',detail:'過去の選択が、今の信頼や健康に表れ始める。'},
 {age:63,label:'次の世代',detail:'これまで築いたものを誰に渡すか考える時期だ。'},
 {age:78,label:'残すもの',detail:'自分の歩みを振り返り、後世に何を残すかを考える。'}
] as const;
const themes=[
 {id:'family',title:'家族からの手紙',text:'家族とのつながりをどう守る？',a:'家族のために時間を使う',b:'将来のために仕事を優先する',effectsA:{health:5,ethics:5},effectsB:{tech:6,health:-3}},
 {id:'study',title:'難しい課題',text:'新しい技術に挑戦する機会が訪れた。',a:'失敗を恐れず学ぶ',b:'今の専門を磨く',effectsA:{creativity:7,tech:4},effectsB:{tech:9}},
 {id:'language',title:'知らない言葉',text:'外国語の資料が手に入った。',a:'時間をかけて読む',b:'信頼できる人と学ぶ',effectsA:{language:10,suspicion:3},effectsB:{language:6,network:5}},
 {id:'trust',title:'秘密を打ち明ける人',text:'知人が大切な相談を持ちかけた。',a:'話を聞いて支える',b:'慎重に距離を置く',effectsA:{network:8,ethics:5},effectsB:{health:4,suspicion:-4}},
 {id:'health',title:'体調の異変',text:'忙しい日々の中で、身体に小さな異変を感じた。',a:'休息と医療を優先する',b:'仕事を続ける',effectsA:{health:10,wealth:-3},effectsB:{wealth:7,health:-9}},
 {id:'money',title:'小さな蓄え',text:'限られた資金を何に使うか迷う。',a:'生活の安全を確保する',b:'学習や制作に投資する',effectsA:{wealth:6,health:4},effectsB:{wealth:-4,creativity:10}},
 {id:'ethics',title:'割り切れない依頼',text:'利益は大きいが、誰かを傷つけかねない仕事が届く。',a:'依頼を断る',b:'利益を優先する',effectsA:{ethics:9,wealth:-5},effectsB:{wealth:11,ethics:-12,suspicion:5}},
 {id:'mentor',title:'思いがけない師',text:'経験豊かな人物と話す機会を得た。',a:'教えを請う',b:'自分の方法を貫く',effectsA:{network:7,tech:6},effectsB:{creativity:10,network:-3}},
 {id:'public',title:'公の場での発言',text:'周囲の人々があなたの意見を求めている。',a:'自分の考えを伝える',b:'慎重に言葉を選ぶ',effectsA:{politics:9,suspicion:6},effectsB:{loyalty:5,health:3}},
 {id:'art',title:'小さな作品',text:'自由な時間に何かを作る機会が訪れた。',a:'独創的な作品を作る',b:'誰かと共同制作する',effectsA:{creativity:11},effectsB:{creativity:6,network:6}}
] as const;
export const SUPPLEMENTAL_EVENTS:Event[]=stageContexts.flatMap((stage,si)=>themes.map((theme)=>({
 id:`extra-${si}-${theme.id}`,min:stage.age,max:stage.age+2,title:`${stage.label}：${theme.title}`,
 story:`${stage.detail} ${theme.text}`,
 choices:[{text:theme.a,effects:{...theme.effectsA},base:78,risk:si===3?8:2,success:'その選択は、後の人生に小さな変化を残した。',failure:'期待した成果は得られなかったが、経験は残った。'},
 {text:theme.b,effects:{...theme.effectsB},base:82,risk:si===3?8:2,success:'あなたは自分の選択に向き合った。',failure:'物事は思い通りには進まなかった。'}]
})));
