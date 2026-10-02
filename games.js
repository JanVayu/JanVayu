// ═══════════════════════════════════════════════════════════
// LEARNING GAMES — Jeopardy, Quiz, Source Matcher, Snakes & Ladders, Jodi Match, Air Tambola
// All questions and content are original, written for JanVayu.
// The Jeopardy format is inspired by quiz-show formats.
// The board game is inspired by Moksha Patam, the original
// Indian Snakes & Ladders. The Tambola and Jodi (memory match)
// games are inspired by Indian household card games.
// ═══════════════════════════════════════════════════════════

// ── 1. JEOPARDY DATA ──
// 5 categories x 5 difficulty rows. Values ₹1,000 to ₹5,000.
// `clue` is the statement shown to the player; `q` is the matching
// question they should think of (classic Jeopardy quiz format).
// `why` is the educational note revealed alongside the answer.
const JEO_DATA = {
    'SOURCES': [
        { v: 1000, clue: "Burning firewood and dung on a traditional stove is part of the residential sector, which the ARAI/TERI 2018 study found to be the largest single contributor to PM2.5 in Delhi-NCR (25%). Name this household source.", q: "What is solid biomass cooking (chulha / firewood / dung)?", why: "ARAI/TERI 2018 (Delhi-NCR): residential 25%, industries 24%, agricultural burning 19%, transport 13% of PM2.5. PMUY raised LPG access, but average use was about 4.47 refills a year per PMUY household in FY2024-25 (PIB)." },
        { v: 2000, clue: "Punjab and Haryana farmers burn this between October and November.", q: "What is paddy stubble (rice straw)?", why: "Stubble-burning fires contribute most to Delhi's air pollution in October-November. SAFAR's peak daily stubble share has ranged widely by year; in the 2025 season the highest AQI was 428 on 11 November (CSE)." },
        { v: 3000, clue: "Only about 11% of India's coal-based capacity had installed this pollution-control equipment, required by a 2015 emission norm originally given a 2017 deadline.", q: "What are FGD (flue-gas desulphurisation) units?", why: "Only about 22.6 GW (11%) of coal-based capacity had FGD installed (CARE Ratings). The deadline has been extended repeatedly since 2017; since the July 2025 notification only Category A plants (about 11% of units) must install FGD, by 30 December 2027, and Category C plants (78%) are exempt (The Hindu, 12 July 2025). SO2 from coal plants forms secondary ammonium sulphate PM2.5 (CREA 2025)." },
        { v: 4000, clue: "The 2018 ARAI/TERI Delhi study found that this source, dust kicked up from roads by traffic, contributed 8% of winter PM10 and 4% of PM2.5.", q: "What is road dust (a non-exhaust source)?", why: "ARAI/TERI 2018 (Delhi, winter): road dust 4% of PM2.5 and 8% of PM10; construction 1% of PM2.5 and 6% of PM10. Road dust matters more for coarse PM10 than for PM2.5." },
        { v: 5000, clue: "This invisible gas, emitted heavily by power plants and industry, reacts in the atmosphere with ammonia from agriculture to form a major chunk of India's PM2.5.", q: "What is sulphur dioxide (SO2) &mdash; forming secondary sulphate aerosol?", why: "CREA 2025: ammonium sulphate, formed from SO2 and ammonia, is about 34% of India's PM2.5 mass nationally (20-43% across 130 NCAP cities)." }
    ],
    'HEALTH': [
        { v: 1000, clue: "At a PM2.5 level of 100 ug/m3, this is roughly how many of these per day a non-smoker is passively inhaling.", q: "What is about 4-5 cigarettes a day?", why: "Berkeley Earth: one cigarette per day is the rough equivalent of a PM2.5 level of 22 ug/m3, so 100 ug/m3 is about 4.5. JanVayu's dashboard shows this live." },
        { v: 2000, clue: "The 2025 Lancet Countdown attributes this many Indian deaths in 2022 to anthropogenic PM2.5 exposure.", q: "What is approximately 1.7 million?", why: "Lancet Countdown 2025: over 1,718,000 deaths in India in 2022 were attributable to anthropogenic PM2.5. A broader method (ambient + household air pollution + ozone), State of Global Air 2025, reports that India and China each had more than 2 million air-pollution deaths in 2023, out of 7.9 million worldwide." },
        { v: 3000, clue: "AQLI 2025 (2023 data) says the average Indian loses this many years of life expectancy due to particulate pollution exceeding the WHO guideline of 5 ug/m3.", q: "What is 3.5 years?", why: "AQLI 2025: nationally the average is 3.5 years; in the Northern Plains about 5 years and in Delhi 8.2 years. AQLI uses the Chen et al. (2013) and Ebenstein et al. (2017) China-based causal estimates: 0.98 years per 10 ug/m3 of PM2.5." },
        { v: 4000, clue: "These ultrafine particles, far smaller than PM2.5, are being studied for their ability to reach the brain.", q: "What is PM0.1 / ultrafine particulate matter?", why: "Experimental studies point to a key role for ultrafine particles (UFPs, under 100 nm) in brain effects (TUBE project); epidemiological links to dementia are suggestive. WHO 2021 gives good practice statements on UFPs but no guideline value." },
        { v: 5000, clue: "A landmark 2024 Indian study found that for every 10 ug/m3 increase in long-term PM2.5, all-cause mortality rose by approximately this much.", q: "What is about 8.6%?", why: "Lancet Planetary Health 2024 (Jaganathan et al.): a 10 ug/m3 increase in annual PM2.5 was associated with an 8.6% (95% CI 6.4-10.8) higher annual mortality, using a difference-in-differences design on district-level death registrations, 2009-2019. Earlier estimates relied on exposure-response functions from countries with low air pollution levels." }
    ],
    'POLICY': [
        { v: 1000, clue: "Launched in 2019, this national programme set a 20-30% PM10 reduction target (over 2017 levels) by 2024, then revised it to 40% by 2025-26.", q: "What is the National Clean Air Programme (NCAP)?", why: "NCAP covers 131 cities (130 analysed by CREA; PIB). The 31 March 2026 deadline has now elapsed: only 23 of the 100 cities with sufficient monitoring data met the 40% PM10 target (CREA, Tracing the Hazy Air 2026)." },
        { v: 2000, clue: "Delhi's stage-based emergency action plan, with bans on construction, older vehicles and regulated diesel generators at successive stages.", q: "What is GRAP (Graded Response Action Plan)?", why: "GRAP has 4 stages keyed to AQI 201, 301, 401, 451 (CAQM Direction of 29 September 2026). CAQM operationalises it and invokes stages in advance on forecasts." },
        { v: 3000, clue: "Created by an act of Parliament in 2021, this body replaced EPCA and has statutory power across the entire NCR.", q: "What is the Commission for Air Quality Management (CAQM)?", why: "CAQM in NCR and Adjoining Areas Act 2021. Its directions on stubble, vehicles, industry are legally binding; non-compliance is an offence under section 14, punishable with imprisonment of up to five years or a fine of up to Rs 1 crore." },
        { v: 4000, clue: "In M. C. Mehta v. Union of India (filed 1985), the Supreme Court ordered Delhi to switch this fleet to a cleaner fuel by 2002.", q: "What is the public bus and auto-rickshaw fleet (to CNG)?", why: "The Supreme Court's order of 28 July 1998 fixed the CNG switch-over; the deadline was extended to 30 September 2001 and then to 31 January 2002 (order of 5 April 2002)." },
        { v: 5000, clue: "India's PM2.5 annual standard is 40 ug/m3 &mdash; this many times the current WHO guideline.", q: "What is 8 times (the WHO guideline of 5 ug/m3)?", why: "WHO tightened from 10 to 5 ug/m3 in 2021. India's CPCB has not revised NAAQS since 2009." }
    ],
    'CITIES': [
        { v: 1000, clue: "Per IQAir 2025, this Indian city was named the most polluted capital in the world.", q: "What is New Delhi?", why: "IQAir World Air Quality Report 2025 (covering 2025 data, published March 2026): New Delhi annual PM2.5 of 82.2 ug/m3. Eighth straight year as the worst capital, per the Times of India (24 March 2026); IQAir's own release does not give a count." },
        { v: 2000, clue: "This Uttar Pradesh town topped the IQAir 2025 list of the world's most polluted cities, ahead of Hotan (China) and Byrnihat.", q: "What is Loni?", why: "Loni (Ghaziabad district) recorded 112.5 ug/m3 in 2025; Hotan, China was second (109.6) and Byrnihat third (101.1). Loni dethroned Byrnihat, Meghalaya, which had held the title in the 2024 report." },
        { v: 3000, clue: "A 2024 paper on the IITM decision-support system for Delhi attributes about 31% (post-monsoon) to 40% (winter) of Delhi's PM2.5 to this group of places outside Delhi.", q: "What are the NCR districts outside Delhi?", why: "Govardhan et al., Geoscientific Model Development 17 (2024): post-monsoon (winter) shares were Delhi 34.4% (33.4%), rest of NCR districts 31% (40.2%), biomass burning 7.3% (0.1%), all other regions 27.3% (26.4%). For 1-15 December 2025, CSE reports the DSS put local Delhi sources at about 35% and the remaining 65% in neighbouring NCR districts and regions further away." },
        { v: 4000, clue: "In IQAir's 2025 table of the world's most polluted cities, this Indian metropolis ranked fourth at 99.6 ug/m3, while the separate capital-city entry for New Delhi ranked 16th at 82.2.", q: "What is Delhi?", why: "IQAir 2025 most-polluted-cities table: Loni 112.5 (1st), Byrnihat 101.1 (3rd), Delhi 99.6 (4th), Ghaziabad 89.2 (7th), New Delhi 82.2 (16th). IQAir lists Delhi and New Delhi as separate entries." },
        { v: 5000, clue: "This Meghalaya town was IQAir's most polluted metropolitan area in its 2024 report (128.2 ug/m3) but ranked third in the 2025 table (101.1 ug/m3).", q: "What is Byrnihat (on the Assam-Meghalaya border)?", why: "Byrnihat is an industrial cluster in Ri-Bhoi district, Meghalaya, on the Assam border. IQAir 2024 report: 128.2 ug/m3, most polluted metropolitan area; 2025 table: third, behind Loni and Hotan (China)." }
    ],
    'ACTION': [
        { v: 1000, clue: "This three-letter Indian legal instrument, costing Rs 10 to file with central public authorities, lets any citizen demand pollution data from a public authority within 30 days.", q: "What is RTI (Right to Information)?", why: "RTI Act 2005, section 7(1): the reply is due within thirty days; states set their own fee. JanVayu's RTI Assistant generates ready-to-file templates targeting NCAP fund utilisation, GRAP compliance, and CAAQMS station downtime." },
        { v: 2000, clue: "The minimum NIOSH respirator grade that filters at least 95% of 0.3 micrometre test particles.", q: "What is N95 (or FFP2/KN95 equivalents)?", why: "N95 is a NIOSH class: at least 95% of 0.3 micrometre test particles. Real-world protection depends on a tight seal and fit." },
        { v: 3000, clue: "For a 200 sq ft Indian living room with an 8 ft ceiling, the AHAM rule of thumb asks for a purifier with at least roughly this CADR.", q: "What is about 133 cfm (about 225 m3/h)?", why: "AHAM: CADR (cfm) should be at least two-thirds of the room's floor area (sq ft) for 8 ft ceilings; multiply cfm by 1.7 to get m3/h. In general, CADR needed (cfm) is roughly room volume (cubic ft) x air changes per hour / 60, or in m3/min, room volume (m3) x air changes per hour / 60; 200 sq ft x 8 ft = 1,600 cubic ft at 5 air changes an hour gives about 133 cfm. JanVayu's Purifier Calculator does the live computation per city AQI." },
        { v: 4000, clue: "Filed in 2015 on behalf of three infants, this Supreme Court writ petition led to restrictions on Diwali firecrackers in NCR.", q: "What is Arjun Gopal v. Union of India?", why: "WP(C) 728/2015 was filed on 24 September 2015 on behalf of three infants. The 23 October 2018 judgment permitted only green or low-emission crackers and fixed hours for their use." },
        { v: 5000, clue: "A second appeal to the Information Commission under Section 19(3) of the RTI Act must be filed within this many days.", q: "What is 90 days?", why: "RTI Act 2005: a first appeal lies within 30 days (s.19(1)); a second appeal within 90 days (s.19(3)). The Commission can impose a penalty of Rs 250 per day, up to Rs 25,000 (s.20)." }
    ]
};
const JEO_CATS = Object.keys(JEO_DATA);
let jeoState = { score: 0, solved: 0, current: null, used: {} };

