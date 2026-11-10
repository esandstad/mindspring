# MINDSPRING: Perimenopause, Menopause & Mood Check-In
## Clinical logic specification for external review (app version v45, November 2026)

**Author:** Erick Sandstad, LPC (Georgia), LPCC (Kentucky), psychotherapist
**Live app:** https://esandstad.github.io/mindspring/
**Purpose of this document:** to have the screening content, scoring rules, decision logic, and urgency tiers checked against current evidence and guidelines. No client data is included; all examples are synthetic.

---

## 1. What the tool is, and what it is not

- A **self-report check-in** completed by a client (women, mainly aged 40–60) before or between psychotherapy sessions. It runs entirely in the client's browser; no answers are sent to a server. The client downloads a PDF report and sends it to her psychotherapist.
- It is used by a **psychotherapist, not a physician.** Its design principle (since v45):
  - **Psychological screening** (depression, anxiety, suicide risk, trauma, OCD, eating, ADHD, alcohol): the tool scores validated instruments and gives clinical follow-up prompts in the therapist's own scope.
  - **Medical patterns:** the tool **does not diagnose medical conditions.** It recognizes when a symptom pattern is **more than anxiety or depression alone** (a "hardware, not software" problem) and recommends physician referral. Medical flags describe the pattern in plain words, with no condition, test, or drug names. Physician-facing detail sits only in an optional **"For the physician"** note at the end of the report, which can travel with the referral.
- Screening scores are not diagnoses. Every positive screen is framed as a prompt for clinical interview.

### Review questions we most want answered
1. Are the **cut-offs, scoring rules, and bands** for each instrument correct and current (Section 4)?
2. Is the **menopause staging algorithm** (Section 5) consistent with STRAW+10 and current guidance, including the handling of masked periods and conflicting answers?
3. Are the **urgency tiers** (Section 6) clinically appropriate, especially for suicide risk, bleeding after menopause, new bloating or early-fullness patterns, and partner violence?
4. Does any **medical-pattern flag** (Section 7.3) miss an important red flag, over-refer, or cross into diagnosis?
5. Are the **"For the physician" notes** accurate and current (Section 7.3, right column)?
6. Are there **important omissions** for this population (women 40–60 in psychotherapy)?

---

## 2. Structure: what every client answers vs. what opens only on a "Yes"

To keep the check-in short, specialized instruments open **only when a single gate question is positive** ("ask, and open only if suspected").

| Step | Always asked | Opens only if… |
|---|---|---|
| 1. Mood | PHQ-9 (+ functional impact item) | **C-SSRS Screener** (recent version) + one non-suicidal self-harm item opens if **PHQ-9 item 9 > 0**. "Prefer to discuss directly" option. |
| 2. Anxiety | GAD-7 (+ impact item); **OCD gate** question | **OCI-R** (18 items) opens if the OCD gate = Yes |
| 3. Menopause symptoms | Menopause Rating Scale (MRS, 11 items) | — |
| 4. Timing and patterns | Menstrual pattern; last-period date; onset of mood change relative to cycle changes; three mood-cycle pattern items; memory or thinking worsening; support; body-shape change and its effect on self-image; **eating gate** question | **SCOFF** (5 items) + binge-eating, compensatory-behavior and past-history questions open if the eating gate = Yes |
| 5. Health history | Bleeding checklist; cardiac symptoms checklist; other physical symptoms checklist; **bowel gate** question; hormone-affecting treatments (hysterectomy, oophorectomy, chemo, pelvic radiation, tamoxifen, aromatase inhibitor, GnRH, hormone-sensitive cancer); contraception; menopausal hormone therapy (MHT); periods stopped before 45; pregnancy possible; medications; psychiatric history; AUDIT-C; drug use; pregnancy complications | Age at oophorectomy (if ovaries removed). **ASRS v1.1** Part A (6 items) opens if ADHD is suspected (see 4.8); Part B (12 items) opens if Part A is positive. **Bowel questions** (onset, stool pattern, pain, warning signs, family history, pelvic-floor symptoms, avoidance, colon screening) open if the bowel gate = Yes. |
| 6. Difficult experiences (Quick exit button) | Trauma gate (Q1); childhood adversity question (Q2) | **PC-PTSD-5** opens if Q1 = Yes; **PCL-5** opens if PC-PTSD-5 ≥ 3 |
| 7. Safety at home (Quick exit button) | "Do you feel unsafe at home?"; partner question gate | **E-HITS** (5 items) opens if the client chooses "Answer now" (vs. "Prefer to discuss privately" or "No partner in past 12 months") |
| 8. Before you finish | One open question: most difficult change, and what the psychotherapist should understand | — |
| 9. Review and report | Scores, severity bars, flags, PDF download | — |

