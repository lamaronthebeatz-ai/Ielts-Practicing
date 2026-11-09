// Real dictionary integration.
// Data: Free Dictionary API (api.dictionaryapi.dev, Wiktionary-based, CC BY-SA) —
// IPA, native-speaker audio, definitions, examples, synonyms/antonyms.
// Every entry also links to the Cambridge Dictionary (English and English–Vietnamese)
// and Oxford Learner's Dictionaries for learner-focused definitions.
import { html, esc } from './ui.js';

const API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const CACHE_KEY = 'ielts-prep:dict';
const MAX_CACHE = 400;

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}
function writeCache(c) {
  const keys = Object.keys(c);
  if (keys.length > MAX_CACHE) keys.sort((a, b) => c[a].t - c[b].t).slice(0, keys.length - MAX_CACHE).forEach((k) => delete c[k]);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* storage full — ignore */
  }
}

export const cleanWord = (w) => String(w || '').toLowerCase().replace(/[’]/g, "'").replace(/[^a-z' -]/g, '').trim();

export function links(word) {
  const w = encodeURIComponent(cleanWord(word).replace(/ /g, '-'));
  return {
    cambridge: `https://dictionary.cambridge.org/dictionary/english/${w}`,
    cambridgeVi: `https://dictionary.cambridge.org/dictionary/english-vietnamese/${w}`,
    oxford: `https://www.oxfordlearnersdictionaries.com/search/english/?q=${w}`,
  };
}

/** Normalise the API response into a compact entry. */
export function normalise(data) {
  const first = data[0];
  const phonetics = [];
  const seen = new Set();
  for (const e of data) {
    for (const p of e.phonetics || []) {
      const accent = /-uk|-gb/.test(p.audio || '') ? 'UK' : /-us/.test(p.audio || '') ? 'US' : /-au/.test(p.audio || '') ? 'AU' : '';
      const key = `${p.text}|${p.audio}`;
      if ((p.text || p.audio) && !seen.has(key)) {
        seen.add(key);
        phonetics.push({ text: p.text || '', audio: p.audio || '', accent });
      }
    }
  }
  const meanings = [];
  for (const e of data) {
    for (const m of e.meanings || []) {
      let target = meanings.find((x) => x.pos === m.partOfSpeech);
      if (!target) meanings.push((target = { pos: m.partOfSpeech, defs: [], synonyms: [], antonyms: [] }));
      for (const d of m.definitions || []) {
        if (target.defs.length < 6) target.defs.push({ d: d.definition, ex: d.example || '' });
        target.synonyms.push(...(d.synonyms || []));
        target.antonyms.push(...(d.antonyms || []));
      }
      target.synonyms.push(...(m.synonyms || []));
      target.antonyms.push(...(m.antonyms || []));
    }
  }
  for (const m of meanings) {
    m.synonyms = [...new Set(m.synonyms)].slice(0, 10);
    m.antonyms = [...new Set(m.antonyms)].slice(0, 6);
  }
  return { word: first.word, phonetic: first.phonetic || phonetics.find((p) => p.text)?.text || '', phonetics, meanings };
}

/** Look up a word. Resolves to { entry } or { notFound: true } or { offline: true }. */
export async function lookup(word) {
  const w = cleanWord(word);
  if (!w) return { notFound: true };
  const cache = readCache();
  if (cache[w]) return { entry: cache[w].e, cached: true };
  try {
    const res = await fetch(API + encodeURIComponent(w));
    if (res.status === 404) return { notFound: true };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const entry = normalise(await res.json());
    cache[w] = { e: entry, t: Date.now() };
    writeCache(cache);
    return { entry };
  } catch {
    return { offline: true };
  }
}

export function playAudio(url) {
  try {
    new Audio(url).play();
  } catch {
    /* ignore */
  }
}

/** Render an entry (or an error state) as HTML. */
export function renderEntry(word, result, { compact = false, addable = false } = {}) {
  const l = links(word);
  const ext = html`<div class="row small" style="margin-top:.5rem">
    <a class="btn sm" href="${l.cambridgeVi}" target="_blank" rel="noopener">Cambridge Anh–Việt ↗</a>
    <a class="btn sm" href="${l.cambridge}" target="_blank" rel="noopener">Cambridge English ↗</a>
    <a class="btn sm" href="${l.oxford}" target="_blank" rel="noopener">Oxford Learner's ↗</a>
  </div>`;
  if (result.notFound) return html`<div><strong>${word}</strong><p class="muted small">Không tìm thấy trong từ điển dữ liệu mở. Hãy tra trực tiếp:</p>${ext}</div>`;
  if (result.offline) return html`<div><strong>${word}</strong><p class="muted small">Không tải được dữ liệu (đang offline?). Từ đã tra trước đây vẫn xem được khi offline.</p>${ext}</div>`;
  const e = result.entry;
  const meanings = compact ? e.meanings.slice(0, 2) : e.meanings;
  return html`<div class="dict-entry">
    <div class="row" style="align-items:baseline">
      <span class="dict-word">${e.word}</span>
      ${e.phonetic ? html`<span class="muted">${e.phonetic}</span>` : ''}
      ${e.phonetics.filter((p) => p.audio).slice(0, 3).map((p) => html`<button class="btn sm ghost" data-audio="${p.audio}" aria-label="Phát âm ${p.accent}">🔊 ${p.accent || ''}</button>`)}
      ${addable ? html`<span class="spacer"></span><button class="btn sm" data-add-word="${e.word}">＋ Thêm vào thẻ ôn</button>` : ''}
    </div>
    ${meanings.map(
      (m) => html`<div class="dict-pos"><span class="tag">${m.pos}</span>
        <ol class="dict-defs">${m.defs.slice(0, compact ? 2 : 6).map((d) => html`<li>${d.d}${d.ex ? html`<div class="small muted"><em>“${d.ex}”</em></div>` : ''}</li>`)}</ol>
        ${m.synonyms.length ? html`<p class="small"><strong>Đồng nghĩa:</strong> ${m.synonyms.map((s, i) => html`${i ? ', ' : ''}<a href="#" data-lookup="${s}">${s}</a>`)}</p>` : ''}
        ${m.antonyms.length && !compact ? html`<p class="small"><strong>Trái nghĩa:</strong> ${m.antonyms.join(', ')}</p>` : ''}
      </div>`,
    )}
    ${ext}
    <p class="small muted" style="margin:.4rem 0 0">Nguồn: Free Dictionary API (Wiktionary, CC BY-SA). ${result.cached ? '· đã lưu offline' : ''}</p>
  </div>`;
}

/**
 * Enable double-click (or long-press selection) dictionary lookup inside `root`.
 * `enabled()` lets callers switch it off during timed exam conditions.
 */
export function bindLookupPopup(root, enabled = () => true) {
  let pop = null;
  const close = () => {
    pop?.remove();
    pop = null;
  };
  const show = async (word, x, y) => {
    close();
    pop = document.createElement('div');
    pop.className = 'dict-pop card';
    pop.style.left = `${Math.min(x, window.innerWidth - 340)}px`;
    pop.style.top = `${y + 12}px`;
    pop.innerHTML = `<div class="muted small">Đang tra “${esc(word)}”…</div>`;
    document.body.appendChild(pop);
    const r = await lookup(word);
    if (!pop) return;
    pop.innerHTML = `<button class="btn sm ghost dict-close" aria-label="Đóng">✕</button>${renderEntry(word, r, { compact: true })}`;
  };
  root.addEventListener('dblclick', (e) => {
    if (!enabled()) return;
    const w = cleanWord(window.getSelection()?.toString());
    if (w && w.split(' ').length <= 3) show(w, e.clientX, e.clientY + window.scrollY);
  });
  const onDocClick = (e) => {
    if (!pop) return;
    const a = e.target.closest('[data-audio]');
    if (a && pop.contains(a)) return playAudio(a.dataset.audio);
    if (e.target.closest('.dict-close') || !pop.contains(e.target)) close();
  };
  document.addEventListener('click', onDocClick);
  return () => {
    close();
    document.removeEventListener('click', onDocClick);
  };
}