function formatINR(n) {
    // Indian-style grouping: 1,00,000 etc.
    return '₹' + n.toLocaleString('en-IN');
}

function renderJeopardyBoard() {
    const board = document.getElementById('jeo-board');
    if (!board) return;
    board.innerHTML = '';
    // Header row
    JEO_CATS.forEach(cat => {
        const h = document.createElement('div');
        h.style.cssText = 'background: var(--accent); color: var(--on-accent); font-weight: 700; padding: 14px 8px; text-align: center; border-radius: 8px; font-size: 0.78rem; letter-spacing: 0.04em; text-transform: uppercase;';
        h.textContent = cat;
        board.appendChild(h);
    });
    // 5 rows of 5 cells
    for (let row = 0; row < 5; row++) {
        JEO_CATS.forEach(cat => {
            const cell = JEO_DATA[cat][row];
            const key = cat + '-' + cell.v;
            const used = jeoState.used[key];
            const div = document.createElement('div');
            div.style.cssText = 'background: ' + (used ? 'var(--bg-section)' : 'linear-gradient(135deg, #1B6B4A, #134E33)') + '; color: ' + (used ? 'var(--text-3)' : '#FFD86B') + '; font-family: var(--serif); font-weight: 700; font-size: 1.25rem; padding: 22px 8px; text-align: center; border-radius: 8px; cursor: ' + (used ? 'default' : 'pointer') + '; user-select: none; min-height: 60px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s;';
            div.textContent = used ? '✓' : formatINR(cell.v);
            if (!used) {
                div.onmouseover = () => { div.style.transform = 'scale(1.04)'; };
                div.onmouseout = () => { div.style.transform = 'scale(1)'; };
                div.onclick = () => openJeopardyClue(cat, row);
            }
            board.appendChild(div);
        });
    }
    document.getElementById('jeo-score').textContent = formatINR(jeoState.score);
    document.getElementById('jeo-solved').textContent = jeoState.solved;
}
function openJeopardyClue(cat, row) {
    const cell = JEO_DATA[cat][row];
    jeoState.current = { cat, row, key: cat + '-' + cell.v };
    document.getElementById('jeo-clue-meta').textContent = cat + '  —  ' + formatINR(cell.v);
    document.getElementById('jeo-clue-text').textContent = cell.clue;
    document.getElementById('jeo-answer-text').textContent = cell.q;
    document.getElementById('jeo-explainer').textContent = cell.why;
    document.getElementById('jeo-answer-block').style.display = 'none';
    document.getElementById('jeo-reveal-btn').style.display = '';
    document.getElementById('jeo-got-btn').style.display = 'none';
    document.getElementById('jeo-missed-btn').style.display = 'none';
    document.getElementById('jeo-overlay').style.display = 'flex';
}
function closeJeopardyClue() {
    document.getElementById('jeo-overlay').style.display = 'none';
}
function revealJeopardyAnswer() {
    document.getElementById('jeo-answer-block').style.display = 'block';
    document.getElementById('jeo-reveal-btn').style.display = 'none';
    document.getElementById('jeo-got-btn').style.display = '';
    document.getElementById('jeo-missed-btn').style.display = '';
}
function scoreJeopardy(got) {
    if (!jeoState.current) return;
    const { cat, row, key } = jeoState.current;
    const cell = JEO_DATA[cat][row];
    if (got) jeoState.score += cell.v;
    jeoState.used[key] = true;
    jeoState.solved += 1;
    closeJeopardyClue();
    renderJeopardyBoard();
    if (jeoState.solved === 25) {
        setTimeout(() => alert('Board cleared! Final score: ' + formatINR(jeoState.score) + ' out of ₹75,000. Try the PM Quick-Quiz or the Snakes & Ladders board next.'), 220);
    }
}
function resetJeopardy() {
    jeoState = { score: 0, solved: 0, current: null, used: {} };
    renderJeopardyBoard();
}