### Gate question wordings

- **OCD gate:** "In the past month, have you been bothered by thoughts, images, or urges that keep coming back even when you try to push them away, or felt you had to check, repeat, clean, arrange, or mentally go over things (such as replaying conversations) to feel okay?" (No / Yes / Prefer to discuss in session)
- **Eating gate:** "In the past 3 months, have worries about eating, weight, or body shape taken up a lot of your thoughts, or have you had times when eating felt out of control or you ate very little to control your weight?"
- **Bowel gate:** "In the past 3 months, have you had ongoing stomach or belly pain, bloating, feeling full quickly, constipation, or diarrhea?"
- **Trauma gate (Q1):** "Have you ever experienced or witnessed something frightening, overwhelming, or traumatic, such as an accident, violence, abuse, or the sudden, violent, or accidental loss of someone close to you?" *(This replaces the PC-PTSD-5's own exposure question; see 9.)*
- **Childhood adversity (Q2):** "Were there difficult experiences during your childhood or teenage years that you feel may still affect you today?" (single item; the full ACE questionnaire is used in session if needed)

---

## 3. Privacy and safety design

- Answers stay on the device. "Save my progress" (browser session storage) is **off by default**. Safety-at-home, trauma, and eating answers are **never** saved to browser storage, even when saving is on.
- The safety and trauma steps have a **Quick exit** button (and Esc key) that clears the page.
- A crisis bar (call 988 / text 988 / call 911) is shown on every page.
- Urgent flags appear to the client **live, during the check-in**, not just in the final report.
- The client is told to send the PDF only through the psychotherapist's approved secure channel.

---

## 4. Instruments, scoring, and cut-offs

| Instrument | Range | Bands or cut-off used | Source |
|---|---|---|---|
| **PHQ-9** | 0–27 | 0–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe. Report also splits items into "mood and self-worth" (1, 2, 6, 9) vs "physical and concentration" (3, 4, 5, 7, 8), because somatic items overlap with menopause. | Kroenke et al. 2001 |
| **GAD-7** | 0–21 | 0–4 minimal, 5–9 mild, 10–14 moderate, 15–21 severe | Spitzer et al. 2006 |
| **MRS** | 0–44 (items 0–4) | Total: 0–4 none/little, 5–8 mild, 9–16 moderate, 17+ severe. Psychological (depressive mood, irritability, anxiety, exhaustion): 0–1, 2–3, 4–6, 7+. Somatic (hot flushes, heart discomfort, sleep, joint/muscle): 0–2, 3–4, 5–8, 9+. Urogenital (sexual, bladder, vaginal dryness): 0, 1, 2–3, 4+. | Heinemann et al. 2004, *Health Qual Life Outcomes* 2:45, Table 6 |
| **C-SSRS Screener** (recent) | items 1–6 (+6b timing) | **Low:** yes to 1 or 2 only. **Moderate:** yes to 3, or 6 with behavior >3 months ago. **High:** yes to 4 or 5, or 6 within the past 3 months, or 6 = yes with timing unanswered at submission. Required items: 1, 2, 6; plus 3–5 if item 2 = yes; plus 6b if item 6 = yes. | Columbia Lighthouse Project |
| **AUDIT-C** | 0–12 | Positive ≥ 3 (US women's version; 4+ drinks counts as heavy episodic drinking) | Bush et al. 1998; Bradley et al. 2003 |
| **E-HITS** | 5–25 (items 1–5: Never → Frequently) | Positive ≥ 7. Separate flag whenever "physically hurt" or "forced sexual activity" is above Never, regardless of total. | Chan et al. 2010 (Extended-HITS) |
| **PC-PTSD-5** | 0–5 | Positive ≥ 3 (lower cut-off used for women; VA general cut-off is 4) | Prins et al. 2016 |
| **PCL-5** | 0–80 | Provisional cut-off 31–33 (app uses ≥ 31). Clusters B 1–5 /20, C 6–7 /8, D 8–14 /28, E 15–20 /24. Item 16 (risky behavior) ≥ moderate flagged separately. | Weathers et al. 2013; Bovin et al. 2016 |
| **ASRS v1.1** | Part A 6 items; Part B 12 items | Part A positive if ≥ 4 of 6 in the shaded range (thresholds: items 1–3 ≥ "Sometimes", items 4–6 ≥ "Often"). Part B: shaded counts reported (inattention of 5, hyperactivity and impulsivity of 7), no total. | Kessler et al. 2005 |
| **OCI-R** | 0–72 | Positive ≥ 21. Six subscales of 3 items (0–12): Obsessing 6, 12, 18; Checking 2, 8, 14; Ordering 3, 9, 15; Washing 5, 11, 17; Neutralizing 4, 10, 16; Hoarding 1, 7, 13. | Foa et al. 2002 |
| **SCOFF** | 0–5 | Positive ≥ 2. Item 3 worded "more than 14 pounds (one stone) in a 3-month period". | Morgan, Reid & Lacey 1999 |

**Licensing note:** MRS, C-SSRS, E-HITS, ASRS, PC-PTSD-5, PCL-5, OCI-R, and SCOFF are believed to be free for clinical use; this is being confirmed separately. The BEDS-7 (binge eating) is copyrighted (Shire/Takeda) and is **not** embedded. Plain-language, non-scored questions based on DSM-5 criteria are used instead. The Rome IV criteria and IBS-SSS are not embedded for the same reason.

### 4.8 When ADHD questions open
ASRS Part A opens if the client has diagnosed ADHD, or reports attention problems since childhood. It also opens when she has a current attention complaint (PHQ-9 item 7 ≥ 2, MRS exhaustion ≥ 2, or worsening memory or thinking) **and** answers "Yes" or "Not sure" to "Did attention problems start in childhood?"

---

## 5. Menopause staging algorithm (STRAW+10)

**Definitions shown in the report:** perimenopause = early transition (cycle length varies by ≥ 7 days) or late transition (≥ 60 days without a period). Menopause = the final period, confirmed after 12 months without one. Postmenopause = everything after that. Periods stopping before 40 = premature menopause or POI; at 40–44 = early menopause.

**Precedence (first rule that applies wins):**
1. Both ovaries removed → **surgical menopause** (postmenopausal from the date of surgery).
2. Periods masked (current hormonal contraception, contraceptive injection in past 12 months, MHT, hysterectomy with ovaries kept, GnRH medication, or "periods hidden" selected) → **cannot be staged from periods**. If age ≥ 55, shown as "likely postmenopause, based on age".
3. "Periods stopped for good before age 40" → **postmenopause (premature menopause; POI needs medical confirmation)**. "Between 40 and 44" → **postmenopause (early menopause)**. This holds even if another answer disagrees (see conflict check).
4. Pattern "No period for 12+ months", **or** last-period date ≥ 365 days ago → **postmenopause**.
5. Last-period date 60–364 days ago (unless "regular cycles" chosen) → **late transition**.
6. Pattern answer: cycles vary by 7+ days → early transition; 60–89 days or 3–11 months without a period → late transition; regular cycles → reproductive stage or very early transition (flagged "unusual, confirm" at age ≥ 55).
7. Otherwise not determined (at age ≥ 55: "most women are postmenopausal").

**Conflict check (Tier 2 medical flag):** periods reported stopped before 45, but the pattern answer says cycles or < 12 months without a period, or the last-period date is < 365 days ago (or "12+ months" with a last-period date < 365 days). The flag asks the therapist to confirm the date of the last bleeding, because bleeding after 12 months without a period needs prompt evaluation.

**Downstream effects of stage:**
- Postmenopause, or age ≥ 55 → the "consider a pregnancy test" flag is replaced by a "check answers" note.
- Perimenopause-only flags (depression risk window with prior depression, PMDD or postpartum depression; trauma during perimenopause) appear only in early or late transition.
- "Mood changes began before cycle changes" → note that the hormonal transition is less likely to be the main driver.

---

## 6. Urgency tiers

Every flag is assigned one tier. The report's "For the clinician" box lists the tiers in order, with counts and short labels.

| Tier | Label | Contents (summary) |
|---|---|---|
| 1 | **Today** | C-SSRS high; PHQ-9 item 9 positive when the screener is incomplete, item 9 ≥ "more than half the days", self-harm in past month, prior attempt or self-harm history, or C-SSRS moderate or high. (When this fires, all suicide-related items move to Tier 1, and the report states why it is urgent despite a low screener.) Chest pain or pressure, shortness of breath, fainting. Feels unsafe at home. |
| 2 | **Within 1 business day** | Any positive PHQ-9 item 9 ("several days") with a low or none C-SSRS screen and no other risk factor; client wants to discuss suicide questions directly; prior suicide attempt; E-HITS positive or any partner physical or sexual harm; PCL-5 item 16 ≥ moderate; alcohol use with item 9 positive; positive eating screen with item 9 positive. **Medical:** bleeding after menopause; abnormal bleeding on tamoxifen or at ≥ 55; staging conflict suggesting possible bleeding after menopause; bowel warning signs with blood, weight loss or anemia; new bloating, early fullness or pelvic pain on most days, new within a year; purging with cardiac symptoms; heat intolerance or tremor with ≥ 2 arousal symptoms; new symptoms after cancer treatment. Bleeding after sex with a deferred partner-safety answer (private). |
| 3 | **Within 7 days** | Other medical-pattern flags (palpitations, early or surgical menopause follow-up, worsening memory or thinking, vaginal and urinary symptoms, untreated severe hot flushes, other bowel warning signs, colon screening due, constipation, pelvic-floor symptoms, restriction or rapid weight loss, weight-loss treatment caution, purging). Clinical: SCOFF positive, weekly binge eating with distress, OCI-R positive, alcohol (AUDIT-C ≥ 3) **raised to Tier 3 when PHQ-9 ≥ 10 or MRS sleep ≥ severe** (unless the score comes from frequency alone). |
| 4 | **Next session** | Remaining clinical follow-up: positive or negative screen details, consistency checks, preference-to-discuss items, history items. |

**Also in the clinician box:**
- **Likely stage** line, with "(answers conflict; see flag)" when relevant.
- **Medical (hardware) check** line: either "Likely physical contribution, N signals: [plain labels]. Refer to physician; this is more than anxiety or depression alone", or "No physical warning signals in these answers. Missing answers do not rule them out."
- **Therapy focus** line: PHQ-9 with its mood/physical split, GAD-7, PCL-5 or PC-PTSD-5, MRS psychological.

---

## 7. Flags: conditions and messages

### 7.1 Suicide and self-harm
| Condition | Tier | Message (gist) |
|---|---|---|
| PHQ-9 item 9 = "several days", C-SSRS complete with none or low, no self-harm, no prior attempt or self-harm history | 2 | Client notice: "Please share this report with your clinician; 988 / 911 if thoughts get stronger." Clinician: any positive item 9 predicts later attempts; follow up even though the screener is low. |
| Same, but C-SSRS item 2 (active thoughts) = yes | 2 | Client: "talk with your clinician soon" plus the configured contact window. Clinician: active ideation without method, intent or behavior: low by Columbia triage; Tier 2 contact. |
| Item 9 positive with screener incomplete, item 9 ≥ 2, recent self-harm, prior attempt or self-harm history | 1 | Red client notice: prompt direct assessment; 911 / ED if unsafe; 988. Clinician: "Rated urgent despite a low C-SSRS screen because of: [reasons]." |
| C-SSRS moderate | 1–2 | Contact clinician within the configured window. |
| C-SSRS high | 1 | "Call or text 988 now, or 911 / ED." |
| C-SSRS item 6 = yes with timing unanswered | live prompt | Asks the timing question before submission; treated as high if still missing at the end. |
| Self-harm without suicidal intent (past month) | 2 | Assess method, frequency, medical risk, function. |
| Prior attempt in history but C-SSRS item 6 = No | 4 | Mismatch, clarify. |
| Bipolar or hypomania history | 4 | Assess before any antidepressant. |

### 7.2 Mental health (therapist scope)
| Condition | Tier | Message (gist) |
|---|---|---|
| Perimenopause plus prior depression, PMDD or postpartum depression | 4 | Highest-risk group for perimenopausal depression; monitor. |
| All nine PHQ-9 items identical and > 0 | 4 | Possible same-answer pattern; review items before relying on the total. |
| GAD-7 ≤ 4 but MRS irritability or anxiety ≥ moderate | 4 | Ask directly; menopause-linked irritability may not show on the GAD-7. |
| PHQ-9 < 10 but MRS psychological ≥ 7 | 4 | Mood may be under-reported on the PHQ-9. |
| OCI-R ≥ 21 | 3 | OCD likely; confirm (e.g., Y-BOCS); ERP first-line; perimenopause can worsen OCD. The OCI-R under-samples mental rituals (reviewing conversations, reassurance seeking); post-event rumination → assess social anxiety too. |
| OCI-R < 21 (gate Yes) | 4 | Below cut-off, with subscales and the same two caveats. |
| SCOFF ≥ 2 | 3 | Eating disorder likely; DSM-5 interview; EDE-Q for severity; SCOFF not validated specifically in women over 50. |
| Loss-of-control eating weekly or more with distress | 3 | Fits BED frequency and distress criteria if confirmed; give BEDS-7 in session. |
| Positive eating screen with item 9 positive | 2 | Include in risk assessment and safety plan (binge-purge raises attempt risk). |
| Eating gate No, but PHQ-9 item 5 ≥ 1 and body changes affect self-image moderately or more | 4 | Ask about eating directly. |
| Eating gate Yes, screens negative | 4 | Treat body image as a therapy target. |
| PC-PTSD-5 ≥ 3 | 4 | Probable PTSD; full trauma assessment. |
| PCL-5 total | 4 | Total, clusters, cut-off status; items 15, 19, 20 overlap with menopause symptoms. |
| PCL-5 item 16 ≥ moderate | 2 | Ask about risky or self-harming behavior. |
| PTSD screen positive during perimenopause | 4 | Lower estradiol is linked to weaker fear extinction; treat both in parallel. |
| Childhood adversity = Yes | 4 | Explore in session (full ACE optional). |
| ASRS Part A positive | 4 | Consistent with adult ADHD; perimenopause and poor sleep can raise scores; confirm childhood onset. With diagnosed ADHD: review whether treatment still fits. |
| AUDIT-C ≥ 3 | 4, or 3 if PHQ-9 ≥ 10 or severe sleep (not when frequency-only) | Risky drinking screen; frequency-only caveat. |
| E-HITS ≥ 7, or partner physical or sexual harm reported | 2 (private) | Discuss privately; safety planning; check reporting rules. |
| Feels unsafe at home | 1 (private) | 911 if in danger; National DV Hotline. |
| IBS-type pattern (weekly pain that changes with bowel movements) | 4 | Needs medical confirmation first; IBS-specific CBT and gut-directed hypnotherapy effective (~60–70% respond). Childhood adversity roughly doubles IBS risk. |
| Gut-related avoidance | 4 | Target of IBS-focused CBT. |

### 7.3 Medical patterns ("hardware" signals, refer to physician)
Client- and therapist-facing text describes the pattern only. The right column is the optional note shown only in the "For the physician" section.

| Pattern (trigger) | Tier | Optional physician note |
|---|---|---|
| Bleeding after 12 months without a period (ticked) | 2 | 1–14% endometrial cancer (ACOG 2018); TVUS or endometrial sampling. MHT withdrawal bleeds noted for the client. |
| Any other bleeding when stage = postmenopause | 2 | Same, ideally within ~2 weeks; dryness can cause post-coital bleeding but does not remove the need for evaluation. |
| Bleeding on tamoxifen, or at ≥ 55 | 2 | Gynecologic evaluation; tamoxifen raises endometrial risk. |
| Other abnormal bleeding | 3 | — |
| Staging conflict (possible bleeding after menopause) | 2 | If confirmed, manage as postmenopausal bleeding. |
| Chest pain, shortness of breath, fainting | 1 (urgent) | (Tamoxifen: clot warning.) |
| New or unexplained palpitations | 3 | ECG, thyroid, medications, caffeine, alcohol. |
| Heat intolerance, tremor or unexplained weight loss **plus ≥ 2 arousal symptoms** (GAD items 4–6, PHQ items 5, 8, MRS heart discomfort, etc.) | 2 | Consider thyroid function (ADHD stimulants can mimic). |
| Heat intolerance, tremor or weight loss alone | 3 | Consider thyroid function. |
| Other physical symptoms (weight loss with fever or night sweats; severe headache with sweating and racing heart; flushing with diarrhea or wheezing; milky nipple discharge or visual change with headaches; loud snoring or witnessed apneas) | 3 | — |
| Worsening memory or thinking (impairing or noticed by others) | 3 | — |
| Periods stopped < 40, or ≥ 60 days missed under 40 | 3 | Rule out pregnancy and contraception; POI per ESHRE/ASRM 2024 (4+ months, FSH > 25 IU/L). |
| Periods stopped 40–44 | 3 | Bone density, heart risk; was MHT to ~51 considered? |
| Both ovaries removed < 40 or < 45 | 3 | POI definition (< 40); review MHT, bone, heart. |
| Masked periods, age < 45, vasomotor symptoms | 3 | Contraception can lower FSH; stage by symptoms and labs. |
| MHT plus hormonal contraception | 3 | Possible double estrogen with combined methods. |
| Contraception after hormone-sensitive cancer | 3 | Estrogen generally avoided; progestin-only guidance differs after breast cancer. |
| New symptoms after cancer treatment (≥ 2 of: abnormal bleeding, breathlessness, weight loss with fever or sweats, worsening cognition; or either of the latter two alone) | 2 | Consider recurrence, infection, clot. |
| Takes tamoxifen | 3 | Avoid strong CYP2D6 inhibitors (paroxetine, fluoxetine, bupropion); duloxetine moderate; venlafaxine, escitalopram, citalopram little interaction. |
| Hot flushes MRS ≥ severe, not on MHT | 3 | MHT most effective for many; non-hormonal: fezolinetant, some SSRIs/SNRIs, gabapentin. After hormone-sensitive cancer: non-hormonal only (on tamoxifen avoid paroxetine, fluoxetine). Client text notes CBT and clinical hypnosis (Menopause Society 2023). |
| Vaginal dryness ≥ moderate with MRS urogenital ≥ 2 | 3 | Fits GSM; low-dose vaginal estrogen first-line (AUA/SUFU/AUGS 2025); start after any bleeding is evaluated. |
| Bowel warning signs: blood in stool, unintended weight loss, anemia, nocturnal diarrhea, new bowel symptoms at ≥ 50, family history of CRC, IBD or celiac | 2 if blood, weight loss or anemia; else 3 | — |
| Bloating, early fullness or pelvic pain **on most days**, new within a year (or onset unsure), ± bladder symptoms ≥ moderate, ± family history of ovarian cancer | 2 | Overlaps with early ovarian cancer symptoms (> 12 days a month, new): pelvic exam, ultrasound, CA-125 as the physician decides. |
| Family history of ovarian cancer (without the above pattern) | 3 | Genetic counseling may be relevant. |
| Colon screening never, overdue or unsure at ≥ 45 | 3 | USPSTF 2021: screen from 45. |
| Diarrhea or mixed stools plus palpitations or heat intolerance | 3 | Consider thyroid. |
| Mostly constipation | 3 | Thyroid, medications, pelvic floor. |
| Straining, digitation, or fecal leakage | 3 | Pelvic-floor PT. |
| Purging (vomiting, laxatives, diuretics) | 3 (2 with cardiac symptoms) | Electrolytes, especially potassium; specialist ED referral. |
| Fasting or ≥ 14 lb loss in 3 months (eating gate Yes) | 3 | Bone risk, especially after early menopause. |
| Positive eating screen | 3 | Physician should know before recommending restrictive diets, weight-loss medication, or surgery. |
| Pregnancy possible (only if not postmenopausal, < 55, no hysterectomy or oophorectomy) | 3 | — |

### 7.4 Consistency checks ("check answers")
Hysterectomy with ongoing cycles or period bleeding; oophorectomy or hysterectomy with possible pregnancy; ≥ 2 contraceptive methods; contraception at ≥ 55; cycles at ≥ 55; last-period date conflicting with "regular cycles"; last-period date = today; tamoxifen without a cancer history; injection timing unsure (period-based flags switched off).

---

## 8. Testing performed
- 63 regression checks and 148 scenario checks (synthetic personas with expectations written before running).
- A random sweep of more than 2,000 synthetic women aged 40–60 with random, often contradictory answers, checked against these invariants:
  - valid tiers in sorted order, with clinician-box counts matching the flags;
  - the hardware line matching the medical flags;
  - no diagnosis names in medical pattern text;
  - hidden answers cleared;
  - one coherent stage;
  - no pregnancy-test flag after menopause or at ≥ 55, and no perimenopause-only flags outside perimenopause;
  - scores within range;
  - no C-SSRS flags without item 9;
  - age gates (colon screening ≥ 45, "after 50" rule);
  - no duplicate flags, junk text, or split suicide tiers;
  - urgent items shown live to the client;
  - the PDF builds.
- Twelve realistic cases reviewed by hand.

---

## 9. Known limitations and open questions for the reviewer
1. **Modified trauma exposure question.** Q1 replaces the PC-PTSD-5 exposure item and adds "sudden, violent, or accidental loss". PC-PTSD-5 items 1–5 are unchanged. Does this affect validity?
2. **PC-PTSD-5 cut-off of 3 for women.** Is it still the best choice versus 4?
3. **PHQ-9 item 9 = "several days" with a low C-SSRS screen → Tier 2 (within 1 business day), not same day.** Is this appropriate, given evidence that any positive item 9 predicts later attempts?
4. **MRS** has not been validated against clinical diagnosis for every subscale cut-off used here; the bands come from Heinemann 2004 reference data.
5. **SCOFF and OCI-R in women over 50:** limited validation in midlife.
6. **Bowel and ovarian-pattern questions** are plain-language, not a validated instrument (Rome IV, IBS-SSS and the Goff Symptom Index are copyrighted or not embedded). Are the triggers and tiers appropriate?
7. **Hot-flush treatment note:** are the non-hormonal options listed current (fezolinetant hepatic monitoring, elinzanetant availability)?
8. **No standalone flag for severe PHQ-9 (15–19) or GAD-7 (≥ 15)** without other risk; these appear in "Therapy focus" only. Is this acceptable?
9. **Missing domains?** For example, sleep apnea is asked only as one checklist item; there is no insomnia severity measure (ISI), no sexual function measure, no bone or fracture history, no cardiovascular risk items, and no low-blood-sugar episode item.
10. The tool is in **English only**, and the instruments are US versions.

---

## 10. Key references
- Harlow SD, et al. Executive summary of STRAW+10. *Menopause* 2012;19(4):387–395.
- Heinemann K, et al. The Menopause Rating Scale (MRS) scale: a methodological review. *Health Qual Life Outcomes* 2004;2:45.
- Kroenke K, Spitzer RL, Williams JB. The PHQ-9. *J Gen Intern Med* 2001;16:606–613.
- Spitzer RL, et al. A brief measure for assessing generalized anxiety disorder: the GAD-7. *Arch Intern Med* 2006;166:1092–1097.
- Posner K, et al. The Columbia-Suicide Severity Rating Scale. *Am J Psychiatry* 2011;168:1266–1277.
- Bradley KA, et al. Two brief alcohol-screening tests from the AUDIT. *Arch Intern Med* 2003;163:821–829.
- Prins A, et al. The PC-PTSD-5. *J Gen Intern Med* 2016;31:1206–1211.
- Bovin MJ, et al. Psychometric properties of the PCL-5. *Psychol Assess* 2016;28:1379–1391.
- Kessler RC, et al. The WHO Adult ADHD Self-Report Scale (ASRS). *Psychol Med* 2005;35:245–256.
- Foa EB, et al. The Obsessive-Compulsive Inventory: revised. *Psychol Assess* 2002;14:485–496.
- Morgan JF, Reid F, Lacey JH. The SCOFF questionnaire. *BMJ* 1999;319:1467–1468.
- ACOG Committee Opinion 734. Role of transvaginal ultrasonography in evaluating the endometrium of women with postmenopausal bleeding. *Obstet Gynecol* 2018;131:e124–e129.
- ESHRE/ASRM/CRE/IMS. Evidence-based guideline: management of premature ovarian insufficiency. 2024.
- The 2023 nonhormone therapy position statement of The North American Menopause Society. *Menopause* 2023;30:573–590.
- AUA/SUFU/AUGS Guideline on Genitourinary Syndrome of Menopause. 2025.
- US Preventive Services Task Force. Screening for colorectal cancer. *JAMA* 2021;325:1965–1977.
- US Preventive Services Task Force. Screening for eating disorders in adolescents and adults. *JAMA* 2022;327:1061–1067.
- Simon GE, et al. Does response on the PHQ-9 depression questionnaire predict subsequent suicide attempt or suicide death? *Psychiatr Serv* 2013;64:1195–1202.
