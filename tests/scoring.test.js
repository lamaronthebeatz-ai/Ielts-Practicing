import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  overallBand, rawToBand, checkTyped, withinLimit, countAnswerTokens, wordCount,
  analyzeWriting, writingBand, criteriaBand, srsReview, analyzeSpeech, studyPlan,
} from '../js/scoring.js';

test('overall band follows the official rounding rule', () => {
  assert.equal(overallBand(6.5, 6.5, 5, 7), 6.5); // 6.25 → 6.5
  assert.equal(overallBand(4, 3.5, 4, 4), 4); // 3.875 → 4.0
  assert.equal(overallBand(6.5, 6.5, 5.5, 6), 6); // 6.125 → 6.0
  assert.equal(overallBand(7, 7, 6.5, 7.5), 7); // 7.0 stays
  assert.equal(overallBand(7, 7, 7, 8), 7.5); // 7.25 → 7.5
  assert.equal(overallBand(7, 7.5, 7, 8), 7.5); // 7.375 → 7.5
  assert.equal(overallBand(7, 7.5, 7.5, 8), 7.5); // 7.5 stays
  assert.equal(overallBand(7.5, 7.5, 7.5, 8), 7.5); // 7.625 → 7.5
  assert.equal(overallBand(7.5, 7.5, 8, 8), 8); // 7.75 → 8.0
  assert.equal(overallBand(9, 9, 9, 9), 9);
  assert.throws(() => overallBand(6.3, 6, 6, 6), RangeError);
});

test('raw score conversion matches published anchor points', () => {
  assert.equal(rawToBand(16, 'listening'), 5);
  assert.equal(rawToBand(23, 'listening'), 6);
  assert.equal(rawToBand(30, 'listening'), 7);
  assert.equal(rawToBand(35, 'listening'), 8);
  assert.equal(rawToBand(40, 'listening'), 9);
  assert.equal(rawToBand(15, 'academicReading'), 5);
  assert.equal(rawToBand(23, 'academicReading'), 6);
  assert.equal(rawToBand(30, 'academicReading'), 7);
  assert.equal(rawToBand(35, 'academicReading'), 8);
  assert.equal(rawToBand(15, 'generalReading'), 4);
  assert.equal(rawToBand(23, 'generalReading'), 5);
  assert.equal(rawToBand(30, 'generalReading'), 6);
  assert.equal(rawToBand(34, 'generalReading'), 7);
  assert.equal(rawToBand(38, 'generalReading'), 8);
  assert.equal(rawToBand(0, 'listening'), 0);
});

test('conversion tables are monotonic', async () => {
  for (const t of ['listening', 'academicReading', 'generalReading']) {
    let prev = -1;
    for (let r = 0; r <= 40; r++) {
      const b = rawToBand(r, t);
      assert.ok(b >= prev, `${t} not monotonic at ${r}`);
      prev = b;
    }
  }
});

test('typed answers: case, punctuation, variants and word limits', () => {
  const one = { words: 1, number: false };
  const oneNum = { words: 1, number: true };
  assert.ok(checkTyped('Flooding', ['flooding'], one));
  assert.ok(checkTyped(' flooding. ', ['flooding'], one));
  assert.ok(checkTyped('run - off', ['run-off', 'runoff'], one));
  assert.ok(!checkTyped('the flooding', ['flooding'], one)); // exceeds ONE WORD ONLY
  assert.ok(!checkTyped('floding', ['flooding'], one)); // misspelling
  assert.ok(checkTyped('24', ['24', 'twenty-four'], oneNum));
  assert.ok(checkTyped('12th', ['12', '12th'], oneNum));
  assert.ok(checkTyped('1,500', ['1500'], oneNum));
  assert.ok(!checkTyped('', ['x'], one));
  assert.deepEqual(countAnswerTokens('15 March'), { words: 1, numbers: 1 });
  assert.ok(withinLimit('15 March', { words: 1, number: true }));
  assert.ok(!withinLimit('15 March 2024', { words: 1, number: true }));
  assert.ok(withinLimit('15 March', { words: 2, number: false })); // number counted as a word
});

