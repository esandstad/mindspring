# MINDSPRING review, round 2 (app v46)

**For:** OpenEvidence. This responds to your review of v45. All cases are synthetic, and the outputs below are copied exactly from the running app.

## Changes made from your review
1. **Active suicidal thoughts (C-SSRS item 2 = Yes) → Tier 1 (Today)**, whatever the PHQ-9 item 9 frequency. When any suicide item is Tier 1, all suicide-related items are grouped in Tier 1, including C-SSRS moderate or high, lethal means, and alcohol with item 9. Tier 2 remains only for item 1 alone with item 9 = "several days".
2. **Tier 1 client notices** now say: "Please don't wait for your psychotherapist to read this report: contact your psychotherapist directly today, or call or text 988 now."
3. **New lethal-means question** (opens only if PHQ-9 item 9 > 0): "Is there a gun in your home, or a supply of medications you could take too much of?" Yes → lethal-means counseling and a safety-plan flag, grouped with the suicide items.
4. **Partner violence ranked by the most severe item:**
   - physical harm, forced sex, or strangulation → Tier 1 (private), with a live client notice (hotline, 911) and a private medical referral for injuries;
   - two new questions open only if any E-HITS item is above Never: strangulation, and the partner's access to a gun;
   - strangulation → Tier 1;
   - gun access with abuse or threats → Tier 1;
   - "not sure" or deferred → Tier 2, ask privately.
5. **Vaginal and urinary symptoms after breast cancer:** the physician note now says non-hormonal treatment is first-line, with vaginal estrogen only after shared decision-making with the oncologist (ACOG 2021), and generally avoided with aromatase inhibitors.
6. **Bleeding on tamoxifen:** the physician note now says endometrial sampling is needed and transvaginal ultrasound is less reliable (ACOG 2014).
7. **Staging:** chemotherapy and tamoxifen now mark periods as unusable for staging. Missed periods after chemotherapy do not establish menopause.
8. **POI:** the pregnancy-test flag stays on when periods stopped before 40, and the physician note adds that spontaneous pregnancy remains possible and hormone therapy until about 51 is recommended.
9. **Trauma gate wording:** "sudden" removed; it now reads "the violent or accidental loss of someone close to you".
10. **Hysterectomy:** the hot-flush physician note adds "without a uterus, estrogen alone is an option".

## Not changed (clinician's decision pending)
- Standalone flags for severe scores (PHQ-9 ≥ 20 → Tier 2; PHQ-9 15–19 or GAD-7 ≥ 15 → Tier 3).
- An option to leave the safety section out of the PDF. *Current design: the clinician always sees the safety answers; the client is asked to send the report only through a secure channel.*
- New domains: insomnia severity, sleep apnea screen, sedatives and opioids, reproductive coercion.

## Please check
For each of your five edge cases below, confirm whether the app's output now matches your expected output. List any remaining disagreement in the same table format (Case | Type | What the app did | What it should do | Evidence | Severity). Then propose five more edge cases, aimed at the new rules (lethal means, partner-violence tiers, cancer-treatment staging, POI).

## Your edge cases, run through v46

### 1. Amenorrhea on tamoxifen
**Vignette:** 47, breast cancer treated with chemotherapy, on tamoxifen, no period for 14 months, spotting last week, new breathlessness on exertion (swollen calf: no matching question), pregnancy "unsure".

**Clinician box:**
- Likely stage: Can’t be determined from periods (chemotherapy (missed periods after chemotherapy do not establish menopause); tamoxifen); symptoms, age, and if needed blood tests guide staging
- Medical (hardware) check: Likely physical contribution, 6 signals: Chest pain or breathlessness symptoms; New physical symptoms after cancer; Bleeding after 12+ months without a period, on tamoxifen; Pregnancy possible; Hormone-affecting treatments; Takes tamoxifen. Refer to physician; this is more than anxiety or depression alone.
- Today: 1 item: Chest pain or breathlessness symptoms
- Within 1 business day: 2 items: New physical symptoms after cancer; Bleeding after 12+ months without a period, on tamoxifen
- Within 7 days: 3 items: Pregnancy possible; Hormone-affecting treatments; Takes tamoxifen
- Therapy focus: PHQ-9 5 (mild; mood and self-worth items 3, physical and concentration items 2)