// ── 2. QUIZ DATA ──
const QUIZ_QUESTIONS = [
    {
        q: "What does PM2.5 actually mean?",
        opts: [
            "Particulate matter that weighs 2.5 grams",
            "Particulate matter with diameter under 2.5 micrometres",
            "The 2.5 most polluting industries",
            "A pollution index between 0 and 2.5"
        ],
        ans: 1,
        why: "PM2.5 = particulate matter ≤ 2.5 µm diameter, about 1/30th the width of a human hair. Small enough to enter alveoli and bloodstream."
    },
    {
        q: "WHO's 2021 annual PM2.5 guideline (the safe limit) is:",
        opts: ["40 ug/m3", "25 ug/m3", "10 ug/m3", "5 ug/m3"],
        ans: 3,
        why: "WHO halved its guideline from 10 to 5 ug/m3 in 2021. India's NAAQS (40) is 8x more permissive."
    },
    {
        q: "Per Lancet Countdown 2025, India's annual PM2.5 mortality (2022) is approximately:",
        opts: ["170,000", "700,000", "1.7 million", "5 million"],
        ans: 2,
        why: "Over 1,718,000 Indian deaths in 2022 were attributable to anthropogenic PM2.5 (Lancet Countdown 2025). State of Global Air 2025 reports India and China each had more than 2 million air-pollution deaths in 2023 on a broader method."
    },
    {
        q: "Which season typically has the worst PM2.5 in north India?",
        opts: ["Summer (April-June)", "Monsoon (July-September)", "Winter (Nov-Feb)", "Pre-monsoon (March)"],
        ans: 2,
        why: "Winter inversions trap pollutants near the surface. Monsoon rains scavenge particles and bring the cleanest air."
    },
    {
        q: "GRAP Stage IV in Delhi-NCR is triggered at AQI:",
        opts: ["201", "301", "401", "451"],
        ans: 3,
        why: "Stage IV = 'Severe-plus', AQI > 450. Under the CAQM schedule of 29 September 2026 it stops truck entry, extends construction bans to linear projects and moves classes VI-IX and XI to hybrid mode; states may consider closing colleges."
    },
    {
        q: "What does NCAP stand for?",
        opts: [
            "National Carbon Action Programme",
            "National Clean Air Programme",
            "Northern Cities Air Project",
            "National Coal Adjustment Plan"
        ],
        ans: 1,
        why: "NCAP launched in January 2019 and covers 131 cities (non-attainment and million-plus). The revised target is a 40% PM10 reduction, or 60 ug/m3, by 2025-26 (PIB)."
    },
    {
        q: "Berkeley Earth's cigarette equivalence is roughly 1 cigarette per:",
        opts: ["1 ug/m3 PM2.5/day", "5 ug/m3 PM2.5/day", "22 ug/m3 PM2.5/day", "100 ug/m3 PM2.5/day"],
        ans: 2,
        why: "1 cigarette ~ 22 ug/m3 PM2.5 over 24 hours. At 100 ug/m3 that is ~4.5 cigarettes a day."
    },
    {
        q: "Which agency physically operates India's CAAQMS (continuous monitoring) stations?",
        opts: ["WHO", "MoEFCC directly", "CPCB and State Pollution Control Boards", "IQAir"],
        ans: 2,
        why: "CAAQMS stations are operated by CPCB, State Pollution Control Boards and Pollution Control Committees (CPCB CAAQMS page)."
    },
    {
        q: "Per the IQAir 2025 report, the most polluted city in the world (2025 data) was:",
        opts: ["New Delhi, India", "Lahore, Pakistan", "Loni, India", "Byrnihat, India"],
        ans: 2,
        why: "Loni (Ghaziabad, UP): 112.5 ug/m3 annual PM2.5. Hotan (China) was second at 109.6 and Byrnihat third at 101.1; Byrnihat had topped the 2024 report."
    },
    {
        q: "In the ARAI/TERI 2018 source apportionment for Delhi-NCR, which sector was the largest single contributor to PM2.5?",
        opts: [
            "Residential (25%)",
            "Industries (24%)",
            "Agricultural burning (19%)",
            "Transport (13%)"
        ],
        ans: 0,
        why: "ARAI/TERI 2018 (Delhi-NCR): residential 25%, industries 24%, agricultural burning 19%, transport 13% of PM2.5."
    }
];
let quizState = { i: 0, score: 0, answered: false };
function startQuiz() {
    quizState = { i: 0, score: 0, answered: false };
    document.getElementById('quiz-q-total').textContent = QUIZ_QUESTIONS.length;
    renderQuizQuestion();
}
function renderQuizQuestion() {
    const body = document.getElementById('quiz-card-body');
    if (quizState.i >= QUIZ_QUESTIONS.length) {
        const pct = Math.round(quizState.score / QUIZ_QUESTIONS.length * 100);
        let verdict = pct >= 90 ? 'Air-quality nerd. Genuinely.' : pct >= 70 ? 'Solid. You can hold a panel discussion.' : pct >= 50 ? 'Useful baseline. Keep reading the blog.' : 'Worth a workshop.';
        body.innerHTML = '<h3 style="font-family: var(--serif); margin: 0 0 8px;">Quiz complete</h3>' +
            '<div style="font-size: 1.4rem; font-weight: 700; color: var(--accent); margin-bottom: 6px;">' + quizState.score + ' / ' + QUIZ_QUESTIONS.length + '  (' + pct + '%)</div>' +
            '<div style="font-size: 0.9rem; color: var(--text-2); margin-bottom: 14px;">' + verdict + '</div>' +
            '<button class="btn btn-primary" onclick="startQuiz()">Restart</button>';
        document.getElementById('quiz-q-num').textContent = QUIZ_QUESTIONS.length;
        return;
    }
    const Q = QUIZ_QUESTIONS[quizState.i];
    document.getElementById('quiz-q-num').textContent = quizState.i + 1;
    document.getElementById('quiz-score').textContent = quizState.score;
    quizState.answered = false;
    let html = '<div style="font-family: var(--serif); font-size: 1.15rem; line-height: 1.4; margin-bottom: 14px;">' + Q.q + '</div>';
    html += '<div style="display: flex; flex-direction: column; gap: 8px;">';
    Q.opts.forEach((opt, i) => {
        html += '<button class="quiz-opt-btn" onclick="answerQuiz(' + i + ')" data-i="' + i + '" style="text-align: left; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-section); color: var(--ink); font-size: 0.9rem; cursor: pointer; transition: background 0.1s;">' + String.fromCharCode(65 + i) + '. ' + opt + '</button>';
    });
    html += '</div><div id="quiz-feedback" style="margin-top: 14px;"></div>';
    body.innerHTML = html;
}
function answerQuiz(i) {
    if (quizState.answered) return;
    quizState.answered = true;
    const Q = QUIZ_QUESTIONS[quizState.i];
    const correct = i === Q.ans;
    if (correct) quizState.score += 1;
    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        const idx = parseInt(btn.getAttribute('data-i'));
        btn.style.cursor = 'default';
        if (idx === Q.ans) {
            btn.style.background = '#DCFCE7'; btn.style.borderColor = '#86EFAC'; btn.style.color = '#166534'; btn.style.fontWeight = '700';
        } else if (idx === i) {
            btn.style.background = '#FEE2E2'; btn.style.borderColor = '#FCA5A5'; btn.style.color = '#991B1B';
        } else {
            btn.style.opacity = '0.6';
        }
    });
    const fb = document.getElementById('quiz-feedback');
    fb.innerHTML = '<div style="padding: 12px; border-radius: 8px; background: var(--bg-section); border-left: 3px solid ' + (correct ? '#22C55E' : '#EF4444') + ';">' +
        '<div style="font-weight: 700; margin-bottom: 6px; color: ' + (correct ? '#166534' : '#991B1B') + ';">' + (correct ? 'Correct.' : 'Not quite.') + '</div>' +
        '<div style="font-size: 0.85rem; color: var(--text-2); line-height: 1.55;">' + Q.why + '</div>' +
        '<button class="btn btn-primary mt-2" onclick="nextQuiz()">' + (quizState.i + 1 === QUIZ_QUESTIONS.length ? 'See results' : 'Next question') + '</button></div>';
    document.getElementById('quiz-score').textContent = quizState.score;
}
function nextQuiz() {
    quizState.i += 1;
    renderQuizQuestion();
}

