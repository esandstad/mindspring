// Random-profile sweep: women aged 40-60 with random (often incoherent) answers. Checks internal invariants.
// Usage: node tests/sweep.js <index.html> [count] [seed]
const {chromium}=require('playwright');
const FILE='file://'+process.argv[2],N=Number(process.argv[3]||300),SEED=Number(process.argv[4]||7);
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',x=>errs.push(x.message));
await p.goto(FILE);const fails={};let total=0;
for(let k=0;k<N;k++){errs.length=0;await p.goto(FILE);
const res=await p.evaluate(([seed])=>{let s=seed;const rnd=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648};const pick=a=>a[Math.floor(rnd()*a.length)];
const age=40+Math.floor(rnd()*21);el('f_age').value=String(age);el('f_date').value='2026-11-09';
const skip=0.08+rnd()*0.15;
for(let pass=0;pass<5;pass++){read();for(const {it} of allItems){const [id,type,label,opts]=it;if(type==='note'||id==='age'||id==='date'||id==='recover'||!isShown(it))continue;if(answered(state[id])||(state[id]&&state[id].length))continue;if(rnd()<skip)continue;
 if(type==='radio'){const n=(opts||[]).length;const v=Math.min(n-1,Math.floor(Math.pow(rnd(),1.6)*n));const x=document.querySelector('input[name="'+id+'"][value="'+v+'"]');if(x)x.checked=true}
 else if(type==='select'){const o=opts||[];if(o.length)el('f_'+id).value=pick(o)}
 else if(type==='checks'){const o=opts||[];const boxes=[...document.querySelectorAll('input[name="'+id+'"]')];if(rnd()<0.55){const none=boxes.find(x=>/^None/.test(x.value));if(none)none.checked=true;else if(boxes[0])boxes[0].checked=true}else{boxes.filter(x=>!/^None|^Not sure/.test(x.value)).forEach(x=>{if(rnd()<0.25)x.checked=true})}}
 else if(type==='number'){if(id==='ovxAge')el('f_'+id).value=String(30+Math.floor(rnd()*(age-29)))}
 else if(type==='date'){if(id==='last'&&rnd()<0.6){const d=new Date('2026-11-09');d.setDate(d.getDate()-Math.floor(rnd()*900));el('f_last').value=d.toISOString().slice(0,10)}}
 else if(type==='check'){if(rnd()<0.2){const x=el('f_'+id);if(x)x.checked=true}}
 else if(type==='text'||type==='textarea'){if(rnd()<0.3)el('f_'+id).value='Sample text'}
}}
read();step=fields.length-1;show();
const F=[];const bad=(name,info)=>F.push([name,String(info).slice(0,300)]);
const S=summary();const fl=S.flags;const st=likelyStage();const G=glance(S);
// 1 tiers valid, sorted, labels present
fl.forEach(f=>{if(![1,2,3,4].includes(f[5]))bad('tier invalid',f[1]);if(!f[6]||/undefined|null/.test(f[6]))bad('short label missing',f[1])});
for(let i=1;i<fl.length;i++)if(fl[i][5]<fl[i-1][5])bad('flags not sorted by tier',fl[i][1]);
// 2 glance counts match
[1,2,3,4].forEach(t=>{const n=fl.filter(f=>f[5]===t).length;const row=G.find(g=>g[0]===tierName[t]);if(n&&!row)bad('glance row missing',t);if(row&&!row[1].startsWith(n+' item'))bad('glance count mismatch',t+' '+row[1]+' vs '+n);if(!n&&row)bad('glance row without flags',t)});
// 3 hidden answers cleared
for(const {it} of allItems){const [id,type]=it;if(type==='note')continue;if(!isShown(it)){const had=type==='checks'?state[id]&&state[id].length:type==='check'?state[id]:answered(state[id]);if(had)bad('hidden answer kept',id)}}
// 4 stage coherence
const T=fl.map(f=>f[1]).join('\n');
if(st.post&&state.periodStop!=='Yes, before age 40'&&/consider a pregnancy test/.test(T))bad('pregnancy test after menopause',st.text);
if(age>=55&&/consider a pregnancy test/.test(T))bad('pregnancy test at 55+',age);
if(!['early','late'].includes(st.key)&&/Perimenopause with a history|during perimenopause/.test(T))bad('peri flag outside peri',st.key+' | '+(T.match(/.*perimenopause.*/i)||[''])[0]);
if(st.key==='post'&&has('bleed','Bleeding after 12 months without a period')===false&&named('bleed').length&&!/after menopause|prompt medical evaluation/.test(T))bad('bleeding in postmenopause not flagged',named('bleed').join(';'));
if(/Late menopause transition/.test(st.text)&&/Postmenopause/.test(st.text))bad('stage text mixes',st.text);
// 5 score ranges
const chk=(n,v,lo,hi)=>{if(v!==null&&v!==undefined&&(v<lo||v>hi||Number.isNaN(v)))bad('score out of range',n+'='+v)};chk('PHQ',S.ps,0,27);chk('GAD',S.gs,0,21);
S.mrs.forEach(m=>chk('MRS',m.score,0,44));const O=ociScore();if(O&&O.total!==null)chk('OCI',O.total,0,72);const SC=scoffScore();if(SC!==null)chk('SCOFF',SC,0,5);
// 6 C-SSRS only when item 9 positive
if(!V.p8pos()&&/C-SSRS/.test(T))bad('C-SSRS flag without item 9',T.match(/.*C-SSRS.*/)[0]);
// 7 age-gated rules
if(age<45&&/Colon cancer screening/.test(T))bad('colon screening under 45',age);
if(age<50&&/after age 50/.test(T))bad('after-50 rule under 50',age);
if(age>=45&&/before age 40.*pregnancy and hormonal contraception need to be ruled out/.test(T))bad('POI pregnancy text at 45+',age);
for(const {it} of allItems){if(it[1]==='checks'&&Array.isArray(state[it[0]])&&state[it[0]].includes('None')&&state[it[0]].length>1)bad('None ticked with others',it[0])}
if(fl.some(f=>f[0]==='urgent'&&/^Thoughts of death/.test(f[1]))&&fl.some(f=>f[5]===2&&/^(C-SSRS|PHQ-9 item 9 positive|Client prefers to discuss suicide)/.test(f[1])))bad('suicide items split across tiers','');
if(fl.some(f=>/^Thoughts of death/.test(f[1])&&/screener not completed/.test(f[6]))&&cssrsLevel(true)&&cssrsLevel(true).complete)bad('wrong urgent reason label','');
{const hwRow=G.find(g=>g[0]==='Medical (hardware) check');const nMed=fl.filter(f=>f[0]==='medical'||(f[0]==='urgent'&&/^You reported: /.test(f[1]))).length;if(!hwRow)bad('hardware row missing','');else if(nMed&&!hwRow[1].includes(nMed+' signal'))bad('hardware count mismatch',hwRow[1]+' vs '+nMed);else if(!nMed&&!/^No physical/.test(hwRow[1]))bad('hardware says likely with no signals',hwRow[1])}
if(fl.some(f=>f[0]==='medical'&&/thyroid|GSM|genitourinary syndrome|ovarian cancer|endometrial cancer/i.test(f[1])))bad('diagnosis named in medical pattern text',fl.find(f=>f[0]==='medical'&&/thyroid|GSM|genitourinary syndrome|ovarian cancer|endometrial cancer/i.test(f[1]))[1]);
if(V.p8pos()&&isYes('cs2')&&fl.some(f=>/suicid|C-SSRS|item 9/i.test(f[1])&&f[5]>1))bad('active ideation not all Tier 1',fl.filter(f=>/suicid|C-SSRS|item 9/i.test(f[1])&&f[5]>1).map(f=>f[5]+' '+f[1].slice(0,50)).join(' | '));
if(V.hitsOn()&&(Number(state.h0)>0||Number(state.h4)>0)&&!fl.some(f=>f[5]===1&&f[2]))bad('partner harm not Tier 1','');
// 8 duplicates & junk text
const seen=new Set();fl.forEach(f=>{if(seen.has(f[1]))bad('duplicate flag',f[1]);seen.add(f[1])});
const rep=document.getElementById('report').innerText;
if(/\bundefined\b|\bNaN\b|\[object/.test(rep+T))bad('junk text in report',(rep+T).match(/.{40}(undefined|NaN|\[object).{40}/)?.[0]);
// 9 tier-1 flags appear in live safety notices
const live=document.getElementById('safetyLive').innerText;if(fl.some(f=>f[5]===1&&f[0]==='urgent'&&!f[2])&&!live.trim())bad('urgent flag but no live notice','');
// 10 PDF builds
let pdf;try{pdf=buildPDF();if(!pdf||pdf.length<2000)bad('pdf too small',pdf&&pdf.length)}catch(e){bad('pdf error',e.message)}
return {F,age,stage:st.text,n:fl.length,tiers:[1,2,3,4].map(t=>fl.filter(f=>f[5]===t).length)}},[SEED*1000+k]);
total++;if(errs.length)res.F.push(['page error',errs.join(' | ')]);
for(const [n,info] of res.F){(fails[n]=fails[n]||[]).push('#'+k+' age '+res.age+': '+info)}
}
console.log(total+' profiles');const keys=Object.keys(fails);if(!keys.length)console.log('ALL INVARIANTS HELD');
for(const k of keys){console.log('\n'+k+' ('+fails[k].length+')');fails[k].slice(0,4).forEach(x=>console.log('  '+x))}
await b.close()})();
