// Builds a review case pack: runs the scenarios in tests/scenarios.js through the app and writes vignette + app output as Markdown.
const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync(__dirname+'/scenarios.js','utf8');
const S=eval(src.slice(src.indexOf('const S=[')+8,src.indexOf('];\n(async')+1));
const pre=src.match(/const pre=`([\s\S]*?)`;/)[1];
const V={
A:'41 years old, regular cycles. Mild worry and tension (GAD-7 items mostly "several days"), mood mostly fine, very few menopause symptoms. Light drinking. No trauma, feels safe at home, partner screen all "Never".',
B:'44 years old, cycle length now varies by more than 7 days. History of prior depression and PMDD. Low mood, sleep problems "more than half the days", severe sleep problems on the MRS, hot flushes moderate. Mood changes started around the time cycles changed. No thoughts of death.',
C:'47 years old with a hormonal IUD (periods hidden). Strong worry and restlessness (GAD-7 high). Answers Yes to the OCD gate: obsessing and checking high on the OCI-R, other subscales low. History of anxiety disorder.',
D:'50 years old, no period for 3–11 months. Very severe hot flushes, severe sleep problems, severe vaginal dryness, moderate sexual problems. Not on hormone therapy. Drinks 4+ times a week, 1–2 drinks, 6+ drinks monthly. Mild mood symptoms.',
E:'52 years old, 12+ months without a period. PHQ-9 total 19 with item 9 "more than half the days". C-SSRS: yes to wish to be dead and to active suicidal thoughts; no method, intent, plan, or past behavior; no self-harm. Prior depression.',
F:'55 years old, both ovaries removed at 46, breast cancer history, takes tamoxifen. Reports bleeding between periods. Not on hormone therapy. Hot flushes severe, vaginal dryness moderate. Mood mild.',
G:'57 years old, postmenopausal. Trauma gate Yes; PC-PTSD-5 4 of 5; PCL-5 46/80. Childhood adversity Yes. Partner screen: physically hurt "sometimes", insulted and threatened "fairly often", screamed at "sometimes", forced sex "never".',
H:'59 years old, postmenopausal. Bowel gate Yes: symptoms started within the past year; bloating or bigger belly and feeling full quickly on most days; weight loss she was not trying for; stools mostly normal; colonoscopy within 10 years. Bladder symptoms moderate. PHQ-9 11.',
I:'60 years old, on menopausal hormone therapy (periods hidden). Ticked "bleeding after 12 months without a period". Marked pregnancy "possible: unsure". Few mood symptoms.',
J:'45 years old, cycles vary. Attention problems since childhood, never diagnosed; memory worsening. ASRS Part A all six in the shaded range. Eating gate Yes: SCOFF 2 of 5, loss-of-control eating weekly with distress, no compensatory behaviors. Body changes affect self-image "a great deal". PHQ-9 10.',
K:'48 years old, regular cycles, no symptoms of note (control case). Answers No to every gate.',
L:'53 years old, last period about 5 months ago. Feels unsafe at home: Yes. Partner questions: prefers to discuss privately. Trauma: prefers to discuss in session. GAD-7 15, PHQ-9 12, MRS psychological severe.'};
(async()=>{const b=await chromium.launch();let md='';
for(const [name,body] of S){const k=name[0];const p=await b.newPage();await p.goto('file://'+process.argv[2]);await p.evaluate(new Function(pre+body));
const r=await p.evaluate(()=>{read();step=fields.length-1;show();const S=summary();const O=ociScore();
return {sc:'PHQ-9 '+S.ps+' · GAD-7 '+S.gs+' · MRS total '+S.mrs[0].score+' ('+S.mrs[0].band+'), psychological '+S.mrs[1].score+', somatic '+S.mrs[2].score+', urogenital '+S.mrs[3].score+(S.aud!==null?' · AUDIT-C '+S.aud:'')+(S.hits!==null?' · E-HITS '+S.hits:'')+(O&&O.total!==null?' · OCI-R '+O.total:'')+(scoffScore()!==null?' · SCOFF '+scoffScore():''),
g:glance(S),f:S.flags.map(f=>'**['+tierName[f[5]]+' · '+f[0]+(f[2]?', private':'')+']** '+f[1]+(f[7]?' *Physician note: '+f[7]+'*':''))}});
await p.close();
md+='\n### Case '+k+'\n**Vignette:** '+V[k]+'\n\n**Scores:** '+r.sc+'\n\n**Clinician box:**\n'+r.g.map(x=>'- '+x[0]+': '+x[1]).join('\n')+'\n\n**Flags (in order):**\n'+(r.f.length?r.f.map(x=>'- '+x).join('\n'):'- None')+'\n';}
fs.writeFileSync(process.argv[3],md);await b.close()})();
