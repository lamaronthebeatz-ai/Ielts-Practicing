import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapters, topics } from '../js/data/grammar/index.js';

test('grammar: every topic is complete (meaning, formulas, usage, IELTS tips, mistakes, quiz)', () => {
  const ids = new Set();
  const chIds = new Set(chapters.map((c) => c.id));
  for (const t of topics) {
    assert.ok(!ids.has(t.id), `duplicate id ${t.id}`);
    ids.add(t.id);
    assert.ok(chIds.has(t.ch), `${t.id}: unknown chapter ${t.ch}`);
    assert.ok(t.title && t.en && t.what.length > 40, `${t.id}: needs title/en/meaning`);
    assert.ok(t.forms.length >= 1 && t.forms.every((f) => f.length === 2 && f[0] && f[1]), `${t.id}: formulas`);
    assert.ok(t.uses.length >= 2 && t.uses.every((u) => u.length === 2 && u[1].length > 5), `${t.id}: uses need examples`);
    assert.ok(t.ielts.length >= 1, `${t.id}: IELTS application`);
    assert.ok(t.mistakes.length >= 1 && t.mistakes.every((m) => m.length === 3), `${t.id}: mistakes`);
    assert.ok(t.quiz.length >= 3, `${t.id}: at least 3 quiz items`);
    for (const [q, opts, ans, why] of t.quiz) {
      assert.ok(q && why, `${t.id}: quiz item text`);
      assert.ok(Number.isInteger(ans) && ans >= 0 && ans < opts.length, `${t.id}: answer index for "${q}"`);
      assert.equal(new Set(opts).size, opts.length, `${t.id}: duplicate options in "${q}"`);
    }
  }
  // Every chapter has content
  for (const c of chapters) assert.ok(topics.some((t) => t.ch === c.id), `chapter ${c.id} empty`);
  assert.ok(topics.length >= 45, `expected broad coverage, got ${topics.length}`);
});

test('dictionary: API response is normalised into a compact entry', async () => {
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const { normalise, cleanWord, links } = await import('../js/dictionary.js');
  const sample = [{
    word: 'mitigate', phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    phonetics: [{ text: '/ˈmɪt.ɪ.ɡeɪt/', audio: 'https://x/mitigate-us.mp3' }, { text: '/ˈmɪt.ɪ.ɡeɪt/', audio: 'https://x/mitigate-uk.mp3' }],
    meanings: [{ partOfSpeech: 'verb', definitions: [{ definition: 'To reduce, lessen, or decrease.', example: 'to mitigate risks', synonyms: ['alleviate'] }], synonyms: ['lessen', 'alleviate'], antonyms: ['aggravate'] }],
  }];
  const e = normalise(sample);
  assert.equal(e.word, 'mitigate');
  assert.deepEqual(e.phonetics.map((p) => p.accent), ['US', 'UK']);
  assert.equal(e.meanings[0].pos, 'verb');
  assert.deepEqual(e.meanings[0].synonyms, ['alleviate', 'lessen']);
  assert.equal(cleanWord(' Mitigate, '), 'mitigate');
  assert.match(links('carbon footprint').cambridgeVi, /english-vietnamese\/carbon-footprint$/);
});