// ── 3. SOURCE MATCHER DATA ──
const MATCH_PAIRS = [
    { src: 'Stubble burning', desc: 'Punjab + Haryana paddy residue burned in the Oct-Nov window.' },
    { src: 'Residential biomass', desc: 'Cooking on chulhas with firewood / dung; the residential sector was the largest single PM2.5 contributor in Delhi-NCR (ARAI/TERI 2018, 25%).' },
    { src: 'Coal thermal power', desc: 'SO2 and NOx that oxidise into secondary sulphate / nitrate aerosol; only about 11% of coal capacity had FGD installed in 2025 (CARE Ratings).' },
    { src: 'Road dust + non-exhaust', desc: 'Tyre and brake wear plus resuspended dust; road dust was 4% of Delhi winter PM2.5 and 8% of PM10 (ARAI/TERI 2018).' },
    { src: 'Brick kilns', desc: 'Seasonal firing across the Indo-Gangetic Plain; converting to zigzag tech can cut particulate emissions by roughly 35-50% (CCAC, IFC).' },
    { src: 'Diesel gensets', desc: 'Backup power in commercial buildings and apartments during outages; regulated from GRAP Stage I, with restrictions by generator capacity.' },
    { src: 'Open waste burning', desc: 'Municipal solid waste lit at night at landfills and street corners.' }
];
let matchState = { selected: null, matches: {} };
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}
function renderMatcher() {
    const sources = MATCH_PAIRS.map((p, i) => ({ id: 's' + i, label: p.src, srcIdx: i }));
    const descs = shuffle(MATCH_PAIRS.map((p, i) => ({ id: 'd' + i, label: p.desc, srcIdx: i })));
    const sBox = document.getElementById('match-sources');
    const dBox = document.getElementById('match-descs');
    sBox.innerHTML = ''; dBox.innerHTML = '';
    sources.forEach(s => {
        const el = document.createElement('button');
        el.className = 'match-src-btn';
        el.dataset.id = s.id; el.dataset.srcIdx = s.srcIdx;
        el.style.cssText = 'text-align: left; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-section); color: var(--ink); font-size: 0.85rem; cursor: pointer; font-weight: 600;';
        el.textContent = s.label;
        el.onclick = () => selectMatchSrc(el);
        sBox.appendChild(el);
    });
    descs.forEach(d => {
        const el = document.createElement('button');
        el.className = 'match-desc-btn';
        el.dataset.id = d.id; el.dataset.srcIdx = d.srcIdx;
        el.style.cssText = 'text-align: left; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-section); color: var(--ink); font-size: 0.82rem; cursor: pointer; line-height: 1.45;';
        el.textContent = d.label;
        el.onclick = () => selectMatchDesc(el);
        dBox.appendChild(el);
    });
    matchState = { selected: null, matches: {} };
    document.getElementById('match-result').textContent = '';
}
function selectMatchSrc(el) {
    document.querySelectorAll('.match-src-btn').forEach(b => { b.style.borderColor = 'var(--border)'; b.style.borderWidth = '1px'; });
    el.style.borderColor = 'var(--accent)'; el.style.borderWidth = '2px';
    matchState.selected = el.dataset.srcIdx;
}
function selectMatchDesc(el) {
    if (matchState.selected === null) { document.getElementById('match-result').textContent = 'Pick a source on the left first.'; return; }
    const srcIdx = matchState.selected;
    matchState.matches[srcIdx] = el.dataset.srcIdx;
    el.style.borderColor = 'var(--accent)'; el.style.borderWidth = '2px';
    el.textContent = '→ ' + MATCH_PAIRS[srcIdx].src + ': ' + el.textContent.replace(/^→ [^:]+: /, '');
    el.disabled = true; el.style.opacity = '0.95';
    document.querySelectorAll('.match-src-btn').forEach(b => {
        if (b.dataset.srcIdx === srcIdx) {
            b.disabled = true; b.style.opacity = '0.6'; b.style.borderColor = 'var(--border)'; b.style.borderWidth = '1px';
        }
    });
    matchState.selected = null;
    document.getElementById('match-result').textContent = '';
}
function checkMatcher() {
    let correct = 0;
    Object.keys(matchState.matches).forEach(srcIdx => {
        if (matchState.matches[srcIdx] === srcIdx) correct += 1;
    });
    const total = MATCH_PAIRS.length;
    const r = document.getElementById('match-result');
    r.textContent = correct + ' / ' + total + ' correct.' + (correct === total ? '  ✓ Perfect.' : '  Try shuffle to retry.');
    r.style.color = correct === total ? '#166534' : 'var(--text-2)';
}
function resetMatcher() { renderMatcher(); }

// ── 4. SNAKES & LADDERS (Clean Air Edition, inspired by Moksha Patam) ──
// 6×6 board, 36 squares, classic serpentine layout (1 bottom-left, 36 top-left).
// Ladders lift the player on a positive citizen action; snakes drop them on a
// pollution event or policy slip. Each special square has a one-line learning fact.
const SL_BOARD_SIZE = 36;
const SL_LADDERS = {
    3:  { to: 11, msg: 'Ladder &mdash; you swapped to LPG and stopped using a chulha for cooking. Your exposure to cooking smoke falls.' },
    7:  { to: 17, msg: 'Ladder &mdash; you fit-tested an N95 mask. It filters at least 95% of test particles when sealed.' },
    14: { to: 24, msg: 'Ladder &mdash; you filed an RTI on NCAP fund utilisation. The reply is due within 30 days.' },
    21: { to: 30, msg: 'Ladder &mdash; you submitted a public comment on your city\'s draft Action Plan. Your comment goes on the record.' },
    27: { to: 35, msg: 'Ladder &mdash; you joined your RWA\'s pollution committee. Local construction now follows dust rules.' }
};
const SL_SNAKES = {
    10: { to: 2,  msg: 'Snake &mdash; Diwali fireworks. Pollution spikes about three-fold around Diwali (CarbonCopy, 2021-25 report).' },
    18: { to: 6,  msg: 'Snake &mdash; coal plants miss the FGD deadline. Again. Secondary sulphate aerosol stays high.' },
    25: { to: 13, msg: 'Snake &mdash; stubble-burn peak. Smoke can push Delhi into the Severe range; the 2025 season\'s highest AQI was 428 on 11 November (CSE).' },
    32: { to: 19, msg: 'Snake &mdash; GRAP-IV triggered. Trucks barred, construction halted on linear projects, classes go hybrid. The reactive cycle resets.' },
    34: { to: 20, msg: 'Snake &mdash; the NCAP city deadline slips by another year. Targets revised, not met.' }
};
const SL_FINISH_MSG = '<strong>Square 36 reached.</strong> India meets the WHO 5 µg/m³ guideline. Roll count: <span id="sl-final-rolls"></span>. The fewer rolls, the closer to the ideal path. Try the Jeopardy board next.';
let slState = { pos: 1, rolls: 0, finished: false };

function slCellNumberAt(row, col) {
    // row 0 = bottom row (squares 1-6), row 5 = top row (squares 31-36)
    // Even-from-bottom rows: left to right. Odd: right to left.
    if (row % 2 === 0) return row * 6 + col + 1;
    return row * 6 + (6 - col);
}
function renderSnakesLadders() {
    const board = document.getElementById('sl-board');
    if (!board) return;
    board.innerHTML = '';
    // Render rows top-down (row 5 first, row 0 last) so visual top = square 36.
    for (let r = 5; r >= 0; r--) {
        for (let c = 0; c < 6; c++) {
            const n = slCellNumberAt(r, c);
            const isLadder = SL_LADDERS[n];
            const isSnake = SL_SNAKES[n];
            const isFinish = n === SL_BOARD_SIZE;
            const isStart = n === 1;
            const isPlayer = slState.pos === n;
            let bg = 'var(--bg-card)';
            let fg = 'var(--ink)';
            let badge = '';
            if (isLadder) { bg = 'rgba(22,163,74,0.14)'; badge = '<div style="position:absolute;top:2px;right:4px;font-size:0.6rem;color:#16A34A;font-weight:700;">↑ ' + isLadder.to + '</div>'; }
            if (isSnake)  { bg = 'rgba(220,38,38,0.14)'; badge = '<div style="position:absolute;top:2px;right:4px;font-size:0.6rem;color:#DC2626;font-weight:700;">↓ ' + isSnake.to + '</div>'; }
            if (isFinish) { bg = 'linear-gradient(135deg, #1B6B4A, #134E33)'; fg = '#FFD86B'; }
            if (isStart && !isPlayer)  { bg = 'rgba(124,58,237,0.10)'; }
            const cell = document.createElement('div');
            cell.style.cssText = 'position: relative; background: ' + bg + '; color: ' + fg + '; border-radius: 6px; min-height: 60px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; border: 1px solid var(--border); transition: transform 0.15s;';
            cell.innerHTML = badge + '<div style="text-align:center;">' + n + (isPlayer ? '<div style="font-size:1.25rem;line-height:1;margin-top:2px;">●</div>' : '') + '</div>';
            if (isPlayer) {
                cell.style.outline = '3px solid var(--accent)';
                cell.style.transform = 'scale(1.04)';
            }
            board.appendChild(cell);
        }
    }
    document.getElementById('sl-pos').textContent = slState.pos;
    document.getElementById('sl-rolls').textContent = slState.rolls;
}
function rollSnakesLadders() {
    if (slState.finished) return;
    const dice = Math.floor(Math.random() * 6) + 1;
    slState.rolls += 1;
    document.getElementById('sl-last-roll').textContent = dice;
    let next = slState.pos + dice;
    let msgHTML = '';
    if (next > SL_BOARD_SIZE) {
        msgHTML = 'Rolled <strong>' + dice + '</strong>. You need an exact roll to finish &mdash; ' + (next - SL_BOARD_SIZE) + ' too many. Stay put and try again.';
        renderSnakesLadders();
        document.getElementById('sl-message').innerHTML = msgHTML;
        return;
    }
    msgHTML = 'Rolled <strong>' + dice + '</strong>. Moved from ' + slState.pos + ' to ' + next + '.';
    slState.pos = next;
    if (SL_LADDERS[next]) {
        const L = SL_LADDERS[next];
        msgHTML += '<br><span style="color:#16A34A;font-weight:600;">' + L.msg + '</span> Climbed to ' + L.to + '.';
        slState.pos = L.to;
    } else if (SL_SNAKES[next]) {
        const S = SL_SNAKES[next];
        msgHTML += '<br><span style="color:#DC2626;font-weight:600;">' + S.msg + '</span> Slid to ' + S.to + '.';
        slState.pos = S.to;
    }
    if (slState.pos === SL_BOARD_SIZE) {
        slState.finished = true;
        msgHTML += '<br><br>' + SL_FINISH_MSG;
        document.getElementById('sl-roll-btn').disabled = true;
        document.getElementById('sl-roll-btn').style.opacity = '0.5';
    }
    renderSnakesLadders();
    document.getElementById('sl-message').innerHTML = msgHTML;
    if (slState.finished) {
        const fr = document.getElementById('sl-final-rolls');
        if (fr) fr.textContent = slState.rolls;
    }
}
function resetSnakesLadders() {
    slState = { pos: 1, rolls: 0, finished: false };
    document.getElementById('sl-roll-btn').disabled = false;
    document.getElementById('sl-roll-btn').style.opacity = '1';
    document.getElementById('sl-last-roll').textContent = '—';
    document.getElementById('sl-message').innerHTML = 'Press <strong>Roll dice</strong> to begin. Token starts at square 1.';
    renderSnakesLadders();
}

