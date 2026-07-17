// ═══════════════════════════════════════════════════════════
// LEARNING GAMES — Jeopardy, Quiz, Source Matcher, Snakes & Ladders, Jodi Match, Air Tambola
// All questions and content are original, written for JanVayu.
// The Jeopardy format is inspired by the long-running classroom
// game run by Dr. Sarath Guttikunda at UrbanEmissions.info.
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
        { v: 1000, clue: "This source contributes the largest share of household PM2.5 in rural India, despite the LPG push under PMUY.", q: "What is solid biomass cooking (chulha / firewood / dung)?", why: "CEEW 2024: residential biomass cooking is still the single largest PM2.5 source category nationally. PMUY raised LPG access but refill rates lag." },
        { v: 2000, clue: "Punjab and Haryana farmers burn this between October and November because the kharif harvest leaves a 2-3 week window before the rabi sowing.", q: "What is paddy stubble (rice straw)?", why: "The MSW-Hortic field-fire window peaks late Oct to mid-Nov, contributing 25-40% of Delhi PM2.5 on bad days per SAFAR." },
        { v: 3000, clue: "Around half of India's coal-fired thermal capacity still misses this 2015 emission norm originally given a 2017 deadline.", q: "What are FGD (flue-gas desulphurisation) units?", why: "MoEFCC has extended the FGD deadline four times. As of 2025, only ~22 GW of ~210 GW had FGDs installed; SO2 from coal plants oxidises into secondary sulphate PM2.5." },
        { v: 4000, clue: "This often-overlooked transport source &mdash; tyres, brakes and resuspended road dust &mdash; can match or exceed tailpipe PM2.5 in dense Indian cities.", q: "What are non-exhaust emissions?", why: "TERI's 2023 source apportionment study for Delhi quantified road dust and non-exhaust contributions at 30-40% of urban PM2.5, often more than tailpipes. EVs do not solve this." },
        { v: 5000, clue: "This invisible gas, emitted heavily by power plants and industry, reacts in the atmosphere with ammonia from agriculture to form a major chunk of winter PM2.5.", q: "What is sulphur dioxide (SO2) &mdash; forming secondary sulphate aerosol?", why: "Secondary inorganic aerosol (sulphate + nitrate + ammonium) accounts for 25-40% of wintertime PM2.5 in the Indo-Gangetic Plain. Cutting it requires SO2/NOx controls plus ammonia controls in agriculture." }
    ],
    'HEALTH': [
        { v: 1000, clue: "At Delhi's typical winter PM2.5 of around 100 ug/m3, this is roughly how many of these per day a non-smoker is passively inhaling.", q: "What is about 4-5 cigarettes a day?", why: "Berkeley Earth coefficient: 1 cigarette ~ 22 ug/m3 of PM2.5 over 24 hours. JanVayu's dashboard shows this live." },
        { v: 2000, clue: "The 2025 Lancet Countdown attributes this many Indian deaths per year to ambient PM2.5 exposure.", q: "What is approximately 1.7 million?", why: "Lancet Countdown 2025: India accounts for ~70% of the global PM2.5 mortality burden. The number was 1.5M in 2024 and rose with re-attribution." },
        { v: 3000, clue: "AQLI 2025 says the average Indian loses this many years of life expectancy due to particulate pollution exceeding WHO guidelines.", q: "What is 3.5 years?", why: "Indo-Gangetic Plain residents lose 7-8 years; nationally the average is 3.5 years. AQLI uses the Pope-Ebenstein-Greenstone causal exposure-response function." },
        { v: 4000, clue: "These ultrafine particles, smaller than the diameter of a single PM2.5, can cross the blood-brain barrier and have been linked to dementia and stroke.", q: "What is PM0.1 / ultrafine particulate matter?", why: "UFPs (<100 nm) are not regulated by NAAQS or even WHO yet, but 2024 research from Karolinska and Harvard's MAPLE-MIA studies has documented neuro and cardiovascular pathways." },
        { v: 5000, clue: "A landmark 2024 Indian study found that for every 10 ug/m3 increase in long-term PM2.5, all-cause mortality rose by approximately this much &mdash; the first nationwide causal estimate from Indian data.", q: "What is about 8.6%?", why: "Lancet Planetary Health 2024 (Jaganathan et al.) applied a difference-in-differences design across 655 districts (2009-2019) and produced India's first nationwide causal dose-response. Earlier estimates relied on extrapolated Western cohorts." }
    ],
    'POLICY': [
        { v: 1000, clue: "Launched in 2019, this national programme set a 20-30% PM reduction target by 2024, then revised it to 40% by 2025-26.", q: "What is the National Clean Air Programme (NCAP)?", why: "NCAP covers 131 non-attainment cities. As of 2025, only ~37 cities had achieved the original 20% target, prompting a finish-line slip and a target revision." },
        { v: 2000, clue: "Delhi's stage-based emergency action plan, with bans on construction, BS-III/IV vehicles and diesel gensets at successive stages.", q: "What is GRAP (Graded Response Action Plan)?", why: "GRAP has 4 stages keyed to AQI 201, 301, 401, 451. CAQM operationalises it. Critics note the reactive, not preventive, nature." },
        { v: 3000, clue: "Created by an act of Parliament in 2021, this body replaced EPCA and has statutory power across the entire NCR.", q: "What is the Commission for Air Quality Management (CAQM)?", why: "CAQM in NCR and Adjoining Areas Act 2021. Its directions on stubble, vehicles, industry are legally binding; non-compliance can attract penalties under section 14." },
        { v: 4000, clue: "In M. C. Mehta v. Union of India (1985, ongoing), the Supreme Court ordered Delhi to switch this fleet to a cleaner fuel by 2002.", q: "What is the public bus and auto-rickshaw fleet (to CNG)?", why: "The CNG conversion remains India's most cited air-pollution litigation success. PM2.5 fell measurably until growth in private vehicles overwhelmed gains." },
        { v: 5000, clue: "India's PM2.5 annual standard is 40 ug/m3 &mdash; this many times the current WHO guideline.", q: "What is 8 times (the WHO guideline of 5 ug/m3)?", why: "WHO tightened from 10 to 5 ug/m3 in 2021. India's CPCB has not revised NAAQS since 2009. Civil society petitions to the NGT seek alignment." }
    ],
    'CITIES': [
        { v: 1000, clue: "Per IQAir 2025, this Indian city was named the most polluted capital in the world.", q: "What is New Delhi?", why: "IQAir World Air Quality Report 2025 (covering calendar 2024): New Delhi annual PM2.5 of 91.6 ug/m3. Eighth straight year as the worst capital." },
        { v: 2000, clue: "This Uttar Pradesh town topped the IQAir 2025 list of the world's most polluted cities, edging out Byrnihat.", q: "What is Loni?", why: "Loni (Ghaziabad district) recorded 112.5 ug/m3 in 2024. It dethroned Byrnihat, Meghalaya, which had held the title in IQAir 2024." },
        { v: 3000, clue: "The 2024 IIT-Delhi DSS source apportionment found this state contributed nearly half of Delhi's PM2.5 on bad days, even before stubble burns started.", q: "What are the surrounding NCR districts of Haryana and UP?", why: "Trans-boundary transport from a 100-300 km radius accounts for 35-50% of Delhi PM2.5 even outside the stubble window. Local sources alone cannot fix the basin." },
        { v: 4000, clue: "Bengaluru's PM2.5 is far below Delhi's, but this fast-growing pollutant from its IT-fuelled construction boom has been rising sharply.", q: "What is PM10 (and dust from construction)?", why: "Bengaluru BBMP construction permits doubled 2018-2024. CPCB data shows PM10 violations of NAAQS on >40% of days, even as PM2.5 stays moderate." },
        { v: 5000, clue: "Located on the Brahmaputra plain, this northeastern hub has held the title of most-polluted city in the world in 2 of the last 3 IQAir reports despite its sparse industry.", q: "What is Byrnihat (on the Assam-Meghalaya border)?", why: "Byrnihat's spike is driven by ferroalloy smelters in a narrow valley with poor dispersion. Demonstrates that local-scale industrial sources can outpace mega-city averages." }
    ],
    'ACTION': [
        { v: 1000, clue: "This three-letter Indian legal instrument, costing Rs 10 to file, lets any citizen demand pollution data from a public authority within 30 days.", q: "What is RTI (Right to Information)?", why: "RTI Act 2005. JanVayu's RTI Assistant generates ready-to-file templates targeting NCAP fund utilisation, GRAP compliance, and CAAQMS station downtime." },
        { v: 2000, clue: "The minimum mask grade that filters out at least 95% of PM2.5 when fitted properly.", q: "What is N95 (or FFP2/KN95 equivalents)?", why: "Cloth and surgical masks block 20-40% of PM2.5. N95/FFP2 fit-tested filtration is >95%. P100/N99 reach 99%+ but are over-spec for most outdoor exposure." },
        { v: 3000, clue: "For a 200 sq ft Indian living room, you need a HEPA purifier with at least roughly this CADR to hit AQI 50 indoors when outdoor AQI is 250.", q: "What is around 200-250 m3/h CADR?", why: "Rule of thumb: CADR (m3/h) >= room area (sq ft) x ceiling (ft) / 2. JanVayu's Purifier Calculator does the live computation per city AQI." },
        { v: 4000, clue: "Filed by a citizen in 2017, this Supreme Court PIL led to the firecracker ban during Diwali in NCR.", q: "What is Arjun Gopal v. Union of India?", why: "WP(C) 728/2015 / IA 277477/2017. The court banned barium-based crackers and capped Diwali sales hours; enforcement remains patchy." },
        { v: 5000, clue: "This is the single most under-used citizen action documented by JanVayu &mdash; only ~3% of Indian municipal NCAP plans had a citizen comment on file as of 2025.", q: "What is filing public comments on draft City Action Plans?", why: "NCAP requires public consultation but most cities upload PDFs after the consultation window closes. JanVayu's Citizen Action panel provides templates and the SPCB email list." }
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
        h.style.cssText = 'background: var(--accent); color: white; font-weight: 700; padding: 14px 8px; text-align: center; border-radius: 8px; font-size: 0.78rem; letter-spacing: 0.04em; text-transform: uppercase;';
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
        q: "Per Lancet Countdown 2025, India's annual PM2.5 mortality is approximately:",
        opts: ["170,000", "700,000", "1.7 million", "5 million"],
        ans: 2,
        why: "About 1.72 million Indian deaths per year are attributable to ambient PM2.5 — ~70% of the global total."
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
        why: "Stage IV = 'Severe-plus', AQI > 450. Triggers a construction halt, BS-III/IV diesel ban, and possible school closure."
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
        why: "NCAP launched 2019. Targets 131 non-attainment cities with funds tied to PM reduction milestones."
    },
    {
        q: "Berkeley Earth's cigarette equivalence is roughly 1 cigarette per:",
        opts: ["1 ug/m3 PM2.5/day", "5 ug/m3 PM2.5/day", "22 ug/m3 PM2.5/day", "100 ug/m3 PM2.5/day"],
        ans: 2,
        why: "1 cigarette ~ 22 ug/m3 PM2.5 over 24 hours. At Delhi's 100 ug/m3 winter PM2.5 = ~4.5 cigarettes/day passively."
    },
    {
        q: "Which agency physically operates India's CAAQMS (continuous monitoring) stations?",
        opts: ["WHO", "MoEFCC directly", "CPCB and State Pollution Control Boards", "IQAir"],
        ans: 2,
        why: "CPCB sets standards; State PCBs operate most CAAQMS sites. WAQI/IQAir aggregate from these official feeds."
    },
    {
        q: "Per the IQAir 2025 report, the most polluted city in the world (calendar 2024) was:",
        opts: ["New Delhi, India", "Lahore, Pakistan", "Loni, India", "Byrnihat, India"],
        ans: 2,
        why: "Loni (Ghaziabad, UP): 112.5 ug/m3 annual PM2.5. Byrnihat dropped to #2 from #1 in IQAir 2024."
    },
    {
        q: "Which is NOT a major source of PM2.5 in Indian winter?",
        opts: [
            "Stubble burning in Punjab/Haryana",
            "Coal-fired power plants",
            "Solar PV manufacturing",
            "Residential biomass cooking"
        ],
        ans: 2,
        why: "Solar PV manufacturing has localised emissions but is not a top-10 PM2.5 source nationally. The other three are routinely in the top 5."
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
    { src: 'Stubble burning', desc: 'Punjab + Haryana paddy residue, peaks Oct-Nov, 2-3 week tight window before rabi sowing.' },
    { src: 'Residential biomass', desc: 'Cooking on chulhas with firewood / dung; still the largest household PM2.5 source despite PMUY.' },
    { src: 'Coal thermal power', desc: 'SO2 and NOx that oxidise into secondary sulphate / nitrate aerosol; ~half of capacity still without FGD in 2025.' },
    { src: 'Road dust + non-exhaust', desc: 'Tyre and brake wear plus resuspended dust; can match tailpipe PM2.5 in dense Indian cities.' },
    { src: 'Brick kilns', desc: 'Seasonal December-May firing across Indo-Gangetic Plain; converting to zigzag tech cuts PM by ~60%.' },
    { src: 'Diesel gensets', desc: 'Backup power in commercial buildings and apartments during outages; banned at GRAP stages II-IV.' },
    { src: 'Open waste burning', desc: 'Municipal solid waste lit at night at landfills and street corners; under-reported in official inventories.' }
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
    3:  { to: 11, msg: 'Ladder &mdash; you swapped to LPG and stopped using a chulha for cooking. Indoor PM2.5 drops 80%.' },
    7:  { to: 17, msg: 'Ladder &mdash; you fit-tested an N95 mask. Outdoor exposure drops 95% on bad days.' },
    14: { to: 24, msg: 'Ladder &mdash; you filed an RTI on NCAP fund utilisation. The data becomes public in 30 days.' },
    21: { to: 30, msg: 'Ladder &mdash; you submitted a public comment on your city\'s draft Action Plan. Only ~3% of citizens do.' },
    27: { to: 35, msg: 'Ladder &mdash; you joined your RWA\'s pollution committee. Local construction now follows dust rules.' }
};
const SL_SNAKES = {
    10: { to: 2,  msg: 'Snake &mdash; Diwali fireworks. PM2.5 spikes 4&times; in a single night across NCR.' },
    18: { to: 6,  msg: 'Snake &mdash; coal plants miss the FGD deadline. Again. Secondary sulphate aerosol stays high.' },
    25: { to: 13, msg: 'Snake &mdash; stubble-burn peak. Punjab fires push Delhi PM2.5 past 500 µg/m³ for the week.' },
    32: { to: 19, msg: 'Snake &mdash; GRAP-IV triggered. Schools shut, BS-III/IV diesel banned. The reactive cycle resets.' },
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
    { pairId: 1, a: 'PM2.5',           b: 'Cooking smoke (chulha biomass)' },
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
    { term: 'Byrnihat',  clue: 'Assam-Meghalaya border town, #1 most polluted in IQAir 2024, dropped to #2 in 2025.' },
    { term: 'Chulha',    clue: 'Traditional biomass cookstove — largest household PM2.5 source in rural India.' },
    { term: 'Stubble',   clue: 'Paddy crop residue burned in Punjab/Haryana between October and November.' },
    { term: 'FGD',       clue: 'Coal-plant flue-gas desulphurisation tech — half of capacity still missing it.' },
    { term: 'N95',       clue: 'Mask grade that filters ≥95% of PM2.5 when fitted properly.' },
    { term: 'HEPA',      clue: 'Filter standard inside indoor air purifiers; full name "high-efficiency particulate air".' },
    { term: 'PMUY',      clue: 'Government scheme that distributed LPG connections to BPL households.' },
    { term: 'BS-VI',     clue: 'India\'s current vehicle emission standard, mandatory since 2020.' },
    { term: 'Diwali',    clue: 'Autumn Indian festival whose firecrackers spike NCR PM2.5 4× in one night.' },
    { term: 'Lancet 1.72M', clue: 'Lancet Countdown 2025 figure for annual Indian PM2.5 deaths.' },
    { term: 'RTI',       clue: 'Citizens\' three-letter legal tool for getting air-quality data from public bodies.' },
    { term: 'Ozone (O₃)', clue: 'Summertime secondary pollutant formed when NOx reacts with sunlight.' },
    { term: 'NOx',       clue: 'Vehicle and power-plant exhaust gas; precursor to nitrate aerosol.' },
    { term: 'SO₂',       clue: 'Coal-plant emission that oxidises to secondary sulphate PM2.5.' },
    { term: 'Black Carbon', clue: 'Soot from incomplete combustion; second-largest climate-warming agent after CO₂.' },
    { term: 'Brick Kiln', clue: 'Indo-Gangetic Plain seasonal Dec-May source; zigzag tech cuts PM ~60%.' }
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
            { theme: 'CPCB AQI bands (lower half)', color: '#F59E0B', items: ['Good', 'Satisfactory', 'Moderate', 'Poor'] },
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
            { theme: 'Worst-polluted Indian cities (IQAir 2025)', color: '#16A34A', items: ['Loni', 'Byrnihat', 'Begusarai', 'Hajipur'] },
            { theme: 'NCAP top-performing cities', color: '#3B82F6', items: ['Varanasi', 'Bareilly', 'Moradabad', 'Kanpur'] },
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
        why: 'Up to ~42% of India’s PM2.5 is secondary — formed in the atmosphere from gases like SO₂ and NOₓ (e.g. ammonium sulphate). That is why dust-only control misses much of the problem.'
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