**Flags:**
- [Today · urgent] You reported: shortness of breath. Get urgent medical assessment. If it is happening now, severe, or persistent, call 911. Tamoxifen increases blood-clot risk: new breathlessness, chest pain, or one-sided leg swelling needs same-day medical assessment.
- [Within 1 business day · medical] Several new physical symptoms together (abnormal bleeding, shortness of breath) in someone with cancer treatment or history (tamoxifen, chemotherapy, breast, endometrial, or other hormone-sensitive cancer): contact the medical or oncology team within days, sooner if worsening; breathlessness needs same-day assessment. (Physician note: Consider recurrence, infection, or a blood clot.)
- [Within 1 business day · medical] Bleeding after 12 months without a period always needs prompt medical evaluation. Contact a medical clinician soon; do not wait for a routine visit. (Physician note: Postmenopausal bleeding: 1–14% have endometrial cancer (ACOG 2018); evaluation is by transvaginal ultrasound or endometrial sampling. On tamoxifen, endometrial sampling is preferred; ultrasound is less reliable because the endometrium often looks thickened (ACOG 2014).)
- [Within 7 days · medical] Pregnancy may be possible: consider a pregnancy test and medical guidance.
- [Within 7 days · medical] Treatments or history that affect hormones (Chemotherapy; Breast, endometrial, or other hormone-sensitive cancer): these change how menopause and mood symptoms are read; coordinate with the medical clinician. (Physician note: Affects menopause staging and which treatments are suitable.)
- [Within 7 days · medical] Takes tamoxifen: this affects how menopause symptoms are read and which medicines are suitable. (Physician note: When choosing an antidepressant or hot-flash treatment, avoid strong CYP2D6 inhibitors (paroxetine, fluoxetine, bupropion), which lower endoxifen levels; duloxetine is a moderate inhibitor. Little interaction: venlafaxine, escitalopram, citalopram.)

### 2. POI with bleeding again
**Vignette:** 38, periods "stopped for good" before 40 (at 36), no hormone therapy, bled 3 weeks ago, pregnancy "unsure".

**Clinician box:**
- Likely stage: Postmenopause: periods stopped for good before age 40 (premature menopause; primary ovarian insufficiency needs medical confirmation) (answers conflict; see flag)
- Medical (hardware) check: Likely physical contribution, 3 signals: Stage answers conflict (possible bleeding after menopause); Periods stopped before 40; Pregnancy possible. Refer to physician; this is more than anxiety or depression alone.
- Within 1 business day: 1 item: Stage answers conflict (possible bleeding after menopause)
- Within 7 days: 2 items: Periods stopped before 40; Pregnancy possible
- Therapy focus: PHQ-9 4 (minimal; mood and self-worth items 2, physical and concentration items 2)

**Flags:**
- [Within 1 business day · medical] Check answers on menopause stage: periods reported to have stopped for good before 45, but also last period 21 days ago. Any bleeding or spotting after 12 months without a period needs prompt medical evaluation. Confirm the date of the last bleeding with the client. (Physician note: If confirmed, manage as postmenopausal bleeding.)
- [Within 7 days · medical] Periods stopped before age 40: a physical change that needs medical evaluation. This does not by itself mean a diagnosis. (Physician note: Rule out pregnancy and hormonal contraception first. Spontaneous pregnancy remains possible in POI. Hormone therapy until about age 51 is recommended unless contraindicated. ESHRE/ASRM 2024 define POI as 4+ months of absent or irregular periods with FSH above 25 IU/L.)
- [Within 7 days · medical] Pregnancy may be possible: consider a pregnancy test and medical guidance.

### 3. Suicide frequency split
**Vignette:** 49, cycles vary, PHQ-9 item 9 = "several days", C-SSRS items 1 and 2 Yes, 3–6 No, no self-harm, AUDIT-C 7, gun or stockpiled medication at home: Yes.

**Clinician box:**
- Likely stage: Early menopause transition (perimenopause): cycle length varies by 7+ days
- Medical (hardware) check: No physical warning signals in these answers. Missing answers do not rule them out.
- Today: 5 items: PHQ-9 item 9 positive: active suicidal thoughts (C-SSRS item 2); Why urgent despite low screen; Suicide-risk follow-up (PHQ-9 item 9 positive); Access to lethal means; AUDIT-C 7/12 with depression (PHQ-9 12)
- Therapy focus: PHQ-9 12 (moderate; mood and self-worth items 7, physical and concentration items 5)

**Flags:**
- [Today · urgent] Thoughts of death or self-harm were reported (PHQ-9 item 9: several days). Please don’t wait for your psychotherapist to read this report: contact your psychotherapist directly today, or call or text 988 now. If you might act on these thoughts or cannot stay safe, call 911 or go to an emergency department.
- [Today · clinical] Rated urgent despite a low C-SSRS screen because of: active suicidal thoughts (C-SSRS item 2). Same-day contact and a full risk assessment.
- [Today · clinical] C-SSRS screener: low risk (yes to items 1, 2). A screener result is not a risk assessment; a full clinical evaluation is needed.
- [Today · clinical] Access to lethal means reported (a gun or a supply of medications at home) with thoughts of death or self-harm: lethal-means counseling and a written safety plan.
- [Today · clinical] Higher priority (alcohol use alongside thoughts of death or self-harm): AUDIT-C 7/12, at or above the usual cut-off for women (3). AUDIT-C detects risky drinking better than it diagnoses alcohol use disorder. Raised priority: alcohol worsens depression (PHQ-9 12), so address it alongside them.

