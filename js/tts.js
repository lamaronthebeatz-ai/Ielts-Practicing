// Text-to-speech playback of listening scripts via the Web Speech API.
// Each speaker key maps to a voice profile; we pick distinct installed voices where
// possible and vary pitch otherwise so that speakers remain distinguishable.

import { store } from './store.js';

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let voicesCache = [];
export function loadVoices() {
  return new Promise((resolve) => {
    if (!ttsSupported()) return resolve([]);
    const got = speechSynthesis.getVoices();
    if (got.length) {
      voicesCache = got;
      return resolve(got);
    }
    const done = () => {
      voicesCache = speechSynthesis.getVoices();
      resolve(voicesCache);
    };
    speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
}

const PROFILES = {
  'gb-f': { langs: ['en-GB', 'en-IE', 'en-AU', 'en-US'], female: true, pitch: 1.05 },
  'gb-m': { langs: ['en-GB', 'en-AU', 'en-US'], female: false, pitch: 0.9 },
  'gb-m2': { langs: ['en-GB', 'en-US', 'en-AU'], female: false, pitch: 1.0, alt: 1 },
  'au-f': { langs: ['en-AU', 'en-NZ', 'en-GB', 'en-US'], female: true, pitch: 1.12, alt: 1 },
  'us-m': { langs: ['en-US', 'en-CA', 'en-GB'], female: false, pitch: 0.95, alt: 2 },
};

const FEMALE_HINT = /female|woman|zira|susan|hazel|serena|kate|karen|moira|tessa|samantha|victoria|libby|sonia|natasha|catherine|aria|jenny|emma|amy|joanna|salli|fiona|google uk english female/i;
const MALE_HINT = /male|daniel|george|ryan|thomas|guy|david|mark|alex|fred|james|oliver|arthur|william|google uk english male|christopher|eric/i;

function chooseVoice(profileKey) {
  const p = PROFILES[profileKey] || PROFILES['gb-m'];
  const en = voicesCache.filter((v) => /^en[-_]/i.test(v.lang));
  for (const lang of p.langs) {
    const pool = en.filter((v) => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
    if (!pool.length) continue;
    const gendered = pool.filter((v) => (p.female ? FEMALE_HINT.test(v.name) && !/\bmale\b/i.test(v.name.replace(/female/i, '')) : MALE_HINT.test(v.name) && !/female/i.test(v.name)));
    const list = gendered.length ? gendered : pool;
    return list[(p.alt || 0) % list.length];
  }
  return en[0] || null;
}

function splitSentences(t) {
  return t.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || [t];
}

/**
 * Plays a script: [{ s: speakerKey, t: text } | { pause: seconds }].
 * Callbacks: onLine(index, item), onPause(seconds, skipFn), onEnd().
 */
export class ScriptPlayer {
  constructor(script, speakers, { onLine, onPause, onPauseTick, onEnd } = {}) {
    this.script = script;
    this.speakers = speakers;
    this.cb = { onLine, onPause, onPauseTick, onEnd };
    this.i = 0;
    this.state = 'idle';
    this.token = 0;
  }
  async play(from = this.i) {
    if (!ttsSupported()) throw new Error('Trình duyệt không hỗ trợ đọc văn bản (Web Speech API).');
    await loadVoices();
    this.i = from;
    this.state = 'playing';
    const token = ++this.token;
    while (this.i < this.script.length && this.state === 'playing' && token === this.token) {
      const item = this.script[this.i];
      this.cb.onLine?.(this.i, item);
      if (item.pause) await this.wait(item.pause, token);
      else await this.speak(item, token);
      if (token !== this.token || this.state !== 'playing') return;
      this.i++;
    }
    if (this.i >= this.script.length && token === this.token) {
      this.state = 'ended';
      this.cb.onEnd?.();
    }
  }
  speak(item, token) {
    const spk = this.speakers[item.s] || {};
    const voice = chooseVoice(spk.voice);
    const prof = PROFILES[spk.voice] || {};
    const rate = store.get().settings.ttsRate || 0.95;
    const chunks = splitSentences(item.t);
    return new Promise((resolve) => {
      let k = 0;
      const next = () => {
        if (token !== this.token || this.state !== 'playing') return resolve();
        if (k >= chunks.length) return setTimeout(resolve, 350);
        const text = chunks[k++];
        const u = new SpeechSynthesisUtterance(text);
        if (voice) {
          u.voice = voice;
          u.lang = voice.lang;
        } else u.lang = 'en-GB';
        u.rate = rate;
        u.pitch = prof.pitch || 1;
        // Watchdog: some engines occasionally never fire onend; continue after a generous estimate.
        let done = false;
        const words = text.split(/\s+/).length;
        const guard = setTimeout(() => finish(), (words / (2.2 * rate)) * 1000 + 4000);
        const finish = () => {
          if (done) return;
          done = true;
          clearTimeout(guard);
          next();
        };
        u.onend = finish;
        u.onerror = finish;
        speechSynthesis.resume();
        speechSynthesis.speak(u);
      };
      next();
    });
  }
  wait(seconds, token) {
    return new Promise((resolve) => {
      let left = seconds;
      const finish = () => {
        clearInterval(iv);
        this.skipWait = null;
        resolve();
      };
      this.skipWait = finish;
      this.cb.onPause?.(seconds, finish);
      const iv = setInterval(() => {
        if (token !== this.token || this.state !== 'playing') return finish();
        left -= 1;
        this.cb.onPauseTick?.(left);
        if (left <= 0) finish();
      }, 1000);
    });
  }
  pause() {
    this.state = 'paused';
    this.token++;
    speechSynthesis.cancel();
    this.skipWait?.();
  }
  resume() {
    if (this.state === 'paused') this.play(this.i);
  }
  stop() {
    this.state = 'idle';
    this.token++;
    if (ttsSupported()) speechSynthesis.cancel();
    this.skipWait?.();
  }
  skip() {
    this.skipWait?.();
  }
}

/** Speak a single phrase (vocabulary, examiner questions). */
export function say(text, { rate, lang = 'en-GB', voiceKey = 'gb-f' } = {}) {
  if (!ttsSupported()) return Promise.resolve();
  return loadVoices().then(
    () =>
      new Promise((resolve) => {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const v = chooseVoice(voiceKey);
        if (v) u.voice = v;
        u.lang = v?.lang || lang;
        u.rate = rate || store.get().settings.ttsRate || 0.95;
        u.onend = resolve;
        u.onerror = resolve;
        speechSynthesis.speak(u);
      }),
  );
}

export function stopSpeaking() {
  if (ttsSupported()) speechSynthesis.cancel();
}