// ── 5. JODI MATCH (memory-card) ──
// 6 pairs (12 cards). A pair is two cards with the same `pairId`.
const JODI_PAIRS = [
    { pairId: 1, a: 'Chulha smoke',    b: 'A major household PM2.5 source' },
    { pairId: 2, a: 'NCAP',            b: 'National Clean Air Programme' },
    { pairId: 3, a: 'GRAP-IV',         b: 'AQI > 450 (severe-plus)' },
    { pairId: 4, a: 'CAQM',            b: 'NCR statutory air-quality body (2021 Act)' },
    { pairId: 5, a: 'WHO PM2.5',       b: '5 µg/m³ annual guideline (since 2021)' },
    { pairId: 6, a: 'N95',             b: 'Mask filtering ≥95% of PM2.5 when fitted' }
];
let jodiState = { cards: [], firstIdx: null, secondIdx: null, found: 0, moves: 0, locked: false };
function jodiShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}
function renderJodi() {
    const board = document.getElementById('jodi-board');
    if (!board) return;
    board.innerHTML = '';
    jodiState.cards.forEach((card, idx) => {
        const div = document.createElement('div');
        const isFlipped = card.flipped || card.matched;
        div.style.cssText = 'min-height: 110px; border-radius: 10px; cursor: ' + (card.matched ? 'default' : 'pointer') + '; padding: 10px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 0.85rem; line-height: 1.35; font-weight: 600; transition: transform 0.18s; user-select: none; ' +
            (isFlipped
                ? (card.matched
                    ? 'background: rgba(34,197,94,0.14); color: #166534; border: 2px solid #86EFAC;'
                    : 'background: var(--bg-card); color: var(--ink); border: 2px solid var(--accent);')
                : 'background: linear-gradient(135deg, #1B6B4A, #134E33); color: #FFD86B; border: 2px solid #134E33;');
        div.textContent = isFlipped ? card.text : '?';
        if (!card.matched && !card.flipped) {
            div.onclick = () => flipJodi(idx);
            div.onmouseover = () => { div.style.transform = 'scale(1.04)'; };
            div.onmouseout = () => { div.style.transform = 'scale(1)'; };
        }
        board.appendChild(div);
    });
    document.getElementById('jodi-found').textContent = jodiState.found;
    document.getElementById('jodi-moves').textContent = jodiState.moves;
    if (jodiState.found === JODI_PAIRS.length) {
        const r = document.getElementById('jodi-result');
        r.style.display = 'block';
        r.innerHTML = '<strong>All six jodis matched.</strong> Total moves: ' + jodiState.moves + '. Perfect run = 6 moves. Play Air Tambola or restart to beat your best.';
    } else {
        document.getElementById('jodi-result').style.display = 'none';
    }
}
function flipJodi(idx) {
    if (jodiState.locked) return;
    const card = jodiState.cards[idx];
    if (card.flipped || card.matched) return;
    card.flipped = true;
    if (jodiState.firstIdx === null) {
        jodiState.firstIdx = idx;
        renderJodi();
        return;
    }
    jodiState.secondIdx = idx;
    jodiState.moves += 1;
    renderJodi();
    const a = jodiState.cards[jodiState.firstIdx];
    const b = jodiState.cards[jodiState.secondIdx];
    if (a.pairId === b.pairId) {
        a.matched = true; b.matched = true;
        jodiState.found += 1;
        jodiState.firstIdx = null; jodiState.secondIdx = null;
        renderJodi();
    } else {
        jodiState.locked = true;
        setTimeout(() => {
            a.flipped = false; b.flipped = false;
            jodiState.firstIdx = null; jodiState.secondIdx = null;
            jodiState.locked = false;
            renderJodi();
        }, 900);
    }
}
function resetJodi() {
    const cards = [];
    JODI_PAIRS.forEach(p => {
        cards.push({ pairId: p.pairId, text: p.a, flipped: false, matched: false });
        cards.push({ pairId: p.pairId, text: p.b, flipped: false, matched: false });
    });
    jodiState = { cards: jodiShuffle(cards), firstIdx: null, secondIdx: null, found: 0, moves: 0, locked: false };
    renderJodi();
}

// ── 6. AIR TAMBOLA (Indian housie) ──
// Pool of 27 air-quality terms, each with a clue. We pick 15 for the ticket
// and the caller draws clues from a shuffled queue of all 27.
const TAMBOLA_POOL = [
    { term: 'PM2.5',     clue: 'Particulate matter ≤ this many micrometres in diameter — the regulated fine fraction.' },
    { term: 'PM10',      clue: 'The coarser regulated dust fraction, ≤ this many µm.' },
    { term: 'WHO 5',     clue: 'WHO 2021 annual PM2.5 guideline value, in µg/m³.' },
    { term: 'NCAP',      clue: 'India\'s national programme launched in 2019, targeting 131 non-attainment cities.' },
    { term: 'CAQM',      clue: 'NCR statutory air-quality body created by the 2021 Act, replacing EPCA.' },
    { term: 'GRAP-IV',   clue: 'Severe-plus emergency stage, triggered when AQI exceeds 450.' },
    { term: 'CPCB',      clue: 'India\'s central pollution regulator under MoEFCC.' },
    { term: 'CAAQMS',    clue: 'India\'s continuous air-quality monitoring station network — six-letter acronym.' },
    { term: 'AQLI',      clue: 'Chicago index that measures life-expectancy lost to particulate pollution.' },
    { term: 'IQAir',     clue: 'Annual world air-quality report publisher, named Loni #1 in 2025.' },
    { term: 'Loni',      clue: 'Most polluted city in the world per IQAir 2025 — small UP town in Ghaziabad district.' },
    { term: 'Byrnihat',  clue: 'Assam-Meghalaya border town, #1 most polluted in IQAir 2024, third in 2025 (behind Hotan, China).' },
    { term: 'Chulha',    clue: 'Traditional biomass cookstove — a major household PM2.5 source in rural India.' },
    { term: 'Stubble',   clue: 'Paddy crop residue burned in Punjab/Haryana between October and November.' },
    { term: 'FGD',       clue: 'Coal-plant flue-gas desulphurisation tech — only about 11% of capacity has it.' },
    { term: 'N95',       clue: 'Mask grade that filters ≥95% of PM2.5 when fitted properly.' },
    { term: 'HEPA',      clue: 'Filter standard inside indoor air purifiers; full name "high-efficiency particulate air".' },
    { term: 'PMUY',      clue: 'Government scheme that distributed LPG connections to BPL households.' },
    { term: 'BS-VI',     clue: 'India\'s current vehicle emission standard, mandatory since 2020.' },
    { term: 'Diwali',    clue: 'Autumn Indian festival whose firecrackers spike NCR pollution about three-fold (CarbonCopy, 2021-25 report).' },
    { term: 'Lancet 1.72M', clue: 'Lancet Countdown 2025 figure for Indian PM2.5 deaths in 2022.' },
    { term: 'RTI',       clue: 'Citizens\' three-letter legal tool for getting air-quality data from public bodies.' },
    { term: 'Ozone (O₃)', clue: 'Summertime secondary pollutant formed when NOx and VOCs react in sunlight.' },
    { term: 'NOx',       clue: 'Vehicle and power-plant exhaust gas; precursor to nitrate aerosol.' },
    { term: 'SO₂',       clue: 'Coal-plant emission that oxidises to secondary sulphate PM2.5.' },
    { term: 'Black Carbon', clue: 'Soot from incomplete combustion; one of the largest short-lived warming agents (ranked second after CO₂ in a 2008 estimate).' },
    { term: 'Brick Kiln', clue: 'Indo-Gangetic Plain seasonal source; zigzag tech can cut particulate emissions by roughly 35-50% (CCAC, IFC).' }
];
// 3 rows × 9 cols, with 5 cells filled per row (Indian housie standard)
let tambolaState = { ticket: [], queue: [], called: [], marks: {}, calls: 0, wins: { top: false, middle: false, bottom: false, full: false } };

