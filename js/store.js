// Persistent state in localStorage with schema versioning and safe fallbacks.
import { writingBand } from './scoring.js';

const KEY = 'ielts-prep:v1';

const defaults = () => ({
  v: 1,
  profile: { name: '', module: 'academic', target: 7, testDate: '' },
  settings: { theme: 'auto', ttsRate: 0.95 },
  attempts: [], // { id, skill, ref, title, date, raw?, total?, band, detail? }
  drafts: {}, // writing drafts keyed by task id
  srs: {}, // vocab id -> card
  activity: {}, // 'YYYY-MM-DD' -> minutes/actions count
  inProgress: {}, // test id -> { responses, remaining, savedAt }
  grammar: {}, // grammar topic id -> { best, last, at }
  customVocab: [], // words added from the dictionary
  customTasks: [], // Writing prompts typed in from the learner's Cambridge books
  customCards: [], // Speaking cue cards typed in from the learner's Cambridge books
  cambridgeKeys: {}, // Cambridge test id -> answer key text typed in by the learner
});

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    return defaults();
  }
}

function migrate(s) {
  const d = defaults();
  return {
    ...d,
    ...s,
    profile: { ...d.profile, ...(s.profile || {}) },
    settings: { ...d.settings, ...(s.settings || {}) },
    attempts: Array.isArray(s.attempts) ? s.attempts : [],
    drafts: s.drafts || {},
    srs: s.srs || {},
    activity: s.activity || {},
    inProgress: s.inProgress || {},
    grammar: s.grammar || {},
    customVocab: Array.isArray(s.customVocab) ? s.customVocab : [],
    customTasks: Array.isArray(s.customTasks) ? s.customTasks : [],
    customCards: Array.isArray(s.customCards) ? s.customCards : [],
    cambridgeKeys: s.cambridgeKeys || {},
    v: 1,
  };
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state', e);
  }
  listeners.forEach((fn) => fn(state));
}

export const store = {
  get: () => state,
  update(fn) {
    fn(state);
    persist();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  addAttempt(a) {
    state.attempts.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString(), ...a });
    markActivity();
    persist();
  },
  removeAttempt(id) {
    state.attempts = state.attempts.filter((a) => a.id !== id);
    persist();
  },
  export() {
    return JSON.stringify(state, null, 2);
  },
  import(json) {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || !parsed || !('profile' in parsed)) throw new Error('File không đúng định dạng dữ liệu của ứng dụng.');
    state = migrate(parsed);
    persist();
  },
  reset() {
    state = defaults();
    persist();
  },
};

export function todayKey(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function markActivity() {
  const k = todayKey();
  state.activity[k] = (state.activity[k] || 0) + 1;
}

export function streak() {
  let count = 0;
  const d = new Date();
  if (!state.activity[todayKey(d)]) d.setDate(d.getDate() - 1); // today not done yet → count from yesterday
  while (state.activity[todayKey(d)]) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

/**
 * Latest band per skill. Writing combines the most recent Task 1 and Task 2
 * self-assessments (Task 2 weighted double) when both exist.
 */
export function latestBands() {
  const out = {};
  let t1 = null;
  let t2 = null;
  for (const a of [...state.attempts].sort((x, y) => x.date.localeCompare(y.date))) {
    if (a.band == null) continue;
    if (a.skill === 'writing') {
      if (a.detail?.task === 1) t1 = a.detail.criteria;
      else t2 = a.detail?.criteria;
    } else if (['listening', 'reading', 'speaking'].includes(a.skill)) out[a.skill] = a.band;
  }
  const w = writingBand(t1, t2);
  if (w != null) out.writing = w;
  return out;
}