### 4. Violence without "unsafe"
**Vignette:** 52, "feels unsafe" = No; partner: physically hurt "fairly often", threatened "frequently", forced sex "rarely"; strangulation: Yes; partner gun: Not sure.

**Clinician box:**
- Likely stage: Not determined (menstrual pattern not answered or unsure)
- Medical (hardware) check: Likely physical contribution, 1 signal: [private] Injury from partner violence. Refer to physician; this is more than anxiety or depression alone.
- Today: 3 items: [private] Partner harm reported: client notice; [private] Strangulation by partner; [private] Physical harm by a partner (fairly often) and forced sexual activity by a…
- Within 1 business day: 3 items: [private] Injury from partner violence; [private] Relationship safety screen (E-HITS) positive; [private] Partner gun access: ask

**Flags:**
- [Today · urgent, private] You told us a partner has hurt you or forced sexual activity or choked you. You deserve to be safe. If you are in danger now, call 911. For confidential support any time, call the National Domestic Violence Hotline at 1-800-799-7233 or text START to 88788. Your psychotherapist will talk with you about this privately.
- [Today · clinical, private] Strangulation by a partner reported: one of the strongest predictors of later intimate-partner homicide. Same-day safety planning; consider a Danger Assessment.
- [Today · clinical, private] Physical harm by a partner (fairly often) and forced sexual activity by a partner (rarely) reported, regardless of E-HITS total. Same-day private contact and safety planning. Discuss privately and check whether any reporting rules apply.
- [Within 1 business day · medical, private] Physical or sexual harm by a partner, including strangulation: injuries may need medical care and documentation; include in the physician referral if the client agrees. (Physician note: Assess injuries; strangulation can cause delayed airway, vascular (carotid/vertebral dissection), and brain injury and needs medical evaluation; offer STI testing, emergency contraception if relevant, and forensic exam options.)
- [Within 1 business day · clinical, private] Relationship safety screen (E-HITS) positive: 13/25 (cut-off 7 or more). Discuss privately; safety planning may be needed. Check whether any reporting rules apply.
- [Within 1 business day · clinical, private] Partner gun access unknown: ask privately as part of the safety assessment.

### 5. Hysterectomy, heart and thyroid pattern
**Vignette:** 51, hysterectomy with ovaries kept, severe hot flushes, palpitations, chest pressure on exertion, heat intolerance/tremor/weight loss, GAD-7 17.

**Clinician box:**
- Likely stage: Can’t be determined from periods (hysterectomy with ovaries kept); symptoms, age, and if needed blood tests guide staging
- Medical (hardware) check: Likely physical contribution, 5 signals: Chest pain or breathlessness symptoms; Heat intolerance or tremor with anxiety symptoms; Palpitations; Hormone-affecting treatments; Severe hot flushes, untreated. Refer to physician; this is more than anxiety or depression alone.
- Today: 1 item: Chest pain or breathlessness symptoms
- Within 1 business day: 1 item: Heat intolerance or tremor with anxiety symptoms
- Within 7 days: 3 items: Palpitations; Hormone-affecting treatments; Severe hot flushes, untreated
- Therapy focus: PHQ-9 11 (moderate; mood and self-worth items 3, physical and concentration items 8) · GAD-7 17 (severe)

**Flags:**
- [Today · urgent] You reported: chest pain, pressure, or tightness. Get urgent medical assessment. If it is happening now, severe, or persistent, call 911.
- [Within 1 business day · medical] Heat intolerance, tremor, or unexplained weight loss together with trouble relaxing, restlessness, irritability, appetite change: this physical pattern can look like anxiety or perimenopause. Get a medical check before treating it as an anxiety disorder. (Physician note: Consider thyroid function.)
- [Within 7 days · medical] New or unexplained palpitations: a physical symptom that needs a medical check before it is treated as anxiety. (Physician note: Evaluate palpitations (ECG, thyroid, medications, caffeine, alcohol).)
- [Within 7 days · medical] Treatments or history that affect hormones (Hysterectomy (uterus removed), ovaries kept): these change how menopause and mood symptoms are read; coordinate with the medical clinician. (Physician note: Affects menopause staging and which treatments are suitable.)
- [Within 7 days · medical] Hot flushes and sweating rated severe with no current hormone therapy: a physical symptom that also drives sleep and mood; discuss treatment options with the physician. CBT and clinical hypnosis also reduce hot-flush bother (Menopause Society 2023). (Physician note: Hormone therapy is the most effective treatment for many women (without a uterus, estrogen alone is an option); non-hormonal options include fezolinetant, some SSRIs/SNRIs, and gabapentin.)
