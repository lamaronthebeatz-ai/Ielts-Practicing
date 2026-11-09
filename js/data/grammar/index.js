// Aggregates all grammar chapters into one ordered list.
import * as tenses from './tenses.js';
import * as verbs from './verbs.js';
import * as clauses from './clauses.js';
import * as academic from './academic.js';

export const chapters = [tenses.chapter, ...verbs.chapters, ...clauses.chapters, ...academic.chapters];

export const topics = [
  ...tenses.topics.map((t) => ({ ...t, ch: tenses.chapter.id })),
  ...verbs.topics,
  ...clauses.topics,
  ...academic.topics,
];