function buildTambolaTicket() {
    // Pick 15 unique terms from the pool
    const pool = TAMBOLA_POOL.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const chosen = pool.slice(0, 15);
    // Lay out in 3 rows × 9 cols, 5 filled per row
    const ticket = [[null,null,null,null,null,null,null,null,null], [null,null,null,null,null,null,null,null,null], [null,null,null,null,null,null,null,null,null]];
    let idx = 0;
    for (let r = 0; r < 3; r++) {
        // Pick 5 distinct columns for this row
        const cols = [];
        while (cols.length < 5) {
            const c = Math.floor(Math.random() * 9);
            if (!cols.includes(c)) cols.push(c);
        }
        cols.sort((a,b)=>a-b).forEach(c => {
            ticket[r][c] = chosen[idx++];
        });
    }
    return ticket;
}
function renderTambolaTicket() {
    const grid = document.getElementById('tambola-ticket');
    if (!grid) return;
    grid.innerHTML = '';
    tambolaState.ticket.forEach((row, r) => {
        row.forEach((cell, c) => {
            const div = document.createElement('div');
            if (!cell) {
                div.style.cssText = 'min-height: 56px; background: var(--bg-section); border-radius: 4px; opacity: 0.4;';
                grid.appendChild(div);
                return;
            }
            const isMarked = tambolaState.marks[cell.term];
            div.style.cssText = 'min-height: 56px; padding: 6px 4px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 0.7rem; font-weight: 700; line-height: 1.15; border-radius: 6px; cursor: pointer; user-select: none; transition: background 0.15s; ' +
                (isMarked
                    ? 'background: linear-gradient(135deg, #1B6B4A, #134E33); color: #FFD86B; text-decoration: line-through;'
                    : 'background: var(--bg-card); color: var(--ink); border: 1px solid var(--border);');
            div.textContent = cell.term;
            div.onclick = () => markTambolaCell(cell.term);
            grid.appendChild(div);
        });
    });
    document.getElementById('tambola-calls').textContent = tambolaState.calls;
    let marked = 0;
    tambolaState.ticket.forEach(row => row.forEach(cell => { if (cell && tambolaState.marks[cell.term]) marked += 1; }));
    document.getElementById('tambola-marked').textContent = marked;
    checkTambolaWins();
}
function markTambolaCell(term) {
    // Only allow marking if the term has been called
    if (!tambolaState.called.includes(term)) {
        const clue = document.getElementById('tambola-clue');
        clue.innerHTML = '<em>"' + term + '" has not been called yet.</em> Press <strong>Call next</strong> first.';
        return;
    }
    tambolaState.marks[term] = true;
    renderTambolaTicket();
}
function callNextTambola() {
    if (tambolaState.queue.length === 0) {
        document.getElementById('tambola-clue').innerHTML = '<em>All 27 clues called.</em> Restart for a new ticket.';
        return;
    }
    const nextTerm = tambolaState.queue.shift();
    tambolaState.called.push(nextTerm.term);
    tambolaState.calls += 1;
    document.getElementById('tambola-clue').innerHTML = '<strong>Call ' + tambolaState.calls + ':</strong> ' + nextTerm.clue + ' &nbsp;<span style="font-size: 0.78rem; color: var(--text-3);">(answer: <strong>' + nextTerm.term + '</strong> &mdash; tap your ticket to mark)</span>';
    renderTambolaTicket();
}
function checkTambolaWins() {
    const t = tambolaState.ticket;
    function rowDone(r) {
        return t[r].every(cell => cell === null || tambolaState.marks[cell.term]);
    }
    const wins = ['top', 'middle', 'bottom'];
    [0, 1, 2].forEach(i => {
        const key = wins[i];
        if (!tambolaState.wins[key] && rowDone(i)) {
            tambolaState.wins[key] = true;
            announceTambolaWin(key);
        }
    });
    const fullDone = [0,1,2].every(rowDone);
    if (!tambolaState.wins.full && fullDone) {
        tambolaState.wins.full = true;
        announceTambolaWin('full');
    }
    document.querySelectorAll('.tambola-win-badge').forEach(b => {
        const w = b.getAttribute('data-win');
        if (tambolaState.wins[w]) {
            b.style.background = '#1B6B4A'; b.style.color = '#FFD86B'; b.style.borderColor = '#134E33';
            b.textContent = b.textContent.replace(' ✓', '') + ' ✓';
        }
    });
}
function announceTambolaWin(kind) {
    const labels = { top: 'TOP LINE', middle: 'MIDDLE LINE', bottom: 'BOTTOM LINE', full: 'FULL HOUSE' };
    const clue = document.getElementById('tambola-clue');
    clue.innerHTML = '<strong style="color: #1B6B4A;">' + labels[kind] + ' &mdash; Bingo!</strong> ' + (kind === 'full' ? 'You have marked every term on your ticket. Game complete in ' + tambolaState.calls + ' calls.' : 'Keep calling for the next line / full house.');
}
function resetTambola() {
    const ticket = buildTambolaTicket();
    const queue = TAMBOLA_POOL.slice();
    for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
    tambolaState = { ticket, queue, called: [], marks: {}, calls: 0, wins: { top: false, middle: false, bottom: false, full: false } };
    document.getElementById('tambola-clue').innerHTML = 'Press <strong>Call next</strong> to begin. The first clue will appear here.';
    document.querySelectorAll('.tambola-win-badge').forEach(b => {
        b.style.background = 'var(--bg-section)'; b.style.color = 'var(--text-3)'; b.style.borderColor = 'var(--border)';
        b.textContent = b.textContent.replace(' ✓', '');
    });
    renderTambolaTicket();
}

// ══════════════════════════════════════════════════════════
// VAYU JUNCTION — Only-Connect / NYT-Connections style word grouper.
// 16 tiles, 4 hidden groups of 4. 4 strikes. Inspired by Torchlight
// at timesofclimatechange.com and built around India AQ vocabulary.
// ══════════════════════════════════════════════════════════
const JUNCTION_PUZZLES = [
    {
        id: 'basics', title: 'Basics', difficulty: 'Easy',
        groups: [
            { theme: 'Particulate fractions', color: '#16A34A', items: ['PM1', 'PM2.5', 'PM10', 'TSP'] },
            { theme: 'Criteria gases (NAAQS)', color: '#3B82F6', items: ['NO2', 'SO2', 'CO', 'O3'] },
            { theme: 'CPCB AQI bands (lower half)', color: '#F59E0B', items: ['Good', 'Satisfactory', 'Moderately Polluted', 'Poor'] },
            { theme: 'Indian air-quality regulators', color: '#7C3AED', items: ['CPCB', 'CAQM', 'MoEFCC', 'DPCC'] }
        ]
    },
    {
        id: 'sources', title: 'Sources, seasons & protection', difficulty: 'Medium',
        groups: [
            { theme: 'PM2.5 combustion sources in India', color: '#16A34A', items: ['Diesel', 'Coal', 'Biomass', 'Crackers'] },
            { theme: 'Smog-season months in N India', color: '#3B82F6', items: ['November', 'December', 'January', 'Diwali'] },
            { theme: 'Delhi GRAP stages', color: '#F59E0B', items: ['GRAP-I', 'GRAP-II', 'GRAP-III', 'GRAP-IV'] },
            { theme: 'Mask & filter terms', color: '#7C3AED', items: ['N95', 'FFP2', 'HEPA', 'CADR'] }
        ]
    },
    {
        id: 'names', title: 'Names & numbers', difficulty: 'Hard',
        groups: [
            { theme: 'Worst-polluted Indian cities (IQAir 2025)', color: '#16A34A', items: ['Loni', 'Byrnihat', 'Delhi', 'Ghaziabad'] },
            { theme: 'NCAP top-improving cities (PM10, FY2024-25 vs 2017-18)', color: '#3B82F6', items: ['Varanasi', 'Bareilly', 'Firozabad', 'Dehradun'] },
            { theme: 'Air-quality research bodies & reports', color: '#F59E0B', items: ['CREA', 'AQLI', 'IQAir', 'Lancet'] },
            { theme: 'Citizen accountability tools', color: '#7C3AED', items: ['Petition', 'RTI', 'Audit', 'Survey'] }
        ]
    },
    {
        id: 'devious', title: 'Devious', difficulty: 'Devious',
        groups: [
            { theme: 'Types of "___ carbon"', color: '#16A34A', items: ['Black', 'Brown', 'Blue', 'Green'] },
            { theme: 'Indian vehicle emission standards', color: '#3B82F6', items: ['BS-II', 'BS-III', 'BS-IV', 'BS-VI'] },
            { theme: 'Citizen-action acronyms', color: '#F59E0B', items: ['PIL', 'RTI', 'FIR', 'NOC'] },
            { theme: 'PM-precursor gases', color: '#7C3AED', items: ['NOx', 'SOx', 'VOC', 'NH3'] }
        ]
    }
];

let junctionState = {
    puzzleIdx: 0,
    selected: [],
    strikes: 0,
    solvedGroups: [],
    items: [],
    won: false,
    lost: false,
};

function junctionShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function loadJunctionPuzzle(idx) {
    junctionState.puzzleIdx = idx;
    junctionState.selected = [];
    junctionState.strikes = 0;
    junctionState.solvedGroups = [];
    junctionState.won = false;
    junctionState.lost = false;
    const puzzle = JUNCTION_PUZZLES[idx];
    const allItems = puzzle.groups.flatMap(g => g.items);
    junctionState.items = junctionShuffle(allItems);
    renderJunctionPicker();
    renderJunctionBoard();
    document.getElementById('junction-puzzle-title').textContent = puzzle.title + ' · ' + puzzle.difficulty;
    document.getElementById('junction-message').innerHTML = 'Tap four tiles that share a hidden connection. The connections are all India air-quality vocabulary.';
}

