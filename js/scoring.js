// Pure scoring & analysis logic — no DOM access, so it can be unit-tested in Node.
// Sources: IELTS official score guidance (ielts.org) – overall band rounding rule and
// the published raw-score / band equivalences for Listening and Reading. The full
// conversion tables vary slightly between test versions; the tables below are the
// widely used approximations consistent with the official anchor points
// (Listening & Academic Reading: 16→5, 23→6, 30→7, 35→8; GT Reading: 15→4, 23→5, 30→6, 34→7, 38→8).

/** [minRaw, band] pairs, sorted by minRaw descending. */
export const CONVERSION = {
  listening: [
    [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5],
    [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1], [0, 0],
  ],
  academicReading: [
    [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5],
    [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1], [0, 0],
  ],
  generalReading: [
    [40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5],
    [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [4, 2], [2, 1.5], [1, 1], [0, 0],
  ],
};

/**
 * Convert a raw score (out of 40) to a band. For tests shorter than 40 questions
 * (e.g. a single section) the raw score is scaled to 40 first, and the result is an
 * estimate only.
 */
export function rawToBand(raw, table, total = 40) {
  const rows = CONVERSION[table];
  if (!rows) throw new Error(`Unknown conversion table: ${table}`);
  if (!Number.isFinite(raw) || raw < 0) return 0;
  const scaled = total === 40 ? raw : Math.round((raw / total) * 40);
  const capped = Math.min(40, scaled);
  for (const [min, band] of rows) if (capped >= min) return band;
  return 0;
}

/**
 * Overall band = mean of the four skills rounded to the nearest half band.
 * Official rule: an average ending in .25 rounds up to .5, .75 rounds up to the
 * next whole band; anything below those points rounds down.
 */
export function overallBand(l, r, w, s) {
  const parts = [l, r, w, s];
  if (parts.some((x) => !Number.isFinite(x) || x < 0 || x > 9 || (x * 2) % 1 !== 0)) {
    throw new RangeError('Each skill band must be 0–9 in half-band steps');
  }
  const avg = (l + r + w + s) / 4; // multiples of 0.125 → exact in binary floating point
  return Math.floor(avg * 2 + 0.5) / 2;
}

/** Round down to the nearest half band (conservative estimate for self-assessment). */
export function floorHalf(x) {
  return Math.floor(x * 2 + 1e-9) / 2;
}

/**
 * Writing estimate: each task band = mean of its four criteria; Task 2 carries
 * twice the weight of Task 1. IELTS does not publish its exact internal rounding,
 * so we report a conservative estimate (rounded down to the nearest half band).
 */
export function writingBand(task1Criteria, task2Criteria) {
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const t1 = task1Criteria ? mean(task1Criteria) : null;
  const t2 = task2Criteria ? mean(task2Criteria) : null;
  if (t1 == null && t2 == null) return null;
  if (t1 == null) return floorHalf(t2);
  if (t2 == null) return floorHalf(t1);
  return floorHalf((t1 + 2 * t2) / 3);
}

export function criteriaBand(criteria) {
  if (!criteria || !criteria.length) return null;
  return floorHalf(criteria.reduce((s, x) => s + x, 0) / criteria.length);
}

/* ------------------------------------------------------------------ */
/* Answer checking for completion-type questions                       */
/* ------------------------------------------------------------------ */

export function normalizeAnswer(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”"]/g, '')
    .replace(/\s*-\s*/g, '-')
    .replace(/[.,;:!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const NUMBER_TOKEN = /^[£$€]?\d[\d,.:/]*(%|am|pm|st|nd|rd|th)?$/i;

/**
 * Count words and numbers in an answer the way IELTS instructions do:
 * a hyphenated word is one word; a token made of digits is a "number".
 */
export function countAnswerTokens(s) {
  const tokens = normalizeAnswer(s).split(' ').filter(Boolean);
  let words = 0;
  let numbers = 0;
  for (const t of tokens) (NUMBER_TOKEN.test(t) ? numbers++ : words++);
  return { words, numbers };
}

/**
 * limit: { words: n, number: boolean }  e.g. "NO MORE THAN TWO WORDS AND/OR A NUMBER"
 * → { words: 2, number: true }. "ONE WORD ONLY" → { words: 1, number: false }.
 * "A NUMBER" → { words: 0, number: true }.
 */
export function withinLimit(answer, limit) {
  if (!limit) return true;
  const { words, numbers } = countAnswerTokens(answer);
  const maxNumbers = limit.number ? 1 : 0;
  // Extra numbers beyond the allowed one are counted as words.
  const extra = Math.max(0, numbers - maxNumbers);
  return words + extra <= limit.words;
}

/**
 * Check a typed answer. `accepted` is a list of acceptable answers (all variants,
 * including British/American spellings where both are acceptable). Answers that
 * exceed the word limit are marked wrong, as in the real test.
 */
export function checkTyped(answer, accepted, limit) {
  const a = normalizeAnswer(answer);
  if (!a) return false;
  if (!withinLimit(a, limit)) return false;
  const variants = accepted.map(normalizeAnswer);
  if (variants.includes(a)) return true;
  // numbers: ignore thousands separators and trailing ".00"
  const num = (x) => x.replace(/,/g, '').replace(/\.00$/, '');
  return variants.some((v) => num(v) === num(a));
}

/** Score one question object against a user response. */
export function scoreQuestion(q, response) {
  switch (q.type) {
    case 'tfng':
    case 'ynng':
    case 'mcq':
    case 'match':
      return response != null && String(response) === String(q.answer);
    case 'mcq-multi': {
      // Each correct letter scores one mark (the question object represents one mark).
      return response != null && String(response) === String(q.answer);
    }
    case 'gap':
      return checkTyped(response, q.answer, q.limit);
    default:
      throw new Error(`Unknown question type ${q.type}`);
  }
}

/* ------------------------------------------------------------------ */
/* Writing text analysis (indicators only — NOT an official band)      */
/* ------------------------------------------------------------------ */

/** IELTS counts every word, including numbers and words like "a"/"the". */
export function wordCount(text) {
  const m = String(text || '').trim().match(/[A-Za-z0-9À-ɏ]+(?:['’\-][A-Za-z0-9À-ɏ]+)*/g);
  return m ? m.length : 0;
}

export function splitSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((s) => s.trim())
    .filter((s) => wordCount(s) > 0);
}

export const LINKERS = {
  addition: ['furthermore', 'moreover', 'in addition', 'additionally', 'also', 'besides'],
  contrast: ['however', 'nevertheless', 'nonetheless', 'whereas', 'while', 'although', 'even though', 'on the other hand', 'by contrast', 'in contrast', 'conversely', 'despite', 'in spite of', 'yet'],
  cause: ['because', 'since', 'as a result', 'therefore', 'consequently', 'thus', 'hence', 'due to', 'owing to', 'this means that', 'leading to'],
  example: ['for example', 'for instance', 'such as', 'namely', 'to illustrate'],
  sequence: ['firstly', 'secondly', 'finally', 'first', 'second', 'then', 'subsequently', 'after that', 'meanwhile'],
  conclusion: ['in conclusion', 'to conclude', 'to sum up', 'overall', 'in summary', 'on balance'],
  opinion: ['in my view', 'in my opinion', 'i believe', 'i would argue', 'i agree', 'i disagree', 'from my perspective', 'i am convinced'],
};

const STOPWORDS = new Set(('a an the and or but if of to in on at by for with from as is are was were be been being it its this that these those there their they them he she his her we our you your i my me not no do does did have has had can could will would should may might must so than then also more most such very into about over under between which who whom whose what when where why how all any each other some many much few one two three').split(' '));

const CONTRACTION = /\b\w+(n't|'re|'ve|'ll|'d|'m)\b|\b(it's|that's|there's|what's|let's)\b/gi;

function countPhrase(lower, phrase) {
  const re = new RegExp(`(^|[^a-z])${phrase.replace(/ /g, '\\s+')}(?=[^a-z]|$)`, 'g');
  return (lower.match(re) || []).length;
}

export function analyzeWriting(text, { task = 2, module = 'academic' } = {}) {
  const raw = String(text || '');
  const words = wordCount(raw);
  const paragraphs = raw.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  const sentences = splitSentences(raw);
  const sentLens = sentences.map(wordCount);
  const avgSentence = sentLens.length ? sentLens.reduce((a, b) => a + b, 0) / sentLens.length : 0;
  const sd = sentLens.length
    ? Math.sqrt(sentLens.reduce((s, x) => s + (x - avgSentence) ** 2, 0) / sentLens.length)
    : 0;

  const lower = raw.toLowerCase();
  const tokens = lower.match(/[a-z]+(?:'[a-z]+)?/g) || [];
  const content = tokens.filter((t) => !STOPWORDS.has(t) && t.length > 2);

  // Moving-average type/token ratio over a 50-word window (stable across text lengths)
  const W = 50;
  let mattr = 0;
  if (tokens.length >= W) {
    let sum = 0;
    let n = 0;
    for (let i = 0; i + W <= tokens.length; i++) {
      sum += new Set(tokens.slice(i, i + W)).size / W;
      n++;
    }
    mattr = sum / n;
  } else if (tokens.length) {
    mattr = new Set(tokens).size / tokens.length;
  }

  const freq = {};
  for (const t of content) freq[t] = (freq[t] || 0) + 1;
  const repeated = Object.entries(freq)
    .filter(([, c]) => c >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const linkers = {};
  let linkerTotal = 0;
  for (const [cat, list] of Object.entries(LINKERS)) {
    for (const p of list) {
      const c = countPhrase(lower, p);
      if (c) {
        linkers[p] = { count: c, cat };
        linkerTotal += c;
      }
    }
  }
  const overusedLinkers = Object.entries(linkers).filter(([, v]) => v.count >= 3).map(([k]) => k);
  const contractions = (raw.match(CONTRACTION) || []).length;

  const min = task === 1 ? 150 : 250;
  const warnings = [];
  const tips = [];

  if (words < min) warnings.push(`Bài viết có ${words} từ, dưới mức tối thiểu ${min} từ — giám khảo sẽ trừ điểm Task ${task === 1 ? 'Achievement' : 'Response'}.`);
  if (task === 2 && paragraphs.length < 4) warnings.push('Task 2 nên có tối thiểu 4 đoạn (mở bài – 2 thân bài – kết luận). Chia đoạn kém ảnh hưởng tiêu chí Coherence & Cohesion.');
  if (task === 1 && paragraphs.length < 3) warnings.push('Task 1 nên chia ít nhất 3 đoạn (giới thiệu/overview – các đoạn chi tiết).');
  if (task === 1 && module === 'academic' && !/\b(overall|in general|generally|it is clear|it is evident|in summary)\b/i.test(raw)) {
    warnings.push('Không phát hiện câu Overview (vd: "Overall, ..."). Thiếu overview rõ ràng giới hạn Task Achievement ở band 5 theo band descriptors.');
  }
  if (task === 2 && !/\b(i (strongly |firmly |partly |largely )?(believe|think|agree|disagree|would argue|feel)|in my (view|opinion)|from my perspective|this essay (will )?(argue|argues|contend)|i am convinced)\b/i.test(raw)) {
    tips.push('Chưa thấy câu nêu quan điểm rõ ràng. Với đề hỏi ý kiến (agree/disagree, discuss + give your opinion), quan điểm phải rõ và nhất quán xuyên suốt bài.');
  }
  if ((module === 'academic' || task === 2) && contractions > 0) tips.push(`Có ${contractions} dạng viết tắt (don't, it's...). Văn phong học thuật nên viết đầy đủ (do not, it is).`);
  if (overusedLinkers.length) tips.push(`Lạm dụng từ nối: ${overusedLinkers.join(', ')}. Band descriptors đánh giá thấp việc dùng cohesive devices "mechanical/overused".`);
  if (repeated.length) tips.push(`Từ lặp nhiều: ${repeated.slice(0, 5).map(([w, c]) => `${w} (${c})`).join(', ')}. Cân nhắc paraphrase/đồng nghĩa để tăng Lexical Resource.`);
  if (avgSentence > 30) tips.push('Câu trung bình quá dài (>30 từ) — dễ gây lỗi ngữ pháp và khó đọc.');
  if (sentLens.length >= 5 && sd < 4) tips.push('Độ dài câu khá đồng đều — kết hợp câu đơn, câu ghép và câu phức để thể hiện Grammatical Range.');
  if (words > min * 1.8) tips.push('Bài khá dài. Viết dài không được cộng điểm và làm tăng nguy cơ lỗi + thiếu thời gian.');

  return {
    words,
    min,
    paragraphs: paragraphs.length,
    sentences: sentences.length,
    avgSentence: Math.round(avgSentence * 10) / 10,
    sentenceSd: Math.round(sd * 10) / 10,
    mattr: Math.round(mattr * 100) / 100,
    linkers,
    linkerTotal,
    linkerCategories: new Set(Object.values(linkers).map((v) => v.cat)).size,
    contractions,
    repeated,
    warnings,
    tips,
  };
}

/* ------------------------------------------------------------------ */
/* Speaking fluency indicators from a transcript                        */
/* ------------------------------------------------------------------ */

const FILLERS = ['um', 'uh', 'er', 'erm', 'ah', 'like', 'you know', 'i mean', 'sort of', 'kind of', 'actually', 'basically'];

export function analyzeSpeech(transcript, seconds) {
  const lower = String(transcript || '').toLowerCase();
  const words = wordCount(lower);
  const wpm = seconds > 0 ? Math.round((words / seconds) * 60) : 0;
  const fillers = {};
  let fillerTotal = 0;
  for (const f of FILLERS) {
    const c = countPhrase(lower, f);
    if (c) {
      fillers[f] = c;
      fillerTotal += c;
    }
  }
  const tokens = lower.match(/[a-z']+/g) || [];
  const ttr = tokens.length ? new Set(tokens).size / tokens.length : 0;
  return { words, wpm, fillers, fillerTotal, fillerRate: words ? fillerTotal / words : 0, ttr: Math.round(ttr * 100) / 100 };
}

/* ------------------------------------------------------------------ */
/* Spaced repetition (SM-2 variant)                                     */
/* ------------------------------------------------------------------ */

const DAY = 86400000;

/** grade: 0 = again, 3 = hard, 4 = good, 5 = easy */
export function srsReview(card, grade, now = Date.now()) {
  const c = { ef: 2.5, reps: 0, interval: 0, ...card };
  if (grade < 3) {
    c.reps = 0;
    c.interval = 0; // relearn today (10 minutes)
    c.due = now + 10 * 60 * 1000;
  } else {
    c.reps += 1;
    if (c.reps === 1) c.interval = grade === 5 ? 3 : 1;
    else if (c.reps === 2) c.interval = grade === 5 ? 8 : 6;
    else c.interval = Math.round(c.interval * c.ef * (grade === 3 ? 0.8 : grade === 5 ? 1.3 : 1));
    c.due = now + c.interval * DAY;
  }
  c.ef = Math.max(1.3, c.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  c.ef = Math.round(c.ef * 100) / 100;
  c.last = now;
  return c;
}

/* ------------------------------------------------------------------ */
/* Study plan                                                          */
/* ------------------------------------------------------------------ */

export function studyPlan({ testDate, target, bands = {}, now = Date.now() }) {
  const days = testDate ? Math.ceil((new Date(testDate).getTime() - now) / DAY) : null;
  const skills = ['listening', 'reading', 'writing', 'speaking'];
  const gaps = skills.map((s) => ({ skill: s, band: bands[s] ?? null, gap: bands[s] == null ? null : Math.max(0, target - bands[s]) }));
  const known = gaps.filter((g) => g.gap != null);
  const priority = known.length
    ? [...known].sort((a, b) => b.gap - a.gap).map((g) => g.skill)
    : ['writing', 'speaking', 'reading', 'listening']; // productive skills usually lag
  const untested = gaps.filter((g) => g.gap == null).map((g) => g.skill);
  let phase;
  if (days == null) phase = 'none';
  else if (days < 0) phase = 'past';
  else if (days <= 7) phase = 'final';
  else if (days <= 28) phase = 'intensive';
  else phase = 'foundation';
  return { days, phase, priority, untested, gaps };
}

/* ------------------------------------------------------------------ */
/* Answer keys typed in by the learner from their own Cambridge book    */
/* ------------------------------------------------------------------ */

/**
 * Expand one key cell into every acceptable answer, following the conventions
 * used in Cambridge IELTS answer keys:
 *   "(the) library"        → optional words in brackets
 *   "24 / twenty-four"     → alternatives separated by "/" or " OR "
 */
export function expandKey(cell) {
  const alts = String(cell || '')
    .split(/\s*\/\s*|\s+OR\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out = new Set();
  for (const alt of alts) {
    const parts = alt.split(/(\([^)]*\))/).filter((p) => p !== '');
    let variants = [''];
    for (const p of parts) {
      if (/^\(.*\)$/.test(p)) {
        const inner = p.slice(1, -1);
        variants = variants.flatMap((v) => [v, `${v}${inner}`]);
      } else variants = variants.map((v) => v + p);
    }
    for (const v of variants) {
      const n = normalizeAnswer(v);
      if (n) out.add(n);
    }
  }
  return [...out];
}

/**
 * Parse a pasted answer key. Accepted line formats:
 *   "1 library"   "1. (the) library"   "1) TRUE"
 *   "21-22 B, D"  "21&22 B D"  "21–22 IN EITHER ORDER: B, D"   (letters in either order)
 * Returns { answers: { n: [accepted...] }, groups: [{ nums:[..], letters:[..] }], errors: [line] }.
 */
export function parseKeyText(text) {
  const answers = {};
  const groups = [];
  const errors = [];
  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const g = line.match(/^(\d{1,2})\s*(?:-|–|&|and|,)\s*(\d{1,2})\s*[.):]?\s*(?:in either order\s*[:,-]?)?\s*(.+)$/i);
    if (g) {
      const a = Number(g[1]);
      const b = Number(g[2]);
      const letters = g[3].toUpperCase().replace(/IN EITHER ORDER/g, '').match(/\b[A-Z]\b/g) || [];
      const nums = [];
      for (let k = Math.min(a, b); k <= Math.max(a, b); k++) nums.push(k);
      if (letters.length === nums.length) {
        groups.push({ nums, letters });
        continue;
      }
    }
    const m = line.match(/^(\d{1,2})\s*[.):]?\s+(.+)$/);
    if (m && Number(m[1]) >= 1 && Number(m[1]) <= 40) {
      const acc = expandKey(m[2]);
      if (acc.length) {
        answers[Number(m[1])] = acc;
        continue;
      }
    }
    errors.push(line);
  }
  return { answers, groups, errors };
}

/**
 * Grade a 40-question answer sheet against a parsed key. Grouped questions
 * ("in either order") score one mark per distinct correct letter.
 */
export function gradeSheet(responses, key) {
  const per = {};
  for (const [n, acc] of Object.entries(key.answers)) {
    const r = normalizeAnswer(responses[n]);
    per[n] = !!r && acc.includes(r);
  }
  for (const g of key.groups) {
    const pool = [...g.letters];
    const given = g.nums.map((n) => normalizeAnswer(responses[n]).toUpperCase());
    g.nums.forEach((n, i) => {
      const idx = pool.indexOf(given[i]);
      per[n] = idx !== -1;
      if (idx !== -1) pool.splice(idx, 1); // each correct letter can only be credited once
    });
  }
  const total = Object.keys(per).length;
  const correct = Object.values(per).filter(Boolean).length;
  return { per, correct, total };
}
