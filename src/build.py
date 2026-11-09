import re,sys,os,json
# Builds ../index.html (website), ../version.json, and build/artifact.html (Claude-hosted copy, not committed).
# The version comes only from CONFIG.version in app.js.
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.dirname(HERE);os.chdir(HERE)
ver=re.search(r"version:'v(\d+)'",open('app.js',encoding='utf8').read()).group(1)
css=open('style.css').read()+'''[hidden]{display:none!important}
.mt{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}.mt th,.mt td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line)}.mt th{font-size:13px;color:var(--muted)}
h4{font-size:15px;margin:16px 0 4px}.checkline{display:flex;gap:8px;align-items:flex-start;font-weight:600}.noteq{border-bottom:0;padding-bottom:0}.noteq .warning{margin:0}
.glance{display:grid;gap:4px;border-left:4px solid var(--teal)}.glance span{font-weight:650}
/* Severity colors (validated): green=minimal/low, yellow=mild, orange=moderate, red=high, dark red=top level; gray=not answered */
:root{--cg:#5fb366;--cy:#f0d04a;--co:#e57524;--cr:#b52f28;--crr:#6e1719;--cna:#cfd6d3;--markring:#ffffff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--cr:#b02c26;--crr:#ff5a4a;--cna:#3a4743;--markring:#16211e}}
:root[data-theme="dark"]{--cr:#b02c26;--crr:#ff5a4a;--cna:#3a4743;--markring:#16211e}
.cg{background:var(--cg)}.cy{background:var(--cy)}.co{background:var(--co)}.cr{background:var(--cr)}.crr{background:var(--crr)}.cna{background:var(--cna)}
.sevlegend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;color:var(--muted);margin:8px 0 2px}.sevlegend span{display:inline-flex;align-items:center;gap:6px}.sevlegend i{width:12px;height:12px;border-radius:3px;display:inline-block}
.sevwrap{display:grid;gap:18px;margin:10px 0 6px}.sevwrap.items{gap:10px}
.sevhead{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;font-size:14px;margin-bottom:6px}.sevhead span{font-variant-numeric:tabular-nums}.sevhead small{color:var(--muted)}
.sevc .sevhead{font-size:13px;margin-bottom:4px}.sevc .sevhead b{font-weight:600}
.sevbar{position:relative;display:flex;height:14px;border-radius:4px;overflow:visible}.sevc .sevbar{height:9px}
.sevbar .band{flex-basis:0;flex-shrink:1;min-width:0;box-shadow:inset -2px 0 var(--card)}.sevbar .band:first-child{border-radius:4px 0 0 4px}.sevbar .band:last-child{border-radius:0 4px 4px 0;box-shadow:none}
.sevbar .mark{position:absolute;top:-5px;bottom:-5px;width:4px;margin-left:-2px;background:var(--ink);border-radius:2px;box-shadow:0 0 0 2px var(--markring)}
.sevticks{position:relative;height:16px;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;margin-top:3px}.sevticks span{position:absolute;top:0}.sevticks span.end{transform:translateX(-100%)}
.chips{display:grid;gap:8px;margin:8px 0}.chips div{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:6px}.chip{border:1px solid var(--field);border-radius:999px;padding:2px 10px;font-size:13px;white-space:nowrap}.chipna{color:var(--muted);border-style:dashed}
@media print{.sev{break-inside:avoid}}
input[type=date]{-webkit-appearance:none;appearance:none;display:block;min-width:0;max-width:100%;min-height:46px;text-align:left}input[type=date]::-webkit-date-and-time-value{text-align:left}
.byname{font-weight:700;color:var(--ink)}
.thanks{border-left:5px solid var(--teal);font-size:17px}.thanks p{margin:6px 0}
.ver{font-size:13px;letter-spacing:.04em;font-weight:600;color:var(--muted);margin-left:4px}
.instr{font-size:18px;line-height:1.45;font-weight:700;color:var(--ink);margin:6px 0 12px;max-width:60ch}#step0 .instr:first-of-type{font-size:21px}#step0 .instr:last-of-type{font-size:15px;font-weight:600;color:var(--muted)}
.quickexit{position:fixed;right:max(12px,env(safe-area-inset-right,0px));top:max(12px,env(safe-area-inset-top,0px));z-index:20;background:var(--urgent);color:var(--card);padding:14px 20px;font-size:16px;box-shadow:0 4px 16px var(--shadow)}@media print{.quickexit{display:none}}
'''
body='''<div class="shell"><header><h1>MINDSPRING</h1><p><b>Your mind. Your rhythm. Your next chapter.</b></p><p>Perimenopause, Menopause &amp; Mood Check-In</p><p class="hint">by <b class="byname">Erick Sandstad</b>, Psychotherapist <span class="ver" id="verLabel"></span></p></header><div class="progress no-print"><div id="progress"></div></div><main><noscript><div class="warning">This check-in needs JavaScript to work. If you opened it from Files, Mail, or Messages, open it in Safari or Chrome instead.</div></noscript><div id="safetyLive" aria-live="assertive"></div><div id="steps"></div><section id="report" class="report"></section><div class="nav no-print"><button id="prev" class="alt" type="button">Back</button><span id="stepLabel" class="pill"></span><button id="next" type="button">Continue</button></div><div class="panel thanks no-print" id="thanks" hidden><p><b>Thank you for completing this check-in.</b> It takes courage to look honestly at how you have been feeling, and to answer questions about difficult experiences.</p><p><b>One last step, if you haven&#8217;t already:</b> tap <b>Download PDF report</b> below, then send the PDF as an attachment to your psychotherapist, using the secure portal or email your psychotherapist has approved. Your answers are not sent automatically.</p></div><div class="toolbar no-print" id="toolbar" hidden><button id="pdf" type="button">Download PDF report</button><button class="alt" id="copy" type="button">Copy report text</button><button class="alt" id="print" type="button">Print</button><button class="alt" id="clear" type="button">Clear answers</button></div><p id="saveMsg" class="hint no-print" role="status"></p><p class="footer"><span id="reviewNote"></span> Your answers are processed on this device and are not sent anywhere automatically. Send your report only through a channel your clinician has approved. In the U.S., call or text 988 for suicide crisis support; call 911 for immediate danger or a medical emergency.</p></main></div>'''
js=open('app.js',encoding='utf8').read()
hosted=re.sub(r'/\*STANDALONE\*/.*?/\*ENDSTANDALONE\*/','',js,flags=re.S).replace('/*HOSTED*/','').replace('/*END*/','')
standalone=re.sub(r'/\*HOSTED\*/.*?/\*END\*/','',js,flags=re.S)
assert 'inArtifact' not in standalone and 'claude' not in standalone
os.makedirs('build',exist_ok=True);open('build/artifact.html','w',encoding='utf8').write('<title>MINDSPRING Check-In</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>\n'+css+'</style>\n'+body+'\n<script>\n'+hosted+'</script>\n')
import json,base64
icon='data:image/png;base64,'+open('icon.b64').read().strip()
manifest='data:application/manifest+json,'+json.dumps({"name":"MINDSPRING Check-In","short_name":"MINDSPRING","icons":[{"src":icon,"sizes":"180x180","type":"image/png"}],"display":"browser","background_color":"#f1f5f2","theme_color":"#287d73"}).replace('#','%23')
head=('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 '<meta name="apple-mobile-web-app-title" content="MINDSPRING"><link rel="apple-touch-icon" href="'+icon+'"><link rel="icon" href="'+icon+'">'
 '<link rel="manifest" href="'+manifest+'">'
 '<meta name="theme-color" content="#eaf4ef" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#1d2e2a" media="(prefers-color-scheme: dark)">'
 '<title>MINDSPRING: Menopause &amp; Mood Check-In by Erick Sandstad</title>'
 '<meta property="og:title" content="MINDSPRING: Menopause &amp; Mood Check-In by Erick Sandstad">'
 '<meta property="og:description" content="A private check-in on mood, sleep, and menopause symptoms. Your answers stay on your device.">'
 '<meta name="description" content="A private check-in on mood, sleep, and menopause symptoms. Your answers stay on your device.">')
crisis='<div class="crisisbar no-print"><a class="cbtn" href="tel:988">Call 988</a><a class="cbtn" href="sms:988">Text 988</a><a class="cbtn" href="tel:911">Call 911</a></div>'
ccss='.crisisbar{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 20px}.cbtn{flex:1 1 90px;text-align:center;padding:12px;border-radius:9px;background:var(--soft);color:var(--ink);font-weight:650;text-decoration:none;border:1px solid var(--line)}.cbtn:focus-visible{outline:3px solid var(--teal)}\n'
sbody=body.replace('</main>',crisis+'</main>')
open(os.path.join(ROOT,'index.html'),'w',encoding='utf8').write('<!doctype html><html lang="en"><head>'+head+'<style>\n'+css+ccss+'</style></head><body>\n'+sbody+'\n<script>\n'+standalone+'</script></body></html>')
print('built v'+ver)
import re as _re
_v=_re.search(r"version:'(v\d+)'",js).group(1)
open(os.path.join(ROOT,'version.json'),'w').write(json.dumps({'version':_v})+'\n')