function renderJunctionPicker() {
    const wrap = document.getElementById('junction-picker');
    if (!wrap) return;
    wrap.innerHTML = '';
    JUNCTION_PUZZLES.forEach((p, i) => {
        const b = document.createElement('button');
        const isActive = i === junctionState.puzzleIdx;
        b.className = 'btn btn-sm';
        b.style.fontSize = '0.72rem';
        if (isActive) {
            b.style.background = 'var(--accent)';
            b.style.color = '#fff';
            b.style.border = '1px solid var(--accent)';
        } else {
            b.style.background = 'var(--bg-section)';
            b.style.color = 'var(--ink)';
            b.style.border = '1px solid var(--border)';
        }
        b.textContent = (i + 1) + '. ' + p.title;
        b.onclick = () => loadJunctionPuzzle(i);
        wrap.appendChild(b);
    });
}

function renderJunctionBoard() {
    const board = document.getElementById('junction-board');
    const solvedStack = document.getElementById('junction-solved-stack');
    const submitBtn = document.getElementById('junction-submit-btn');
    if (!board) return;

    // Solved stack
    solvedStack.innerHTML = '';
    junctionState.solvedGroups.forEach(g => {
        const row = document.createElement('div');
        row.style.cssText = 'padding: 10px 14px; border-radius: 8px; background: ' + g.color + '; color: #fff; font-weight: 600; font-size: 0.85rem; line-height: 1.4;';
        row.innerHTML = '<div style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.06em; opacity:0.85; margin-bottom:2px;">' + g.theme + '</div><div>' + g.items.join(' · ') + '</div>';
        solvedStack.appendChild(row);
    });

    // Board: only unsolved items
    const solvedItems = new Set(junctionState.solvedGroups.flatMap(g => g.items));
    const remaining = junctionState.items.filter(it => !solvedItems.has(it));
    board.innerHTML = '';
    remaining.forEach(it => {
        const tile = document.createElement('button');
        const isSelected = junctionState.selected.includes(it);
        tile.textContent = it;
        tile.dataset.item = it;
        tile.style.cssText = [
            'padding: 14px 6px',
            'min-height: 58px',
            'border-radius: 8px',
            'font-family: var(--sans)',
            'font-size: 0.85rem',
            'font-weight: 600',
            'cursor: pointer',
            'transition: transform 0.1s, background 0.15s',
            'text-align: center',
            'word-break: break-word',
            'line-height: 1.2',
            isSelected
                ? 'background: var(--ink); color: var(--bg-card); border: 2px solid var(--ink);'
                : 'background: var(--bg-section); color: var(--ink); border: 2px solid var(--border);',
        ].join(';');
        tile.onclick = () => toggleJunctionTile(it);
        if (junctionState.lost || junctionState.won) tile.disabled = true;
        board.appendChild(tile);
    });

    // Counter pills
    document.getElementById('junction-strikes').textContent = junctionState.strikes;
    document.getElementById('junction-solved').textContent = junctionState.solvedGroups.length;
    if (submitBtn) {
        submitBtn.textContent = 'Submit (' + junctionState.selected.length + '/4)';
        submitBtn.disabled = junctionState.selected.length !== 4 || junctionState.won || junctionState.lost;
    }
}

function toggleJunctionTile(item) {
    if (junctionState.won || junctionState.lost) return;
    const i = junctionState.selected.indexOf(item);
    if (i >= 0) {
        junctionState.selected.splice(i, 1);
    } else if (junctionState.selected.length < 4) {
        junctionState.selected.push(item);
    }
    renderJunctionBoard();
}

function deselectJunction() {
    junctionState.selected = [];
    renderJunctionBoard();
}

function shuffleJunction() {
    junctionState.items = junctionShuffle(junctionState.items);
    renderJunctionBoard();
}

function submitJunctionGuess() {
    if (junctionState.selected.length !== 4) return;
    const puzzle = JUNCTION_PUZZLES[junctionState.puzzleIdx];
    const guess = new Set(junctionState.selected);
    // Find the group that exactly matches the 4 selected
    let matched = null;
    let bestOverlap = 0;
    for (const g of puzzle.groups) {
        if (junctionState.solvedGroups.find(sg => sg.theme === g.theme)) continue;
        const overlap = g.items.filter(it => guess.has(it)).length;
        if (overlap === 4) { matched = g; break; }
        if (overlap > bestOverlap) bestOverlap = overlap;
    }
    const msg = document.getElementById('junction-message');
    if (matched) {
        junctionState.solvedGroups.push(matched);
        junctionState.selected = [];
        if (junctionState.solvedGroups.length === 4) {
            junctionState.won = true;
            msg.style.borderLeftColor = 'var(--accent)';
            msg.innerHTML = '<strong>You connected all four.</strong> Strikes used: ' + junctionState.strikes + '/4. Try the next puzzle, or pick a harder difficulty above.';
        } else {
            msg.style.borderLeftColor = matched.color;
            msg.innerHTML = '<strong>Locked in:</strong> ' + matched.theme + '. ' + (4 - junctionState.solvedGroups.length) + ' group(s) left.';
        }
    } else {
        junctionState.strikes += 1;
        if (bestOverlap === 3) {
            msg.style.borderLeftColor = '#F59E0B';
            msg.innerHTML = '<strong>So close &mdash; one off.</strong> Three of your four belong together. Swap one. <span style="color:var(--text-3); font-size: 0.78rem;">Strike ' + junctionState.strikes + '/4.</span>';
        } else {
            msg.style.borderLeftColor = '#DC2626';
            msg.innerHTML = '<strong>Not a group.</strong> Try a different angle. <span style="color:var(--text-3); font-size: 0.78rem;">Strike ' + junctionState.strikes + '/4.</span>';
        }
        if (junctionState.strikes >= 4) {
            junctionState.lost = true;
            // Auto-reveal remaining groups
            for (const g of puzzle.groups) {
                if (!junctionState.solvedGroups.find(sg => sg.theme === g.theme)) {
                    junctionState.solvedGroups.push(g);
                }
            }
            msg.style.borderLeftColor = '#DC2626';
            msg.innerHTML = '<strong>Four strikes &mdash; puzzle revealed.</strong> Take a look at the groups above, then hit <em>Next puzzle</em> or pick another difficulty.';
        }
    }
    renderJunctionBoard();
}

function resetJunction() {
    loadJunctionPuzzle(junctionState.puzzleIdx);
}

function nextJunctionPuzzle() {
    const next = (junctionState.puzzleIdx + 1) % JUNCTION_PUZZLES.length;
    loadJunctionPuzzle(next);
}

function revealJunction() {
    const puzzle = JUNCTION_PUZZLES[junctionState.puzzleIdx];
    for (const g of puzzle.groups) {
        if (!junctionState.solvedGroups.find(sg => sg.theme === g.theme)) {
            junctionState.solvedGroups.push(g);
        }
    }
    junctionState.lost = true;
    document.getElementById('junction-message').innerHTML = '<strong>Revealed.</strong> All four groups are shown above. Hit <em>Next puzzle</em> when ready.';
    renderJunctionBoard();
}

// ── Game switcher / panel hookup ──
function switchGame(name) {
    document.querySelectorAll('.game-pane').forEach(p => p.style.display = 'none');
    const target = document.getElementById('game-' + name);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.game-tab-btn').forEach(b => {
        const isActive = b.getAttribute('data-game') === name;
        if (isActive) {
            b.classList.add('btn-primary');
            b.style.cssText = '';
        } else {
            b.classList.remove('btn-primary');
            b.style.cssText = 'background: var(--bg-section); color: var(--ink); border: 1px solid var(--border);';
        }
    });
    if (name === 'jeopardy') renderJeopardyBoard();
    if (name === 'matcher') renderMatcher();
    if (name === 'snakes') renderSnakesLadders();
    if (name === 'jodi') { if (jodiState.cards.length === 0) resetJodi(); else renderJodi(); }
    if (name === 'tambola') { if (tambolaState.ticket.length === 0) resetTambola(); else renderTambolaTicket(); }
    if (name === 'junction') { if (junctionState.items.length === 0) loadJunctionPuzzle(0); else renderJunctionBoard(); }
    if (name === 'quiz') {
        // First-load message stays until user clicks Start; do nothing
    }
}
// Auto-init when the games panel mounts
(function hookGamesPanelInit() {
    if (window.__janvayuGamesHooked) return;
    window.__janvayuGamesHooked = true;
    const origLoad = window.loadPanel;
    if (typeof origLoad === 'function') {
        window.loadPanel = function(panelId) {
            origLoad.apply(this, arguments);
            if (panelId === 'games') {
                setTimeout(() => { try { switchGame('jeopardy'); } catch(e) { console.warn(e); } }, 200);
            }
        };
    }
})();