test('word count counts hyphenated words and contractions once', () => {
  assert.equal(wordCount("It's a well-known fact that 25 people didn't come."), 9);
  assert.equal(wordCount(''), 0);
});

test('writing analysis flags under-length, missing overview and paragraphing', () => {
  const short = analyzeWriting('The graph shows data. It goes up.', { task: 1 });
  assert.ok(short.words < 150);
  assert.ok(short.warnings.some((w) => w.includes('150')));
  assert.ok(short.warnings.some((w) => w.includes('Overview')));
  const t2 = analyzeWriting('One paragraph only. I believe this is fine.', { task: 2 });
  assert.ok(t2.warnings.some((w) => w.includes('4 đoạn')));
});

test('writing band weights Task 2 double and rounds down to half band', () => {
  assert.equal(writingBand([6, 6, 6, 6], [7, 7, 7, 7]), 6.5); // 6.667 → 6.5
  assert.equal(writingBand([7, 7, 7, 7], [6, 6, 6, 6]), 6); // 6.333 → 6.0
  assert.equal(writingBand(null, [7, 7, 6, 6]), 6.5);
  assert.equal(writingBand(null, null), null);
  assert.equal(criteriaBand([7, 6, 6, 6]), 6); // 6.25 → 6.0 (conservative)
  assert.equal(criteriaBand([7, 7, 6, 6]), 6.5);
});

test('SRS schedules increasing intervals and resets on failure', () => {
  const now = 0;
  let c = srsReview(undefined, 4, now);
  assert.equal(c.interval, 1);
  c = srsReview(c, 4, now);
  assert.equal(c.interval, 6);
  c = srsReview(c, 4, now);
  assert.ok(c.interval > 6);
  const failed = srsReview(c, 0, now);
  assert.equal(failed.reps, 0);
  assert.ok(failed.due < now + 86400000);
  assert.ok(failed.ef >= 1.3);
});

test('speech analysis computes WPM and fillers', () => {
  const a = analyzeSpeech('um I think that uh it is like really important you know', 30);
  assert.equal(a.wpm, Math.round((a.words / 30) * 60));
  assert.ok(a.fillerTotal >= 4);
});

test('study plan prioritises the largest gap', () => {
  const p = studyPlan({ testDate: '2030-01-01', target: 7, bands: { listening: 7, reading: 6.5, writing: 5.5, speaking: 6 }, now: Date.parse('2029-12-01') });
  assert.equal(p.priority[0], 'writing');
  assert.equal(p.phase, 'foundation');
});

import { expandKey, parseKeyText, gradeSheet } from '../js/scoring.js';

test('Cambridge-style key cells expand optional words and alternatives', () => {
  assert.deepEqual(expandKey('(the) library').sort(), ['library', 'the library']);
  assert.deepEqual(expandKey('24 / twenty-four').sort(), ['24', 'twenty-four']);
  assert.deepEqual(expandKey('(a) (large) house').sort(), ['a house', 'a large house', 'house', 'large house']);
  assert.deepEqual(expandKey('TRUE'), ['true']);
});

test('pasted keys parse single answers, either-order groups and report bad lines', () => {
  const k = parseKeyText('1 library\n2. (the) car park\n3) 24/twenty-four\n21-22 B, D\n23&24 IN EITHER ORDER: A C\nnonsense line');
  assert.deepEqual(k.answers[1], ['library']);
  assert.ok(k.answers[2].includes('car park') && k.answers[2].includes('the car park'));
  assert.equal(k.groups.length, 2);
  assert.deepEqual(k.groups[0], { nums: [21, 22], letters: ['B', 'D'] });
  assert.deepEqual(k.errors, ['nonsense line']);
});

test('sheet grading credits either-order letters once each', () => {
  const key = parseKeyText('1 (the) library\n21-22 B, D');
  assert.equal(gradeSheet({ 1: 'Library', 21: 'D', 22: 'B' }, key).correct, 3);
  assert.equal(gradeSheet({ 1: 'libary', 21: 'B', 22: 'B' }, key).correct, 1); // misspelt; duplicate letter only once
});
