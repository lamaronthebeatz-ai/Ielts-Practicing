// Integrity checks for exam content: numbering, answer validity and word limits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { readingTests } from '../js/data/reading.js';
import { listeningTests } from '../js/data/listening.js';
import { withinLimit, wordCount } from '../js/scoring.js';
import { task1Academic, task1General, task2 } from '../js/data/writing.js';
import { vocab } from '../js/data/vocab.js';

const VALID = { tfng: ['TRUE', 'FALSE', 'NOT GIVEN'], ynng: ['YES', 'NO', 'NOT GIVEN'] };

function checkGroups(groups, label) {
  const nums = [];
  for (const g of groups) {
    assert.equal(g.questions.length, g.range[1] - g.range[0] + 1, `${label}: range ${g.range} size`);
    g.questions.forEach((q, i) => {
      assert.equal(q.n, g.range[0] + i, `${label}: numbering at Q${q.n}`);
      assert.ok(q.explain && q.explain.length > 10, `${label}: Q${q.n} needs an explanation`);
      nums.push(q.n);
      if (VALID[g.type]) assert.ok(VALID[g.type].includes(q.answer), `${label}: Q${q.n} answer`);
      if (g.type === 'mcq') assert.ok(q.options.some(([k]) => k === q.answer), `${label}: Q${q.n} mcq answer in options`);
      if (g.type === 'match') assert.ok(g.options.some(([k]) => k === q.answer), `${label}: Q${q.n} match answer in options`);
      if (g.type === 'gap') {
        assert.ok(Array.isArray(q.answer) && q.answer.length, `${label}: Q${q.n} gap answers`);
        assert.ok(q.prompt.includes('________'), `${label}: Q${q.n} has a gap`);
        for (const a of q.answer) assert.ok(withinLimit(a, q.limit), `${label}: Q${q.n} answer "${a}" exceeds its own word limit`);
      }
    });
  }
  return nums;
}

test('reading tests have exactly 40 sequential, valid questions', () => {
  for (const t of readingTests) {
    const nums = t.passages.flatMap((p) => checkGroups(p.groups, t.id));
    assert.deepEqual(nums, Array.from({ length: 40 }, (_, i) => i + 1));
  }
});

test('reading gap answers appear verbatim in the passage', () => {
  for (const t of readingTests) {
    for (const p of t.passages) {
      const text = p.paragraphs.join(' ').toLowerCase();
      for (const g of p.groups.filter((x) => x.type === 'gap')) {
        for (const q of g.questions) assert.ok(text.includes(q.answer[0].toLowerCase()), `Q${q.n} "${q.answer[0]}" not found in passage`);
      }
    }
  }
});

test('matching-headings answers are unique (a heading is used once)', () => {
  for (const t of readingTests) {
    const g = t.passages[1].groups[0];
    const answers = g.questions.map((q) => q.answer);
    assert.equal(new Set(answers).size, answers.length);
    assert.ok(g.options.length > answers.length, 'distractor headings needed');
  }
});

test('listening tests have 4 parts × 10 questions and answers are spoken in the script', () => {
  for (const t of listeningTests) {
    assert.equal(t.parts.length, 4);
    const nums = t.parts.flatMap((p) => {
      const n = checkGroups(p.groups, `${t.id} part ${p.n}`);
      assert.equal(n.length, 10);
      for (const it of p.script) if (it.s) assert.ok(p.speakers[it.s], `unknown speaker ${it.s}`);
      return n;
    });
    assert.deepEqual(nums, Array.from({ length: 40 }, (_, i) => i + 1));
    for (const p of t.parts) {
      const spoken = p.script.filter((x) => x.t).map((x) => x.t.toLowerCase()).join(' ');
      for (const g of p.groups.filter((x) => x.type === 'gap')) {
        for (const q of g.questions) {
          const ok = q.answer.some((a) => spoken.includes(a.toLowerCase()) || spoken.replace(/, /g, ', ').includes(a.split('').join(', ').toLowerCase()));
          assert.ok(ok, `Listening Q${q.n}: none of ${q.answer} is spoken or spelled out`);
        }
      }
    }
  }
});

test('writing model answers meet minimum length', () => {
  for (const t of [...task1Academic, ...task1General]) if (t.model) assert.ok(wordCount(t.model) >= 150, t.id);
  for (const t of task2) if (t.model) assert.ok(wordCount(t.model) >= 250, t.id);
});

test('vocab entries are complete and unique', () => {
  const ids = new Set();
  for (const v of vocab) {
    assert.ok(v.w && v.pos && v.vi && v.ex && v.col, v.id);
    assert.ok(!ids.has(v.id), `duplicate ${v.id}`);
    ids.add(v.id);
  }
});

test('service worker precaches every app module', () => {
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  const files = [
    ...readdirSync(new URL('../js', import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => `./js/${f}`),
    ...readdirSync(new URL('../js/views', import.meta.url)).map((f) => `./js/views/${f}`),
    ...readdirSync(new URL('../js/data', import.meta.url)).map((f) => `./js/data/${f}`),
  ];
  for (const f of files) assert.ok(sw.includes(`'${f}'`), `${f} missing from sw.js ASSETS`);
});
