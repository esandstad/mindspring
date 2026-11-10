const {chromium,devices}=require('playwright');
const F='file://'+process.argv[2],OUT=process.argv[3];let pass=0,fail=0;
const ok=(name,cond,extra='')=>{cond?pass++:fail++;console.log((cond?'PASS ':'FAIL ')+name+(cond?'':'  '+extra))};
async function page(b){const ctx=await b.newContext({...devices['iPhone 13'],acceptDownloads:true});await ctx.route('https://weather.com/**',r=>r.fulfill({body:'weather'}));const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto(F);return p}
const go=(p,n)=>p.evaluate(n=>{step=n;show()},n);
const R=(p,name,v)=>p.click(`input[name="${name}"][value="${v}"]`);
const fl=p=>p.evaluate(()=>flags().map(f=>f[0]+': '+f[1]));
const live=p=>p.evaluate(()=>[...document.querySelectorAll('#safetyLive strong')].map(x=>x.textContent));
const Y=0,N=1;const has=(a,re)=>a.some(x=>re.test(x));
(async()=>{const b=await chromium.launch();const errs=[];let p,f;
// 1 low, complete
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',Y);await R(p,'cs2',N);await R(p,'cs6',N);
f=await fl(p);ok('1 low: no false "not answered"',!has(f,/not answered/),f);ok('1 low: client banner softened',!(await live(p)).includes('Safety notice')&&(await live(p)).includes('Please share this with your clinician'),await live(p));ok('1 low: clinician item-9 flag kept',has(f,/item 9 positive \(several days\)\. Any positive/));errs.push(...p.errs);
// 2 moderate
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',Y);await R(p,'cs2',Y);await R(p,'cs3',Y);await R(p,'cs4',N);await R(p,'cs5',N);await R(p,'cs6',N);
f=await fl(p);ok('2 moderate: no "not answered"',!has(f,/not answered/));ok('2 moderate: red item-9 + reach-out banner',JSON.stringify(await live(p))==='["Safety notice","Please reach out soon"]',await live(p));errs.push(...p.errs);
// 3 nssi only
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'nssi',Y);f=await fl(p);
ok('3 self-harm only: not-answered + self-harm flags, no mismatch',has(f,/not answered/)&&has(f,/Self-harm without/)&&!has(f,/C-SSRS negative/),f);errs.push(...p.errs);
// 4 timing pending
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',N);await R(p,'cs2',N);await R(p,'cs6',Y);
let l=await live(p);ok('4 timing blank on step: "One more question", no high alert',l.includes('One more question')&&!(await p.locator('#safetyLive').innerText()).includes('high risk'),l);
ok('4 timing blank in report: High',await p.evaluate(()=>cssrsLevel(true).level)==='High');
await go(p,2);ok('4 after leaving step: high alert shown',(await p.locator('#safetyLive').innerText()).includes('high risk'));
await go(p,1);await R(p,'cs6b',N);ok('4 timing answered >3mo: Moderate',await p.evaluate(()=>cssrsLevel(true).level)==='Moderate');errs.push(...p.errs);
// 5 partial
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',N);f=await fl(p);
ok('5 partial: incomplete flag, no mismatch',has(f,/incomplete/)&&!has(f,/C-SSRS negative/),f);ok('5 partial: red banner kept',(await live(p)).includes('Safety notice'));
// 6 full negative
await R(p,'cs2',N);await R(p,'cs6',N);f=await fl(p);ok('6 full negative: mismatch flag',has(f,/C-SSRS negative/)&&!has(f,/incomplete/),f);errs.push(...p.errs);
// 7 privacy
p=await page(b);await go(p,7);await p.selectOption('#f_unsafe','Yes');ok('7 unsafe notice shows on safety step',(await live(p)).includes('Safety notice'));
await p.selectOption('#f_hitsGate','Answer now');
// 8 E-HITS
for(const [i,v] of [[0,0],[1,1],[2,0],[3,1],[4,0]])await R(p,'h'+i,v);ok('8 E-HITS two "Rarely" = 7, positive',await p.evaluate(()=>hitsScore())===7&&has(await fl(p),/E-HITS\) positive: 7\/25/));
await R(p,'h1',0);await R(p,'h3',0);ok('8 E-HITS all Never = 5, negative',await p.evaluate(()=>hitsScore())===5&&!has(await fl(p),/E-HITS\) positive/));
await R(p,'h4',1);ok('8 forced-sex item flags on its own',has(await fl(p),/[Ff]orced sexual activity/));
await go(p,8);ok('7 unsafe notice hidden on later steps',!(await live(p)).length,await live(p));
await go(p,9);const rep=await p.locator('#report').innerText();
ok('25 no opt-out checkbox; safety answers appear in report',!(await p.$('#f_hitsPrivate'))&&/Safety at home/.test(rep)&&/E-HITS/.test(rep)&&/Discuss privately at next session/.test(rep));
ok('25 safety answers never stored, even with saving on',await p.evaluate(()=>{el('f_recover').checked=true;changed({target:el('f_recover')});const v=sessionStorage.getItem(STORE)||'';return v.length>0&&!/"unsafe"|"h0"|"h4"|"hitsGate"/.test(v)}));
const [d]=await Promise.all([p.waitForEvent('download',{timeout:5000}).catch(()=>null),p.click('#pdf')]);await d.saveAs(OUT+'/v25.pdf');errs.push(...p.errs);
p=await page(b);await go(p,7);await p.selectOption('#f_unsafe','Prefer to discuss privately');ok('25 prefer-privately flag (private group)',(await p.evaluate(()=>flags().some(f=>f[2]&&/prefers to discuss home and relationship safety privately/.test(f[1])))));errs.push(...p.errs);
// 9 masked periods
p=await page(b);await p.fill('#f_age','38');await go(p,4);await p.selectOption('#f_stage','No period for 3–11 months');ok('9 baseline: POI prompt without hysterectomy',has(await fl(p),/under age 40/));
await go(p,5);await p.click('input[name=hormoneTx][value="Hysterectomy (uterus removed), ovaries kept"]');f=await fl(p);
ok('9 hysterectomy kept, no symptoms: no POI/period flag or masked note, question hidden',!has(f,/under age 40|Periods stopped|can’t be used/)&&!(await p.isVisible('#q_periodStop')),f);
await p.click('input[name=hormoneTx][value="None"]');await p.click('input[name=contraNow][value="Hormonal IUD"]');ok('9 IUD, no symptoms: no masked flag',!has(await fl(p),/can’t be used/));
await go(p,3);await R(p,'m0',2);ok('9 IUD + moderate hot flushes: masked flag',has(await fl(p),/hormonal iud/i));
await go(p,5);await p.click('input[name=contraNow][value="Pill, patch, or ring"]');ok('13 pill/patch/ring option exists',true);errs.push(...p.errs);
// 10 ovx age
p=await page(b);await p.fill('#f_age','55');await go(p,5);await p.click('input[name=hormoneTx][value="Both ovaries removed"]');ok('10 ovary-age field appears',await p.isVisible('#q_ovxAge'));
ok('10 age 55, no surgery age: no POI',!has(await fl(p),/before age 4/));await p.fill('#f_ovxAge','36');ok('10 surgery at 36: POI flag',has(await fl(p),/removed before age 40/));
await p.fill('#f_ovxAge','43');ok('10 surgery at 43: early surgical menopause',has(await fl(p),/before age 45/));
await p.selectOption('#f_audit1','Monthly or less');ok('12 standard drink defined',/12 oz of beer/.test(await p.locator('#q_audit2').innerText()));
await p.fill('#f_ovxAge','50');let f2=await fl(p);ok('14 surgery age 50 entered: no POI even if period answer conflicts',!has(f2,/before age 4/),f2);
ok('14 period question hidden once surgery age entered',!(await p.isVisible('#q_periodStop')));
await p.fill('#f_ovxAge','60');ok('14 surgery age > current age: note shown, falls back',await p.isVisible('#q_ovxAgeNote'));errs.push(...p.errs);
// 15 prior attempt / frequency keep red notice
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',Y);await R(p,'cs2',N);await R(p,'cs6',N);ok('15 baseline low: amber',(await live(p)).includes('Please share this with your clinician'));
await go(p,5);await p.click('input[name=history][value="Prior suicide attempt"]');ok('15 prior attempt: red notice returns',(await live(p)).includes('Safety notice'),await live(p));
ok('15 prior attempt + item 6 No: mismatch flag',has(await fl(p),/Mismatch: “prior suicide attempt”/));
await p.click('input[name=history][value="None"]');await go(p,1);await R(p,'p8',2);ok('15 item 9 "more than half the days": red notice',(await live(p)).includes('Safety notice'));
ok('16 filename has no name',await p.evaluate(()=>{state.name='Jane Doe';return !/Jane/.test(fileName())}));
// v18 additions
p=await page(b);await p.fill('#f_age','37');await p.fill('#f_date','2026-11-08');await go(p,4);await p.selectOption('#f_stage','Regular cycles');await p.fill('#f_last','2026-08-20');
ok('17 days since LMP = 80',await p.evaluate(()=>daysSinceLMP())===80);f=await p.evaluate(()=>flags());
ok('17 LMP vs regular mismatch is clinical follow-up',f.some(x=>x[0]==='clinical'&&/doesn’t match “regular cycles”/.test(x[1])));
ok('17 LMP 80 days, age 37: under-40 prompt',f.some(x=>/under age 40/.test(x[1])));
await p.selectOption('#f_stage','Periods hidden by contraception, surgery, or medication');ok('18 "periods hidden" stage turns off period flags',!has(await fl(p),/under age 40/));
await p.selectOption('#f_stage','Regular cycles');await go(p,5);await p.selectOption('#f_injection','Yes');ok('19 injection in past 12 months masks',!has(await fl(p),/under age 40/));
await p.selectOption('#f_injection','No');ok('19 stopped pill (nothing current ticked): flags still run',has(await fl(p),/under age 40/));
await p.click('input[name=other][value="Flushing with diarrhea or wheezing"]');await p.click('input[name=other][value="Milky nipple discharge, or headaches with changes in vision"]');
ok('20 carcinoid + prolactinoma items flag',has(await fl(p),/flushing with diarrhea or wheezing; milky nipple discharge/));
await p.selectOption('#f_mht','Yes');ok('21 MHT context flag',has(await fl(p),/hormone therapy: low hot-flush/));
ok('22 meds question asks for medicines, supplements and dose',/supplements/.test(await p.locator('#q_meds').innerText())&&/dose/.test(await p.locator('#q_meds').innerText()));errs.push(...p.errs);
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',Y);await R(p,'cs2',N);await R(p,'cs6',N);await go(p,5);await p.click('input[name=history][value="Self-harm without wanting to die"]');
ok('23 past self-harm history: red notice',(await live(p)).includes('Safety notice'),await live(p));
p=await page(b);await go(p,1);await R(p,'p8',1);await R(p,'cs1',Y);await R(p,'cs2',Y);await R(p,'cs3',N);await R(p,'cs4',N);await R(p,'cs5',N);await R(p,'cs6',N);
ok('24 active ideation (C-SSRS item 2) is urgent since v46: red notice',JSON.stringify(await live(p))==='["Safety notice"]',await live(p));
ok('24 active ideation tells client not to wait for the report',await p.evaluate(()=>/don’t wait for your psychotherapist/.test(document.getElementById('safetyLive').innerText)));
await p.evaluate(()=>{CONFIG.redForActiveIdeation=true;safetyLive()});ok('24 setting true: red',(await live(p)).includes('Safety notice'));errs.push(...p.errs);
// v19 additions
p=await page(b);await p.fill('#f_age','35');await go(p,4);await p.selectOption('#f_stage','No period for 3–11 months');ok('25 baseline age 35, 3+ months: POI prompt',has(await fl(p),/under age 40/));
await go(p,5);await p.click('input[name=hormoneTx][value="GnRH medication (for example, Lupron)"]');ok('25 GnRH masks period flags',!has(await fl(p),/under age 40/));
await p.click('input[name=hormoneTx][value="GnRH medication (for example, Lupron)"]');ok('25 unticked: flag back',has(await fl(p),/under age 40/));
await p.selectOption('#f_mht','Yes');ok('26 current MHT masks period flags',!has(await fl(p),/under age 40/));
await p.click('input[name=bleed][value="Bleeding after 12 months without a period"]');ok('26 PMB on MHT: withdrawal-bleed sentence',has(await fl(p),/scheduled withdrawal bleeds/));
await p.selectOption('#f_mht','No');await p.selectOption('#f_injection','Not sure');f=await fl(p);ok('27 injection "Not sure": masked + confirm note',!has(f,/under age 40/)&&has(f,/confirm the date of the last shot/));
await p.click('input[name=hormoneTx][value="Tamoxifen"]');ok('28 tamoxifen prescriber flag',has(await fl(p),/Takes tamoxifen/)&&await p.evaluate(()=>flags().some(f=>/CYP2D6/.test(f[7]||''))));
await p.click('input[name=hormoneTx][value="Aromatase inhibitor (for example, letrozole or anastrozole)"]');await p.click('input[name=hormoneTx][value="Tamoxifen"]');ok('28 aromatase inhibitor alone: no CYP2D6 flag',!has(await fl(p),/CYP2D6/));
await p.click('input[name=hormoneTx][value="Hysterectomy (uterus removed), ovaries kept"]');await p.click('input[name=hormoneTx][value="Both ovaries removed"]');
ok('29 hysterectomy-kept and both-removed are exclusive',await p.evaluate(()=>state.hormoneTx.includes('Both ovaries removed')&&!state.hormoneTx.includes('Hysterectomy (uterus removed), ovaries kept')));errs.push(...p.errs);
// 11 Esc
p=await page(b);await go(p,7);await Promise.all([p.waitForURL('https://weather.com/**',{timeout:4000}).catch(()=>{}),p.keyboard.press('Escape')]);ok('11 Esc exits on safety step',p.url().startsWith('https://weather.com'));
p=await page(b);await go(p,3);await p.keyboard.press('Escape');ok('11 Esc does nothing elsewhere',p.url().startsWith('file:'));
console.log(`\n${pass} passed, ${fail} failed; page errors: ${JSON.stringify(errs)}`);await b.close()})();