// ── AIR-LITERACY SELF-CHECK (Workshops panel) ──────────────────────────────
// A standalone 10-question knowledge check, separate from the Games-panel quiz.
// Same render pattern; its own `aqlit-*` element IDs. Facts align with the
// site's verified figures (WHO annual PM2.5 = 5, India NAAQS = 40, etc.).
const AQLIT_QUESTIONS = [
    {
        q: 'What does an AQI number mainly tell you?',
        opts: ['The temperature outside', 'How polluted the air is, on a health-risk scale', 'The chance of rain', 'How many vehicles are on the road'],
        ans: 1,
        why: 'The Air Quality Index converts pollutant concentrations into a single 0-500+ health-risk scale with named bands (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).'
    },
    {
        q: '"PM2.5" refers to particles that are…',
        opts: ['2.5 metres wide', '2.5 millimetres wide', '2.5 micrometres wide or smaller', 'made of exactly 2.5 chemicals'],
        ans: 2,
        why: 'PM2.5 is fine particulate matter 2.5 microns across or smaller — about 1/30th the width of a human hair. That is small enough to reach deep into the lungs and cross into the bloodstream.'
    },
    {
        q: 'The WHO says annual PM2.5 should stay below…',
        opts: ['5 µg/m³', '40 µg/m³', '100 µg/m³', 'There is no guideline'],
        ans: 0,
        why: 'The WHO 2021 Global Air Quality Guideline for annual PM2.5 is 5 µg/m³. Most Indian cities are many times over it.'
    },
    {
        q: 'India’s own national standard (NAAQS) for annual PM2.5 is…',
        opts: ['5 µg/m³', '40 µg/m³', '10 µg/m³', 'the same as the WHO limit'],
        ans: 1,
        why: 'India’s NAAQS annual PM2.5 limit is 40 µg/m³ — eight times the WHO guideline of 5. So "meets Indian standards" is not the same as "safe".'
    },
    {
        q: 'A city’s AQI is reported as a single number. How is it chosen from all the pollutants?',
        opts: ['It is the average of every pollutant', 'It is the worst (highest) sub-index among the pollutants', 'It is always the PM2.5 value', 'It is chosen at random each hour'],
        ans: 1,
        why: 'The overall AQI is the worst of the individual pollutant sub-indices (CPCB uses up to eight: PM2.5, PM10, NO₂, SO₂, CO, O₃, NH₃, Pb). One bad pollutant sets the headline number.'
    },
    {
        q: 'A lot of India’s PM2.5 is "secondary". What does that mean?',
        opts: ['It is less harmful', 'It forms in the air from gases, rather than being emitted directly', 'It only appears at night', 'It comes only from vehicles'],
        ans: 1,
        why: 'About a third of India’s PM2.5 is ammonium sulphate alone (34% nationally, 20-43% across NCAP cities; CREA 2025), formed in the atmosphere from gases like SO₂ and ammonia. That is why dust-only control misses much of the problem.'
    },
    {
        q: 'On a "Severe" AQI day, the most useful thing to do is…',
        opts: ['Go for a long outdoor run to build tolerance', 'Limit outdoor exertion; use an N95/FFP2 mask and a purifier indoors', 'Open all windows to let fresh air in', 'Nothing — masks do not help'],
        ans: 1,
        why: 'On severe days, cut strenuous outdoor activity, keep windows shut, run a purifier if you have one, and wear a well-fitted N95/FFP2 mask outdoors — these do filter fine particles.'
    },
    {
        q: 'Indoor air, compared with outdoor air, is…',
        opts: ['Always cleaner', 'Often just as bad or worse — cooking smoke, no filtration', 'Never a concern', 'Only polluted if you smoke'],
        ans: 1,
        why: 'Indoor PM2.5 tracks outdoor levels and is often worsened by cooking (especially biomass fuels), incense, and closed rooms. Household air pollution is a major health burden in India.'
    },
    {
        q: 'To compare how polluted two cities are over a whole year, the best number is…',
        opts: ['One day’s AQI reading', 'The annual-average PM2.5 concentration', 'The hottest day’s temperature', 'The number of monitoring stations'],
        ans: 1,
        why: 'A single day’s AQI swings with weather. The fair yardstick is the annual-average PM2.5 (µg/m³) — the basis for rankings like IQAir’s and for the WHO/India standards.'
    },
    {
        q: 'Who is generally most vulnerable to air pollution?',
        opts: ['Only the elderly', 'Children, pregnant women, the elderly, and people with heart or lung conditions', 'Only outdoor workers', 'Everyone equally, with no differences'],
        ans: 1,
        why: 'Children (developing lungs, higher breathing rate), pregnant women, older adults, and people with existing heart or lung disease face the highest risk — though sustained exposure harms everyone.'
    }
];
let aqlitState = { i: 0, score: 0, answered: false };
function startAqLit() {
    aqlitState = { i: 0, score: 0, answered: false };
    var t = document.getElementById('aqlit-q-total');
    if (t) t.textContent = AQLIT_QUESTIONS.length;
    renderAqLit();
}
function renderAqLit() {
    var body = document.getElementById('aqlit-card-body');
    if (!body) return;
    if (aqlitState.i >= AQLIT_QUESTIONS.length) {
        var pct = Math.round(aqlitState.score / AQLIT_QUESTIONS.length * 100);
        var verdict = pct >= 90 ? 'Air-literate. You could teach this.' : pct >= 70 ? 'Strong — you know the essentials.' : pct >= 50 ? 'A useful baseline. Keep exploring the site.' : 'A workshop would help — and that’s exactly what this page is for.';
        body.innerHTML = '<h3 style="font-family: var(--serif); margin: 0 0 8px;">Self-check complete</h3>' +
            '<div style="font-size: 1.4rem; font-weight: 700; color: var(--accent); margin-bottom: 6px;">' + aqlitState.score + ' / ' + AQLIT_QUESTIONS.length + '  (' + pct + '%)</div>' +
            '<div style="font-size: 0.9rem; color: var(--text-2); margin-bottom: 14px;">' + verdict + '</div>' +
            '<button type="button" class="btn btn-primary" onclick="startAqLit()">Try again</button>';
        var n = document.getElementById('aqlit-q-num');
        if (n) n.textContent = AQLIT_QUESTIONS.length;
        return;
    }
    var Q = AQLIT_QUESTIONS[aqlitState.i];
    var qn = document.getElementById('aqlit-q-num');
    if (qn) qn.textContent = aqlitState.i + 1;
    var sc = document.getElementById('aqlit-score');
    if (sc) sc.textContent = aqlitState.score;
    aqlitState.answered = false;
    var html = '<div style="font-family: var(--serif); font-size: 1.15rem; line-height: 1.4; margin-bottom: 14px;">' + Q.q + '</div>';
    html += '<div style="display: flex; flex-direction: column; gap: 8px;">';
    Q.opts.forEach(function (opt, i) {
        html += '<button type="button" class="quiz-opt-btn" onclick="answerAqLit(' + i + ')" data-i="' + i + '" style="text-align: left; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-section); color: var(--ink); font-size: 0.9rem; cursor: pointer;">' + String.fromCharCode(65 + i) + '. ' + opt + '</button>';
    });
    html += '</div><div id="aqlit-feedback" style="margin-top: 14px;"></div>';
    body.innerHTML = html;
}
function answerAqLit(i) {
    if (aqlitState.answered) return;
    aqlitState.answered = true;
    var Q = AQLIT_QUESTIONS[aqlitState.i];
    var correct = i === Q.ans;
    if (correct) aqlitState.score += 1;
    document.querySelectorAll('#aqlit-card-body .quiz-opt-btn').forEach(function (btn) {
        var idx = parseInt(btn.getAttribute('data-i'));
        btn.style.cursor = 'default';
        if (idx === Q.ans) { btn.style.background = '#DCFCE7'; btn.style.borderColor = '#86EFAC'; btn.style.color = '#166534'; btn.style.fontWeight = '700'; }
        else if (idx === i) { btn.style.background = '#FEE2E2'; btn.style.borderColor = '#FCA5A5'; btn.style.color = '#991B1B'; }
        else { btn.style.opacity = '0.6'; }
    });
    var fb = document.getElementById('aqlit-feedback');
    if (fb) fb.innerHTML = '<div style="padding: 12px; border-radius: 8px; background: var(--bg-section); border-left: 3px solid ' + (correct ? '#22C55E' : '#EF4444') + ';">' +
        '<div style="font-weight: 700; margin-bottom: 6px; color: ' + (correct ? '#166534' : '#991B1B') + ';">' + (correct ? 'Correct.' : 'Not quite.') + '</div>' +
        '<div style="font-size: 0.85rem; color: var(--text-2); line-height: 1.55;">' + Q.why + '</div>' +
        '<button type="button" class="btn btn-primary mt-2" onclick="nextAqLit()">' + (aqlitState.i + 1 === AQLIT_QUESTIONS.length ? 'See results' : 'Next question') + '</button></div>';
    var sc = document.getElementById('aqlit-score');
    if (sc) sc.textContent = aqlitState.score;
}
function nextAqLit() { aqlitState.i += 1; renderAqLit(); }
