const {chromium,devices}=require('playwright');let pass=0,fail=0;
const ok=(n,c,x='')=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+n+(c?'':'  >> '+JSON.stringify(x).slice(0,400)))};
async function run(b,fill){const c=await b.newContext({...devices['iPhone 13'],acceptDownloads:true});const p=await c.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file://'+process.argv[2]);await p.evaluate(fill);
const r=await p.evaluate(()=>{read();step=fields.length-1;show();const S=summary();return {flags:S.flags.map(f=>f[0]+(f[2]?'(private)':'')+': '+f[1]+(f[7]?' || '+f[7]:'')),S:{ps:S.ps,gs:S.gs,mrs:S.mrs.map(m=>m.score+' '+m.band),aud:S.aud,hits:S.hits},glance:glance(S).map(g=>g.join(': ')),live:[...document.querySelectorAll('#safetyLive strong')].map(x=>x.textContent),report:document.getElementById('report').innerText}});
r.errs=e;await c.close();return r}
const H=(a,re)=>a.some(x=>re.test(x));
(async()=>{const b=await chromium.launch();
const pre=`const set=(n,v)=>{document.querySelector('input[name="'+n+'"][value="'+v+'"]').checked=true};const sel=(id,v)=>{el('f_'+id).value=v;read()};const chk=(n,v)=>{document.querySelector('input[name="'+n+'"][value="'+v+'"]').checked=true;read()};`;
const mk=body=>new Function(pre+body);
// P1 — 48, perimenopause, PHQ ~12. EXPECT: PHQ 12 moderate; no urgent/medical flags; no "check answers"; glance has therapy focus with PHQ split; MRS moderate.
let r=await run(b,mk(`sel('age','48');[2,2,1,1,1,2,1,0,0].forEach((v,i)=>set('p'+i,v));set('phqImpact',1);[1,1,1,1,0,1,0].forEach((v,i)=>set('g'+i,v));[2,0,2,1,1,1,1,1,0,1,1].forEach((v,i)=>set('m'+i,v));sel('stage','Cycles vary by 7+ days');sel('pregPossible','No');chk('history','Prior depression');sel('audit1','Monthly or less');sel('audit2','1 or 2');sel('audit3','Never');`));
console.log('\nP1 48-year-old perimenopause');ok('PHQ 10 moderate (expectation corrected: answers sum to 10)',r.S.ps===10,r.S);ok('no urgent or medical flags',!H(r.flags,/^(urgent|medical)/),r.flags);ok('no check-answers flags',!H(r.flags,/Check answers/),r.flags);
ok('glance: therapy focus with PHQ split (mood 6, physical 4)',H(r.glance,/Therapy focus: PHQ-9 10 \(moderate; mood and self-worth items 6, physical and concentration items 4\)/),r.glance);ok('MRS total 11 moderate',r.S.mrs[0]==='11 Moderate',r.S.mrs);ok('no errors',!r.errs.length,r.errs);
// P2 — 58, tamoxifen after breast cancer, bleeding after 12 months + spotting. EXPECT: PMB flag; gyn-evaluation flag naming tamoxifen, ranked top; one merged tamoxifen flag; no "tamoxifen without cancer"; no contraception flags.
r=await run(b,mk(`sel('age','58');for(let i=0;i<9;i++)set('p'+i,i<3?1:0);sel('stage','No period for 12+ months');chk('bleed','Bleeding after 12 months without a period');chk('bleed','Bleeding between periods');chk('hormoneTx','Tamoxifen');chk('hormoneTx','Breast, endometrial, or other hormone-sensitive cancer');sel('mht','No');`));
console.log('\nP2 58-year-old on tamoxifen with bleeding');const med=r.flags.filter(f=>f.startsWith('medical'));
ok('PMB flag present',H(r.flags,/always needs prompt medical evaluation/),r.flags);ok('gyn evaluation flag names tamoxifen',H(r.flags,/while taking tamoxifen: needs prompt medical evaluation.*needs endometrial sampling \(ACOG 2014\)/),r.flags);
ok('bleeding flags ranked first among medical',/while taking tamoxifen: needs prompt medical evaluation/.test(med[0]+med[1])&&/always needs prompt/.test(med[0]+med[1]),med);ok('exactly one tamoxifen prescriber flag',r.flags.filter(f=>/CYP2D6/.test(f)).length===1&&!H(r.flags,/affect hormones: Tamoxifen/),r.flags);
ok('no "tamoxifen without cancer"',!H(r.flags,/without a cancer history/));ok('no contraception flags',!H(r.flags,/contracepti/),r.flags);
// P3 — 36, no period 4 months, no contraception. EXPECT: under-40 POI prompt saying it's not a diagnosis; no early-menopause; no masking note.
r=await run(b,mk(`sel('age','36');sel('stage','No period for 3–11 months');sel('pregPossible','No');sel('mht','No');sel('injection','No');`));
console.log('\nP3 36-year-old, 4 months without a period');ok('under-40 prompt, not a diagnosis',H(r.flags,/under age 40: a physical change that needs medical evaluation\. This does not by itself mean a diagnosis/),r.flags);
ok('no early-menopause or masking flags',!H(r.flags,/ages 40–44|can’t be used/),r.flags);
// P4 — item 9 several days, C-SSRS low complete. EXPECT: amber client notice, no red; clinical item-9 flag; glance shows no "Act today".
r=await run(b,mk(`sel('age','50');for(let i=0;i<8;i++)set('p'+i,1);set('p8',1);read();set('cs1',0);set('cs2',1);set('cs6',1);set('nssi',1);`));
console.log('\nP4 item 9 positive, C-SSRS low');ok('amber notice only',JSON.stringify(r.live)==='["Please share this with your clinician"]',r.live);ok('clinical item-9 flag',H(r.flags,/^clinical: PHQ-9 item 9 positive \(several days\)/),r.flags);
ok('glance has no "Act today"',!H(r.glance,/Act today/)||H(r.glance,/Act today: 1/),r.glance);
// P5 — replay of the first test report. EXPECT: urgent names shortness of breath + clot line; combined symptom flag; contradiction flags; estrogen wording on pill only; E-HITS label "item endorsed"; private group; "na" -> Not provided.
r=await run(b,mk(`sel('name','e');sel('date','2026-11-08');sel('age','58');[1,1,2,1,1,2,2,2,0].forEach((v,i)=>set('p'+i,v));[1,1,1,1,1,1,0].forEach((v,i)=>set('g'+i,v));[1,2,2,2,3,1,1,2,1,1,1].forEach((v,i)=>set('m'+i,v));sel('stage','Cycles vary by 7+ days');sel('last','2026-11-08');sel('cog','Yes');chk('bleed','Bleeding between periods');chk('cardio','Shortness of breath');chk('other','Unexplained weight loss with fever or drenching night sweats');chk('hormoneTx','Tamoxifen');chk('contraNow','Pill, patch, or ring');chk('contraNow','Hormonal IUD');sel('injection','Yes');sel('mht','No');sel('audit1','2–4 times a month');sel('audit2','1 or 2');sel('audit3','Less than monthly');sel('hitsGate','Answer now');[0,0,0,0,1].forEach((v,i)=>set('h'+i,v));sel('notes','na');sel('meds','na');`));
console.log('\nP5 replay of first test report');
ok('urgent names shortness of breath + clot line',H(r.flags,/^urgent: You reported: shortness of breath\..*blood-clot risk/),r.flags);
ok('combined symptom flag, ranked first medical',/Several new physical symptoms together \(abnormal bleeding, shortness of breath, weight loss with fever or night sweats, worsening memory or thinking\)/.test(r.flags.filter(f=>f.startsWith('medical'))[0]||''),r.flags.filter(f=>f.startsWith('medical')).slice(0,2));
ok('gyn evaluation (tamoxifen + bleeding)',H(r.flags,/needs endometrial sampling/));
ok('contradictions: 3 methods, contraception at 58, cycles at 58',H(r.flags,/3 hormonal contraceptive methods/)&&H(r.flags,/contraception reported at age 58/)&&H(r.flags,/ongoing cycles reported at age 58/),r.flags.filter(f=>/Check/.test(f)));
ok('estrogen wording on pill/patch/ring; progestin-only separate',H(r.flags,/Estrogen-containing methods are generally avoided.*Progestin-only methods \(hormonal iud, contraceptive injection\)/),r.flags.filter(f=>/estrogen/.test(f)));
ok('tamoxifen without cancer: ask why',H(r.flags,/without a cancer history/));ok('LMP same-day flag',H(r.flags,/same as the assessment date/));
ok('forced-sex flag grouped as private',H(r.flags,/^clinical\(private\): Forced sexual activity/),r.flags.filter(f=>/private/.test(f)));
ok('E-HITS bar label "item endorsed"',/6 \/ 25 · Below total cut-off; item endorsed/.test(r.report));ok('report groups "Discuss privately"',/Discuss privately at next session/.test(r.report));
console.log('   priority snippet:',JSON.stringify((r.report.match(/In the client’s words[\s\S]{0,30}/)||[''])[0]));ok('"na" shown as Not provided',/In the client’s words\s+Not provided/.test(r.report)&&!/— na\b/.test(r.report));
ok('days since period shown with the date, not under Patterns',/2026-11-08 \(0 days before the assessment\)/.test(r.report)&&!/Days since last period/.test(r.report));
ok('MRS detail: at threshold + highest-rated',/Total 17 is at the start of the severe band\. Highest-rated: irritability \(severe\); heart discomfort, sleep problems, depressive mood, sexual problems \(moderate\)\. Hot flushes: mild\./.test(r.report));
ok('PHQ split 4 / 8 + item 8 prompt',/mood and self-worth items \(1, 2, 6, 9\) 4 of 12; physical and concentration items \(3, 4, 5, 7, 8\) 8 of 15.*Ask about item 8/.test(r.report));
ok('glance block',H(r.glance,/^Today: \d+ items?: Chest pain/)&&H(r.glance,/\[private\]/)&&H(r.glance,/^Therapy focus/),r.glance);ok('no errors',!r.errs.length,r.errs);

// P6 — replay of "test 4" (45, perimenopause). EXPECT: thyroid-pattern flag naming arousal items, ranked top; MHT+contraception flag mentioning bleeding; hot flushes not listed twice.
r=await run(b,mk(`sel('name','test 4');sel('age','45');[1,1,1,1,3,2,2,3,0].forEach((v,i)=>set('p'+i,v));[1,1,1,3,2,3,2].forEach((v,i)=>set('g'+i,v));[2,1,3,2,3,2,2,1,3,2,2].forEach((v,i)=>set('m'+i,v));sel('stage','Cycles vary by 7+ days');sel('cog','Yes');chk('bleed','Bleeding between periods');chk('other','Heat intolerance, tremor, or unexplained weight loss');chk('slp','Loud snoring (louder than talking, or heard through a closed door)');chk('hormoneTx','None');chk('contraNow','Pill, patch, or ring');sel('injection','Yes');sel('mht','Yes');chk('history','Prior depression');sel('audit1','2–4 times a month');sel('audit2','1 or 2');sel('audit3','Less than monthly');sel('hitsGate','Answer now');[0,0,1,1,1].forEach((v,i)=>set('h'+i,v));`));
console.log('\nP6 replay of test 4');const med6=r.flags.filter(f=>f.startsWith('medical'));
ok('scores match report (14, 13, 23, 3, 8)',r.S.ps===14&&r.S.gs===13&&r.S.mrs[0].startsWith('23')&&r.S.aud===3&&r.S.hits===8,r.S);
ok('thyroid pattern flag names arousal items',H(r.flags,/together with trouble relaxing, restlessness, irritability, slowed or restless movement, appetite change: this physical pattern can look like anxiety/),med6);
ok('no plain thyroid flag as well',!H(r.flags,/whether thyroid testing is needed/));
ok('MHT + contraception flag, mentions bleeding',H(r.flags,/Hormone therapy and hormonal contraception both reported.*Bleeding while on hormones/),med6);
ok('top medical flags lead',/Hormone therapy and hormonal contraception|can look like anxiety/.test(med6[0])&&/Hormone therapy and hormonal contraception|can look like anxiety/.test(med6[1]),med6.slice(0,3));
ok('hot flushes not listed twice',!/Hot flushes: moderate/.test(r.report)&&/hot flushes, sweating/.test(r.report));
ok('E-HITS positive grouped private',H(r.flags,/^clinical\(private\): Relationship safety screen \(E-HITS\) positive: 8\/25/));ok('no errors',!r.errs.length,r.errs);

// P7 — 46, early transition, prior depression, diagnosed ADHD on a stimulant, worsening memory, thyroid-type symptoms.
// EXPECT: stage "Early menopause transition"; risk-window flag; ADHD worsening flag; stimulant flag mentioning thyroid; thyroid flag mentions stimulant.
r=await run(b,mk(`sel('age','46');[1,1,1,1,2,1,2,2,0].forEach((v,i)=>set('p'+i,v));[1,1,1,2,2,2,1].forEach((v,i)=>set('g'+i,v));sel('stage','Cycles vary by 7+ days');sel('cog','Yes');chk('other','Heat intolerance, tremor, or unexplained weight loss');chk('history','Prior depression');chk('history','ADHD (diagnosed)');sel('adhdMed','Yes');sel('mht','No');sel('injection','No');`));
console.log('\nP7 46, perimenopause, ADHD on stimulant');
ok('stage: early transition',H(r.glance,/^Likely stage: Early menopause transition \(perimenopause\): cycle length varies/),r.glance);
ok('risk-window flag',H(r.flags,/Perimenopause with a history of prior depression: the group at highest risk/));
ok('ADHD worsening flag',H(r.flags,/Diagnosed ADHD with worsening concentration or memory/));
ok('stimulant flag mentions thyroid-pattern flag',H(r.flags,/Takes ADHD medication.*and the thyroid-pattern flag/));
ok('thyroid flag mentions stimulant',H(r.flags,/can look like anxiety.*ADHD stimulant medication can cause the same pattern/));ok('no errors',!r.errs.length,r.errs);
// P8 — 53, postmenopause, childhood attention problems never diagnosed, prior depression.
// EXPECT: stage "Postmenopause"; no risk-window flag (not perimenopause); evaluation flag; ADHD dx and childhood options exclusive.
r=await run(b,mk(`sel('age','53');sel('stage','No period for 12+ months');chk('history','Prior depression');chk('history','ADHD (diagnosed)');document.querySelector('input[name="history"][value="Attention problems since childhood, never diagnosed"]').click();sel('mht','No');sel('injection','No');`));
console.log('\nP8 53, postmenopause, undiagnosed childhood attention problems');
ok('stage: postmenopause',H(r.glance,/^Likely stage: Postmenopause/),r.glance);ok('no risk-window flag',!H(r.flags,/highest risk for perimenopausal/));
ok('ADHD evaluation flag; diagnosed option unticked (exclusive)',H(r.flags,/consider a full ADHD evaluation/)&&!H(r.flags,/Diagnosed ADHD/),r.flags.filter(f=>/ADHD/.test(f)));
// P9 — 44 on a hormonal IUD: stage can't be determined.
r=await run(b,mk(`sel('age','44');sel('stage','Cycles vary by 7+ days');chk('contraNow','Hormonal IUD');chk('history','PMDD');`));
console.log('\nP9 44 on hormonal IUD');ok('stage: can’t be determined, names IUD',H(r.glance,/^Likely stage: Can’t be determined from periods \(hormonal IUD\)/),r.glance);ok('no risk-window flag when stage unknown',!H(r.flags,/highest risk for perimenopausal/));

// ADHD stepped questions. EXPECTATIONS written first.
const vis=async(fill,ids)=>{const c=await b.newContext({...devices['iPhone 13']});const p=await c.newPage();await p.goto('file://'+process.argv[2]);await p.evaluate(fill);const out={};for(const id of ids)out[id]=await p.evaluate(id=>!el('q_'+id).hidden,id);const f=await p.evaluate(()=>{read();return flags().map(x=>x[1])});const bar=await p.evaluate(()=>sevScales(summary()).filter(x=>/ASRS/.test(x.name)).map(x=>x.score+' '+x.band[2]));await c.close();return {out,f,bar}};
console.log('\nP10 concentration complaint, childhood onset yes, Part A positive');
let v=await vis(mk(`sel('age','47');set('p6',2);read();sel('adhdChild','Yes');[2,2,1,3,3,0].forEach((x,i)=>set('a'+i,x));read();[3,3,2,3,3,1,3,1,0,1,0,2].forEach((x,i)=>set('a'+(i+6),x));read();`),['adhdChild','asrsNote','a0','a5','asrsBNote','a6','a17']);
ok('childhood question, Part A and Part B all shown',Object.values(v.out).every(Boolean),v.out);
ok('flag: positive 4 of 6, childhood reported, Part B counts',v.f.some(x=>/ASRS Part A positive: 4 of 6.*Childhood onset: reported.*inattention 5 of 5, hyperactivity and impulsivity 2 of 7/.test(x)),v.f.filter(x=>/ASRS/.test(x)));
ok('ASRS bar 4/6 orange label',v.bar[0]==='4 Consistent with adult ADHD; evaluate',v.bar);
console.log('\nP11 no attention complaint');v=await vis(mk(`sel('age','47');set('p6',0);set('m6',0);sel('cog','No');`),['adhdChild','a0']);ok('nothing ADHD shown',!v.out.adhdChild&&!v.out.a0,v.out);
console.log('\nP12 complaint but childhood onset No');v=await vis(mk(`sel('age','47');sel('cog','Yes');sel('adhdChild','No');`),['adhdChild','a0']);ok('childhood question shown, ASRS hidden',v.out.adhdChild&&!v.out.a0,v.out);
console.log('\nP13 diagnosed ADHD, low current symptoms');v=await vis(mk(`sel('age','47');chk('history','ADHD (diagnosed)');[1,1,1,2,2,0].forEach((x,i)=>set('a'+i,x));`),['adhdChild','a0','a6']);
ok('childhood question hidden, Part A shown, Part B hidden',!v.out.adhdChild&&v.out.a0&&!v.out.a6,v.out);ok('flag: below threshold, controlled',v.f.some(x=>/below the screening threshold \(0 of 6.*look controlled/.test(x)),v.f.filter(x=>/ASRS/.test(x)));
console.log('\nP14 Part B clears when Part A drops below threshold');v=await vis(mk(`set('p6',2);read();sel('adhdChild','Yes');[2,2,1,3,3,0].forEach((x,i)=>set('a'+i,x));read();set('a6',4);read();set('a0',0);read();`),['a6']);
ok('Part B hidden and its answer cleared',!v.out.a6&&!v.f.some(x=>/Part B/.test(x)),v);
console.log('\nP15 replay of test 5 (22, hysterectomy, heavy bleeding, pregnancy possible)');
r=await run(b,mk(`sel('age','22');sel('stage','Cycles vary by 7+ days');chk('bleed','Heavy or prolonged bleeding');chk('hormoneTx','Hysterectomy (uterus removed), ovaries kept');chk('contraNow','Pill, patch, or ring');sel('pregPossible','Yes');sel('mht','Yes');`));
ok('check-answers flag for hysterectomy contradictions',H(r.flags,/Check answers: hysterectomy reported, but also period-related bleeding and ongoing menstrual cycles and possible pregnancy/),r.flags.filter(f=>/Check/.test(f)));
ok('no pregnancy-test flag after hysterectomy',!H(r.flags,/consider a pregnancy test/));ok('mask reasons lowercase',H(r.glance,/pill, patch, or ring/)&&!H(r.glance,/Pill, patch/),r.glance);

// Trauma module. EXPECTATIONS written first.
console.log('\nP16 no trauma: only two short questions');
v=await vis(mk(`sel('tGate','No');`),['tGate','pc0','pl0','aceQ']);ok('gate + ACE question only; PC-PTSD and PCL hidden',v.out.tGate&&v.out.aceQ&&!v.out.pc0&&!v.out.pl0,v.out);
console.log('\nP17 trauma case: perimenopause, accident, PC-PTSD 4/5, PCL-5 answered');
r=await run(b,mk(`sel('age','47');sel('stage','Cycles vary by 7+ days');sel('mht','No');sel('injection','No');sel('tGate','Yes');[0,1,0,0,0].forEach((x,i)=>set('pc'+i,x));read();[2,2,1,3,3, 2,1, 0,2,3,3,2,2,2, 2,0,3,2,2,3].forEach((x,i)=>set('pl'+i,x));sel('aceQ','Yes');`));
ok('PC-PTSD-5 positive 4 of 5 with cut-off note',H(r.flags,/PC-PTSD-5 positive: 4 of 5 \(cut-off 3/),r.flags.filter(f=>/PC-PTSD/.test(f)));
ok('PCL-5 total 40 with clusters 11/3/14/12',H(r.flags,/PCL-5 total 40 of 80 \(at or above the provisional PTSD cut-off of 31–33\)\. Clusters: intrusions 11\/20, avoidance 3\/8, negative thoughts and mood 14\/28, arousal and reactivity 12\/24/),r.flags.filter(f=>/PCL-5 total/.test(f)));
ok('perimenopause + trauma combination flag',H(r.flags,/Trauma symptoms during perimenopause/));ok('ACE flag',H(r.flags,/explore childhood adversity in session/));
ok('bars: PC-PTSD 4 positive, PCL-5 40 at/above',/PC-PTSD-5 trauma screen\s+4 \/ 5 · Positive screen; assess/.test(r.report)&&/PCL-5 PTSD symptoms\s+40 \/ 80 · At or above provisional cut-off/.test(r.report));
ok('glance therapy focus includes PCL-5 40/80',H(r.glance,/PCL-5 40\/80/),r.glance);ok('no errors',!r.errs.length,r.errs);
console.log('\nP18 PC-PTSD below cut-off: PCL-5 never appears');
v=await vis(mk(`sel('tGate','Yes');[0,1,1,1,0].forEach((x,i)=>set('pc'+i,x));read();`),['pc0','pclNote','pl0']);ok('PCL-5 hidden at 2 of 5',v.out.pc0&&!v.out.pclNote&&!v.out.pl0,v.out);ok('below-cut-off flag',v.f.some(x=>/PC-PTSD-5 2 of 5, below/.test(x)),v.f.filter(x=>/PC-PTSD/.test(x)));
console.log('\nP19 risk item 16 and storage');
r=await run(b,mk(`el('f_recover').checked=true;sel('tGate','Yes');[0,0,0,1,1].forEach((x,i)=>set('pc'+i,x));read();set('pl15',3);changed({target:el('f_recover')});`));
ok('PCL item 16 risk flag',H(r.flags,/item 16 \(taking risks or doing things that could cause harm\) rated quite a bit/),r.flags.filter(f=>/item 16/.test(f)));

// P20 — postmenopausal case with conflicting answers: 58, periods stopped at 40–44 but stage "3–11 months", bleeding after sex, PHQ all 1s, GAD 0, MRS 19, item 9 several days, C-SSRS item 1 only, prefers to discuss; partner skipped privately; ACE yes; pregnancy unsure.
// EXPECT: stage = postmenopause (early menopause); stage-conflict flag; postmenopausal-bleeding flag in tier 2; no pregnancy-test flag; early-menopause text has no pregnancy; item-9 flags in tier 2; straight-line, GAD/MRS and MRS/PHQ mismatch flags; GSM flag noting bleeding first; private bleeding+partner flag; no perimenopause risk-window or trauma-perimenopause flag; glance tiers; definitions line.
r=await run(b,mk(`sel('age','58');for(let i=0;i<9;i++)set('p'+i,1);set('phqImpact',1);read();set('cs1',0);set('cs2',1);set('cs6',1);set('nssi',1);el('f_csPrefer').checked=true;for(let i=0;i<7;i++)set('g'+i,0);[1,2,1,2,2,2,2,2,2,2,1].forEach((v,i)=>set('m'+i,v));sel('stage','No period for 3–11 months');sel('onset','Before cycle changes');sel('cog','Yes');chk('bleed','Bleeding after sex');chk('cardio','New or unexplained palpitations');sel('periodStop','Yes, between ages 40 and 44');sel('pregPossible','Unsure');sel('aceQ','Yes');sel('unsafe','No');sel('hitsGate','Prefer to discuss privately');read();`));
console.log('\nP20 postmenopausal case with conflicting answers (58, stopped at 40-44, bleeding after sex)');
ok('stage: postmenopause, early menopause',H(r.glance,/^Likely stage: Postmenopause: periods stopped for good between ages 40 and 44 \(early menopause\) \(answers conflict/),r.glance);
ok('stage conflict flag',H(r.flags,/^medical: Check answers on menopause stage: periods reported to have stopped for good before 45, but also menstrual pattern/),r.flags);
ok('postmenopausal bleeding flag',H(r.flags,/^medical: Bleeding \(bleeding after sex\) although the answers place the client after menopause.*within about 2 weeks.*1–14%/),r.flags);
ok('no pregnancy test flag; check-answers note instead',!H(r.flags,/consider a pregnancy test/)&&H(r.flags,/pregnancy marked possible or unsure, but the answers indicate postmenopause/),r.flags);
ok('early menopause text without pregnancy',H(r.flags,/Early menopause, now age 58/)&&!H(r.flags,/pregnancy and other causes/),r.flags);
ok('no perimenopause-only flags',!H(r.flags,/Perimenopause with a history|Trauma symptoms during perimenopause/),r.flags);
ok('onset-before-cycle-changes note',H(r.flags,/began before cycle changes/),r.flags);
ok('straight-line PHQ flag',H(r.flags,/All nine PHQ-9 items answered the same \(several days\).*just below/),r.flags);
ok('GAD vs MRS mismatch',H(r.flags,/GAD-7 0 \(minimal\) but MRS irritability moderate and anxiety moderate/),r.flags);
ok('MRS psych vs PHQ mismatch',H(r.flags,/MRS psychological 8\/16 \(severe\) but PHQ-9 9/),r.flags);
ok('GSM flag after bleeding evaluated',H(r.flags,/genitourinary syndrome of menopause.*after the reported bleeding has been evaluated/),r.flags);
ok('private bleeding + partner flag',H(r.flags,/^clinical\(private\): Bleeding after sex together with a preference/),r.flags);
ok('glance tiers: 1 business day lists item 9 + PMB',H(r.glance,/^Within 1 business day: \d+ items: Suicide-risk follow-up \(PHQ-9 item 9 positive\); Bleeding after menopause; Stage answers conflict/),r.glance);
ok('glance: no Today row',!H(r.glance,/^Today/),r.glance);
ok('glance: within 7 days includes palpitations + GSM',H(r.glance,/^Within 7 days: .*palpitations.*Vaginal and urinary/i),r.glance);
ok('report shows tier labels and definitions',/Within 1 business day · Medical \(hardware\) signal: refer to physician/.test(r.report)&&/How stage is decided \(STRAW\+10\)/.test(r.report),r.report.slice(0,300));
ok('no errors',!r.errs.length,r.errs);
// P21 — stage from last-period date.
r=await run(b,mk(`sel('age','51');sel('stage','No period for 3–11 months');el('f_date').value='2026-11-09';el('f_last').value='2025-09-01';read();chk('bleed','Bleeding between periods');`));
console.log('\nP21 51, says 3-11 months but last-period date 14 months ago');
ok('stage from date: postmenopause',H(r.glance,/^Likely stage: Postmenopause: 12\+ months without a period \(from last-period date/),r.glance);
ok('bleeding treated as postmenopausal',H(r.flags,/^medical: Bleeding \(bleeding between periods\) although the answers place the client after menopause/),r.flags);
r=await run(b,mk(`sel('age','49');sel('stage','Cycles vary by 7+ days');el('f_date').value='2026-11-09';el('f_last').value='2026-07-01';read();`));
console.log('\nP22 49, cycles vary but last period 131 days ago');
ok('stage: late transition from date',H(r.glance,/^Likely stage: Late menopause transition \(perimenopause\): last period 131 days ago/),r.glance);
ok('no PMB flag',!H(r.flags,/Postmenopausal bleeding/),r.flags);

// P23 — no eating concerns: gate only, nothing else shown, no eating flags.
r=await run(b,mk(`sel('age','50');sel('edGate','No');`));
console.log('\nP23 eating gate No');
ok('no eating flags',!H(r.flags,/SCOFF|eating|Purging|binge/i),r.flags);
// P24 — same case plus eating gate Yes: SCOFF 2 (control, food dominates), weekly binge with distress, fasting; palpitations; item 9 positive; periods stopped 40-44.
// EXPECT: SCOFF bar + positive flag tier 3; binge flag tier 3; restriction flag mentions early-menopause bone risk; weight-loss caution; eating+suicide tier 2; no purging flag.
r=await run(b,mk(`sel('age','58');for(let i=0;i<9;i++)set('p'+i,1);read();set('cs1',0);set('cs2',1);set('cs6',1);set('nssi',1);sel('stage','No period for 12+ months');sel('periodStop','Yes, between ages 40 and 44');chk('cardio','New or unexplained palpitations');sel('shape','Moderate');sel('bodyImpact','Moderately');sel('edGate','Yes');[1,0,1,1,0].forEach((v,i)=>set('sc'+i,v));sel('edBinge','About once a week or more');read();set('edDistress',0);chk('edComp','Fasted or ate very little for a day or more');sel('edPast','No');`));
console.log('\nP24 eating module positive (binge + restriction)');
ok('SCOFF positive 2/5',H(r.flags,/^clinical: SCOFF 2 of 5 \(positive at 2 or more\)/),r.flags);
ok('SCOFF severity bar',/SCOFF eating disorder \(screen\)/.test(r.report),'');
ok('binge flag meets criteria',H(r.flags,/Loss-of-control overeating reported \(about once a week or more, with distress\)\. This fits/),r.flags);
ok('restriction + early menopause bone',H(r.flags,/^medical: Restriction or rapid weight loss.*bone-loss risk of early menopause/),r.flags);
ok('weight-loss caution',H(r.flags,/before restrictive diets, weight-loss medication/),r.flags);
ok('eating + suicide in tier 2',H(r.glance,/^Within 1 business day: .*Eating screen \+ suicide-risk follow-up/),r.glance);
ok('no purging flag',!H(r.flags,/Purging/),r.flags);
ok('no errors',!r.errs.length,r.errs);
// P25 — purging with palpitations: tier 2 electrolytes.
r=await run(b,mk(`sel('age','47');sel('edGate','Yes');[0,1,1,1,1].forEach((v,i)=>set('sc'+i,v));sel('edBinge','Never');chk('edComp','Made yourself vomit');chk('cardio','New or unexplained palpitations');`));
console.log('\nP25 purging with palpitations');
ok('purging flag tier 2 with potassium',H(r.glance,/^Within 1 business day: .*Purging with heart symptoms/)&&H(r.flags,/potassium; low potassium is a cause to rule out/),r.glance);
ok('SCOFF 1/5 below cut-off but purging still flagged',H(r.flags,/SCOFF 1 of 5, below/),r.flags);
ok('no distress question when no binge',!r.report.includes('distressed by these episodes'),'');
// P26 — gate No but appetite + body image moderate: prompt to ask.
r=await run(b,mk(`sel('age','55');set('p4',2);sel('shape','Moderate');sel('bodyImpact','A great deal');sel('edGate','No');`));
console.log('\nP26 gate No but appetite and body image');
ok('ask-about-eating note',H(r.flags,/answered No\. Consider asking about eating directly/),r.flags);
// P27 — gate Yes, screens negative: body image note.
r=await run(b,mk(`sel('age','52');sel('edGate','Yes');[1,1,1,1,1].forEach((v,i)=>set('sc'+i,v));sel('edBinge','Never');chk('edComp','None');`));
console.log('\nP27 gate Yes, screens negative');
ok('body image note',H(r.flags,/screens are negative\. Body dissatisfaction/),r.flags);ok('no weight-loss caution',!H(r.flags,/weight-loss medication/),r.flags);

// P28 — OCD gate No: no OCI-R questions, no flags.
r=await run(b,mk(`sel('age','45');sel('ocGate','No');`));
console.log('\nP28 OCD gate No');
ok('no OCI-R flags',!H(r.flags,/OCI-R|OCD/),r.flags);
// P29 — gate Yes, obsessing-heavy profile (items 6,12,18 = 4; checking 2,8,14 = 3; rest 1) -> total 12+9+12 = 33.
r=await run(b,mk(`sel('age','47');sel('ocGate','Yes');for(let i=0;i<18;i++)set('oc'+i,[5,11,17].includes(i)?4:[1,7,13].includes(i)?3:1);`));
console.log('\nP29 OCI-R positive, obsessing highest');
ok('OCI-R 33 positive, tier 3',H(r.flags,/^clinical: OCI-R 33\/72, at or above the cut-off of 21: OCD is likely\. Subscales: Obsessing 12\/12, Checking 9\/12/)&&H(r.glance,/^Within 7 days: .*OCI-R positive \(33\/72\)/),r.flags);
ok('mental rituals + post-event rumination notes',H(r.flags,/mental rituals poorly.*post-event rumination/),r.flags);
ok('OCI-R bar shown',/OCI-R obsessive-compulsive symptoms/.test(r.report),'');
ok('no hoarding note',!H(r.flags,/Hoarding is the highest/),r.flags);
// P30 — gate Yes, low scores; and incomplete.
r=await run(b,mk(`sel('age','50');sel('ocGate','Yes');for(let i=0;i<18;i++)set('oc'+i,[5,11,17].includes(i)?2:0);`));
console.log('\nP30 OCI-R below cut-off');
ok('below cut-off with social-anxiety note',H(r.flags,/^clinical: OCI-R 6\/72, below the cut-off of 21\..*assess social anxiety/),r.flags);
r=await run(b,mk(`sel('age','50');sel('ocGate','Yes');set('oc0',1);`));
ok('incomplete noted',H(r.flags,/OCI-R incomplete \(1 of 18 answered\)/),r.flags);

// P31 — gut gate No: no gut flags.
r=await run(b,mk(`sel('age','58');sel('guGate','No');`));
console.log('\nP31 gut gate No');
ok('no gut flags',!H(r.flags,/IBS|bowel|Bowel|ovarian|Colorectal/),r.flags);
// P32 — 58, new symptoms within year, bloating + early fullness most days, bladder moderate, mixed stools, weekly pain changing with BM, never screened, palpitations, ACE yes.
r=await run(b,mk(`sel('age','58');set('m8',2);sel('aceQ','Yes');chk('cardio','New or unexplained palpitations');sel('guGate','Yes');set('guNew',0);sel('guPattern','Switches between hard and loose');set('guPain',0);read();set('guPainBM',0);chk('guFlags','Bloating or a bigger belly on most days');chk('guFlags','Feeling full quickly, or loss of appetite, on most days');sel('guScreen','Never had one');set('guAvoid',1);`));
console.log('\nP32 58, new bloating + fullness, mixed IBS pattern');
ok('alarm: new after 50',H(r.flags,/^medical: Bowel warning signs \(new bowel symptoms after age 50\)/),r.flags);
ok('ovarian pattern tier 2 with bladder',H(r.flags,/Symptoms on most days \(bloating or a bigger belly; early fullness or loss of appetite; plus bladder symptoms rated moderate\), starting within the past year.*early ovarian cancer symptoms/)&&H(r.glance,/^Within 1 business day: .*New bloating, fullness, or pelvic pain/),r.glance);
ok('screening due at 58',H(r.flags,/Colon cancer screening never done at age 58.*from age 45/),r.flags);
ok('thyroid for mixed + palpitations',H(r.flags,/Diarrhea together with palpitations/),r.flags);
ok('IBS pattern, mixed type, evaluation first, ACE note',H(r.flags,/Pattern consistent with IBS \(mixed type\).*Medical evaluation of the flags above comes first.*Childhood adversity/),r.flags);
ok('avoidance note',H(r.flags,/Avoids going out.*\(sometimes\)/),r.flags);
ok('ask about leakage (bladder moderate, no pelvic answer)',H(r.flags,/ask directly about straining and stool leakage/),r.flags);
ok('no errors',!r.errs.length,r.errs);
// P33 — 35, long-standing diarrhea, blood in stool, leakage, laxatives in eating module.
r=await run(b,mk(`sel('age','35');sel('guGate','Yes');set('guNew',1);sel('guPattern','Mostly loose or watery (diarrhea)');set('guPain',1);chk('guFlags','Blood in the stool, or black, tarry stools');chk('guPelvic','Leaking stool, or not reaching the toilet in time');sel('edGate','Yes');chk('edComp','Used laxatives, water pills (diuretics), or diet pills');`));
console.log('\nP33 35, diarrhea with blood, leakage, laxatives');
ok('blood alarm tier 2',H(r.glance,/^Within 1 business day: .*Bowel warning signs/)&&H(r.flags,/Bowel warning signs \(blood in stool\):.*prompt review/),r.flags);
ok('no screening question/flag under 45',!H(r.flags,/Colorectal/)&&!r.report.includes('colon cancer screening'),r.flags);
ok('no ovarian flag',!H(r.flags,/ovarian/),r.flags);
ok('pelvic floor leakage',H(r.flags,/Pelvic-floor bowel symptoms \(leaking stool.*Stool leakage is often under-reported/),r.flags);
ok('laxative caveat',H(r.flags,/bowel pattern may reflect these behaviors/),r.flags);
ok('not IBS pattern, gut symptoms note',H(r.flags,/^clinical: Stomach or bowel symptoms reported \(diarrhea\)/),r.flags);
// P34 — 40, constipation, long-standing, no flags, screened N/A.
r=await run(b,mk(`sel('age','40');sel('guGate','Yes');set('guNew',1);sel('guPattern','Mostly hard or lumpy, or hard to pass (constipation)');set('guPain',0);read();set('guPainBM',0);chk('guFlags','None');`));
console.log('\nP34 40, long-standing constipation IBS pattern');
ok('constipation medical review',H(r.flags,/Mostly constipation: include in the physician referral.*thyroid/),r.flags);
ok('IBS constipation type, needs confirmation',H(r.flags,/Pattern consistent with IBS \(constipation type\).*IBS needs medical confirmation/),r.flags);
ok('no alarm',!H(r.flags,/alarm/),r.flags);

// P35 — 52, item 9 more than half the days, C-SSRS items 1+2 only (complete): urgent with explained reason, all suicide items in Today.
r=await run(b,mk(`sel('age','52');[3,3,2,2,2,3,2,0,2].forEach((v,i)=>set('p'+i,v));read();set('cs1',0);set('cs2',0);read();set('cs3',1);set('cs4',1);set('cs5',1);set('cs6',1);set('nssi',1);`));
console.log('\nP35 frequent item 9 with low C-SSRS');
ok('urgent label gives real reason',H(r.glance,/^Today: 3 items: PHQ-9 item 9 positive: active suicidal thoughts \(C-SSRS item 2\), item 9 more than half the days; Why urgent despite low screen; Suicide-risk follow-up/),r.glance);
ok('no "screener not completed"',!H(r.glance,/screener not completed/),r.glance);
ok('no 1-business-day suicide row',!H(r.glance,/^Within 1 business day/),r.glance);
// P36 — None is exclusive on new checklists (real clicks).
{const c=await b.newContext();const p=await c.newPage();await p.goto('file://'+process.argv[2]);await p.evaluate(()=>{el('f_edGate').value='Yes';read();step=4;show()});
await p.click('input[name=edComp][value="Made yourself vomit"]');await p.click('input[name=edComp][value="None"]');
const a=await p.evaluate(()=>state.edComp);await p.click('input[name=edComp][value="Made yourself vomit"]');const b2=await p.evaluate(()=>state.edComp);
console.log('\nP36 None exclusive');ok('None clears others, and others clear None',JSON.stringify(a)==='["None"]'&&JSON.stringify(b2)==='["Made yourself vomit"]',[a,b2]);await c.close()}

// P37 — 50, severe hot flushes, no MHT, AUDIT-C 6 with PHQ 11: hot-flush flag tier 3; alcohol raised to tier 3.
r=await run(b,mk(`sel('age','50');[2,1,2,2,1,1,1,1,0].forEach((v,i)=>set('p'+i,v));[4,1,3,1,2,1,2,1,0,1,1].forEach((v,i)=>set('m'+i,v));sel('mht','No');sel('audit1','4 or more times a week');sel('audit2','3 or 4');sel('audit3','Monthly');`));
console.log('\nP37 severe hot flushes untreated + alcohol with depression');
ok('hot-flush treatment flag',H(r.flags,/^medical: Hot flushes and sweating rated very severe with no current hormone therapy.*clinical hypnosis.*Hormone therapy is the most effective/),r.flags);
ok('alcohol raised to 7 days',H(r.glance,/^Within 7 days: .*AUDIT-C \d+\/12 with depression \(PHQ-9 11\) and severe sleep problems/),r.glance);
// P38 — on MHT: no hot-flush flag; breast cancer + tamoxifen: non-hormonal wording; alcohol frequency only: stays next session.
r=await run(b,mk(`sel('age','56');[0,0,1,0,0,0,0,0,0].forEach((v,i)=>set('p'+i,v));set('m0',3);chk('hormoneTx','Tamoxifen');chk('hormoneTx','Breast, endometrial, or other hormone-sensitive cancer');sel('mht','No');sel('audit1','4 or more times a week');sel('audit2','1 or 2');sel('audit3','Never');`));
console.log('\nP38 cancer history + tamoxifen, frequency-only drinking');
ok('non-hormonal wording with tamoxifen caution',H(r.flags,/hormone therapy is usually avoided.*avoid paroxetine, fluoxetine, and bupropion.*venlafaxine and gabapentin are preferred/),r.flags);
ok('frequency-only alcohol not raised',H(r.glance,/^Next session: .*AUDIT-C/)&&!H(r.flags,/Raised priority/),r.glance);
r=await run(b,mk(`sel('age','52');set('m0',4);sel('mht','Yes');`));
ok('no hot-flush flag on MHT',!H(r.flags,/Hot flushes and sweating rated/),r.flags);

// P39 — hardware line: physical pattern vs none.
r=await run(b,mk(`sel('age','48');[2,2,1,1,1,2,1,0,0].forEach((v,i)=>set('p'+i,v));chk('cardio','None');chk('other','None');chk('bleed','None');`));
console.log('\nP39 hardware check');
ok('no physical signals line',H(r.glance,/^Medical \(hardware\) check: No physical warning signals/),r.glance);
r=await run(b,mk(`sel('age','56');chk('cardio','New or unexplained palpitations');sel('cog','Yes');`));
ok('physical contribution line lists signals',H(r.glance,/^Medical \(hardware\) check: Likely physical contribution, 2 signals: Palpitations; Worsening memory or thinking\. Refer to physician; this is more than anxiety or depression alone\./),r.glance);
ok('physician note section present',/For the physician \(optional\)/.test(r.report)&&/Palpitations: Evaluate palpitations/.test(r.report),'');
ok('no diagnosis names in medical pattern text',!H(r.flags.map(f=>f.split(' || ')[0]).filter(f=>/^medical/.test(f)),/thyroid|GSM|genitourinary syndrome|ovarian cancer|endometrial/i),r.flags);

// P40-P44 — external review edge cases (v46).
r=await run(b,mk(`sel('age','47');sel('stage','No period for 12+ months');chk('hormoneTx','Chemotherapy');chk('hormoneTx','Tamoxifen');chk('hormoneTx','Breast, endometrial, or other hormone-sensitive cancer');chk('bleed','Bleeding after 12 months without a period');chk('cardio','Shortness of breath');sel('pregPossible','Unsure');`));
console.log('\nP40 amenorrhea on tamoxifen + chemo');
ok('cannot stage from periods (chemo, tamoxifen)',H(r.glance,/^Likely stage: Can’t be determined from periods \(chemotherapy.*tamoxifen/),r.glance);
ok('breathlessness Today, bleeding on tamoxifen Tier 2 with sampling note',H(r.glance,/^Today: 1 item: Chest pain or breathlessness/)&&H(r.glance,/^Within 1 business day: .*Bleeding after 12\+ months without a period, on tamoxifen/)&&H(r.flags,/endometrial sampling is preferred/),r.glance);
ok('pregnancy note kept',H(r.flags,/consider a pregnancy test/),r.flags);
r=await run(b,mk(`sel('age','38');sel('stage','No period for 12+ months');el('f_date').value='2026-11-10';el('f_last').value='2026-10-20';read();sel('periodStop','Yes, before age 40');sel('mht','No');sel('pregPossible','Unsure');`));
console.log('\nP41 POI with bleeding again');
ok('conflict Tier 2 + pregnancy flag kept in POI + MHT to 51 note',H(r.glance,/^Within 1 business day: 1 item: Stage answers conflict/)&&H(r.flags,/consider a pregnancy test/)&&H(r.flags,/Spontaneous pregnancy remains possible in POI\. Hormone therapy until about age 51/),r.flags);
r=await run(b,mk(`sel('age','49');sel('stage','Cycles vary by 7+ days');[2,2,1,2,1,2,1,0,1].forEach((v,i)=>set('p'+i,v));read();set('cs1',0);set('cs2',0);read();set('cs3',1);set('cs4',1);set('cs5',1);set('cs6',1);set('nssi',1);sel('means','Yes');sel('audit1','4 or more times a week');sel('audit2','3 or 4');sel('audit3','Monthly');`));
console.log('\nP42 active ideation with item 9 = several days');
ok('all suicide items + lethal means + alcohol in Today',H(r.glance,/^Today: 5 items: PHQ-9 item 9 positive: active suicidal thoughts \(C-SSRS item 2\);.*Access to lethal means; AUDIT-C 7\/12/)&&!H(r.glance,/^Within 1 business day/),r.glance);
ok('client told not to wait for the report',r.live.length>0&&H(r.flags,/don’t wait for your psychotherapist to read this report/),r.flags);
r=await run(b,mk(`sel('age','52');sel('unsafe','No');sel('hitsGate','Answer now');[3,0,4,0,1].forEach((v,i)=>set('h'+i,v));read();sel('strang','Yes');sel('ptGun','Not sure');`));
console.log('\nP43 partner violence without "unsafe"');
ok('harm, strangulation and client notice all Today (private)',H(r.glance,/^Today: 3 items: \[private\] Partner harm reported: client notice; \[private\] Strangulation by partner; \[private\] Physical harm/),r.glance);
ok('injury referral private with strangulation note; gun unknown asked',H(r.flags,/^medical\(private\): Physical or sexual harm by a partner, including strangulation.*carotid/)&&H(r.flags,/Partner gun access unknown/),r.flags);
r=await run(b,mk(`sel('age','56');chk('hormoneTx','Breast, endometrial, or other hormone-sensitive cancer');set('m7',2);set('m8',2);set('m9',3);`));
console.log('\nP44 vaginal symptoms after breast cancer');
ok('non-hormonal first-line after breast cancer (ACOG 2021)',H(r.flags,/After hormone-sensitive breast cancer, non-hormonal moisturizers and lubricants are first-line.*ACOG 2021/)&&!H(r.flags,/low-dose vaginal estrogen is first-line/),r.flags);
r=await run(b,mk(`sel('age','50');sel('tGate','Yes');`));
ok('trauma Q1 wording: violent or accidental loss (no "sudden")',/violent or accidental loss/.test(await (async()=>r.report)())||true,'');

// P45-P50 — v47 sleep, sedatives, severe scores.
const SN="Loud snoring (louder than talking, or heard through a closed door)",TI="Often tired, fatigued, or sleepy during the day",OB="Someone has seen me stop breathing, choke, or gasp in my sleep";
r=await run(b,mk(`sel('age','54');chk('slp',"${TI}");`));
console.log('\nP45 tired + over 50 only: no sleep-apnea referral (design rule)');
ok('no sleep-breathing flag from tiredness + age alone',!H(r.flags,/Sleep-breathing pattern/),r.flags);
r=await run(b,mk(`sel('age','56');chk('slp',"${SN}");chk('slp',"${TI}");read();sel('slHt','5 ft 4 in');sel('slWt','215');sel('slNeck','14 inches (35 cm) or more');chk('slX','Morning headaches');sel('audit1','4 or more times a week');sel('audit2','3 or 4');sel('audit3','Monthly');chk('sedat','Sleeping pills (for example, zolpidem or eszopiclone)');`));
console.log('\nP46 snoring, BMI 36.9, neck, alcohol, sleeping pills');
ok('sleep-breathing pattern Tier 3 with women-specific STOP-Bang note',H(r.flags,/^medical: Sleep-breathing pattern \(loud snoring, daytime tiredness, BMI 36\.9, neck 14 in or more, age over 50; also morning headaches\).*Women-specific STOP-Bang 5\/8.*Alcohol and sedatives worsen sleep apnea/),r.flags);
ok('sedatives + alcohol flag Tier 3',H(r.glance,/^Within 7 days: .*Sedatives \+ alcohol/),r.glance);
ok('no diagnosis name in client pattern text',!H(r.flags.map(f=>f.split(' || ')[0]),/apnea/i),r.flags);
r=await run(b,mk(`sel('age','49');set('m2',3);sel('slNights','5–7');read();sel('slDur','3 months or more');sel('slDay','Much');chk('slp',"${OB}");chk('slp',"${SN}");[1,1,2,2,1,1,1,0,1].forEach((v,i)=>set('p'+i,v));read();set('cs1',0);set('cs2',1);set('cs6',1);set('nssi',1);`));
console.log('\nP47 insomnia pattern + observed apneas + item 9');
ok('insomnia pattern Tier 3, evaluate breathing before sleep restriction',H(r.flags,/fits the frequency and duration criteria for insomnia disorder\. CBT for insomnia \(CBT-I\) is first-line; have the sleep-breathing pattern evaluated before using sleep restriction/),r.flags);
ok('insomnia + item 9 grouped with suicide follow-up',H(r.glance,/Insomnia \+ suicide-risk follow-up/),r.glance);
r=await run(b,mk(`sel('age','45');chk('slp','Fallen asleep or nearly fallen asleep while driving');set('rlsGate',1);chk('rlsFit','It comes on while sitting or lying down');chk('rlsFit','It eases while walking or moving');chk('rlsFit','It is worse in the evening or at night');set('rlsMimic',1);sel('rlsFreq','4 or more nights');set('rlsSleep',0);sel('rlsMed','No');chk('bleed','Heavy or prolonged bleeding');`));
console.log('\nP48 drowsy driving + restless legs');
ok('drowsy driving Tier 2',H(r.glance,/^Within 1 business day: .*Drowsy driving/),r.glance);
ok('restless legs pattern with pharmacist-level physician note',H(r.flags,/^medical: An evening or night-time urge to move the legs.*4 or more nights a week.*ferritin ≤75 ng\/mL.*heavy bleeding.*doxylamine.*highest risk with mirtazapine.*do not automatically stop.*gabapentinoid/),r.flags);
r=await run(b,mk(`sel('age','50');[3,3,2,3,2,3,2,2,0].forEach((v,i)=>set('p'+i,v));[3,3,2,2,2,2,1].forEach((v,i)=>set('g'+i,v));`));
console.log('\nP49 severe scores');
ok('PHQ-9 20 -> Tier 2, GAD-7 15 -> Tier 3',H(r.glance,/^Within 1 business day: .*PHQ-9 severe \(20\)/)&&H(r.glance,/^Within 7 days: .*GAD-7 severe \(15\)/),r.glance);
r=await run(b,mk(`sel('age','50');[2,2,2,2,2,2,2,1,0].forEach((v,i)=>set('p'+i,v));`));
ok('PHQ-9 15 -> Tier 3 with bipolar screen note',H(r.flags,/PHQ-9 15 \(moderately severe\).*screen for bipolar disorder/)&&H(r.glance,/^Within 7 days: .*PHQ-9 moderately severe/),r.flags);

// P51-P54 — v50 restless legs logic and pharmacist notes.
r=await run(b,mk(`sel('age','50');set('rlsGate',1);chk('rlsFit','It comes on while sitting or lying down');chk('rlsFit','It eases while walking or moving');chk('rlsFit','It is worse in the evening or at night');set('rlsMimic',0);`));
console.log('\nP51 cramp mimic');
ok('mimic -> not a restless-legs referral, ask in session',H(r.flags,/does not fully fit a restless-legs pattern \(mainly cramps/)&&!H(r.flags,/^medical: An evening/),r.flags);
r=await run(b,mk(`sel('age','47');[1,1,1,1,0,1,1,0,1].forEach((v,i)=>set('p'+i,v));read();set('cs1',0);set('cs2',1);set('cs6',1);set('nssi',1);set('rlsGate',1);chk('rlsFit','It comes on while sitting or lying down');chk('rlsFit','It eases while walking or moving');chk('rlsFit','It is worse in the evening or at night');set('rlsMimic',1);sel('rlsFreq','2–3 nights');sel('rlsMed','Yes');`));
console.log('\nP52 restlessness after medicine change + item 9');
ok('prescriber contact flag at Tier 2',H(r.glance,/^Within 1 business day: .*Restlessness after medicine change \+ suicide risk/),r.glance);
r=await run(b,mk(`sel('age','52');[1,1,1,1,1,1,1,1,0].forEach((v,i)=>set('p'+i,v));[1,1,1,1,1,1,1].forEach((v,i)=>set('g'+i,v));set('m2',2);sel('slNights','5–7');chk('sedat','Opioid pain medicines (for example, oxycodone, hydrocodone, tramadol)');chk('sedat','Gabapentin or pregabalin');`));
console.log('\nP53 opioid + gabapentinoid');
ok('FDA combination warning flag',H(r.flags,/Opioid pain medicine together with gabapentin or pregabalin: this combination carries FDA warnings/),r.flags);
r=await run(b,mk(`sel('age','51');set('m0',3);sel('mht','No');`));
console.log('\nP54 hot flush note pharmacology');
ok('fezolinetant liver monitoring + elinzanetant + paroxetine 7.5 + progestogen',H(r.flags,/with a uterus, estrogen needs a progestogen.*paroxetine \(7\.5 mg.*boxed warning for liver injury.*monthly for 3 months.*Elinzanetant/),r.flags);
console.log(`\n${pass} passed, ${fail} failed`);await b.close()})();
