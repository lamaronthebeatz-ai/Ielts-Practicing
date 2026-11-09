// Shared renderer/grader for Reading and Listening question groups.
import { html, raw, esc, $$ } from './ui.js';
import { scoreQuestion } from './scoring.js';

const CHOICES = { tfng: ['TRUE', 'FALSE', 'NOT GIVEN'], ynng: ['YES', 'NO', 'NOT GIVEN'] };

export function allQuestions(groups) {
  return groups.flatMap((g) => g.questions.map((q) => ({ ...q, type: g.type, options: q.options || g.options })));
}

export function grade(groups, responses) {
  const per = {};
  let correct = 0;
  const qs = allQuestions(groups);
  for (const q of qs) {
    const ok = scoreQuestion(q, responses[q.n]);
    per[q.n] = ok;
    if (ok) correct++;
  }
  return { correct, total: qs.length, per };
}

function displayAnswer(q) {
  if (q.type === 'gap') return q.answer.join(' / ');
  if (q.type === 'match' || q.type === 'mcq') {
    const opts = q.options || [];
    const o = opts.find(([k]) => k === q.answer);
    return o ? `${o[0]} — ${o[1]}` : q.answer;
  }
  return q.answer;
}

function reviewBlock(q, response, ok) {
  return html`<div class="review ${ok ? 'ok' : 'bad'}">
    <div><strong>${ok ? '✓ Đúng' : '✗ Sai'}</strong>${!ok ? html` · Bạn chọn: <em>${response || '(bỏ trống)'}</em>` : ''}</div>
    <div>Đáp án: <strong>${displayAnswer(q)}</strong></div>
    ${q.explain ? html`<div class="explain">${q.explain}</div>` : ''}
  </div>`;
}

function renderQuestion(q, type, groupOptions, responses, review, result) {
  const val = responses[q.n] ?? '';
  const dis = review ? 'disabled' : '';
  const ok = review ? result.per[q.n] : null;
  let body;
  if (type === 'tfng' || type === 'ynng') {
    body = html`<div class="choice-row" role="radiogroup" aria-label="Question ${q.n}">
      ${CHOICES[type].map((c) => html`<label class="chip"><input type="radio" name="q${q.n}" data-n="${q.n}" value="${c}" ${raw(val === c ? 'checked' : '')} ${raw(dis)}><span>${c}</span></label>`)}
    </div>`;
  } else if (type === 'mcq') {
    body = html`<div class="mcq">
      ${q.options.map(([k, t]) => html`<label class="opt"><input type="radio" name="q${q.n}" data-n="${q.n}" value="${k}" ${raw(val === k ? 'checked' : '')} ${raw(dis)}><span><b>${k}</b> ${t}</span></label>`)}
    </div>`;
  } else if (type === 'match') {
    body = html`<select data-n="${q.n}" ${raw(dis)} aria-label="Answer for question ${q.n}">
      <option value="">— chọn —</option>
      ${groupOptions.map(([k]) => html`<option value="${k}" ${raw(val === k ? 'selected' : '')}>${k}</option>`)}
    </select>`;
  } else if (type === 'gap') {
    const parts = q.prompt.split('________');
    const input = html`<input type="text" class="gap" data-n="${q.n}" value="${val}" ${raw(dis)} autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Answer for question ${q.n}">`;
    return html`<div class="q ${review ? (ok ? 'is-ok' : 'is-bad') : ''}" id="q-${q.n}">
      <div class="q-line"><span class="qn">${q.n}</span><span>${parts[0]}${input}${parts[1] || ''}</span></div>
      ${review ? reviewBlock(q, val, ok) : ''}
    </div>`;
  }
  return html`<div class="q ${review ? (ok ? 'is-ok' : 'is-bad') : ''}" id="q-${q.n}">
    <div class="q-line"><span class="qn">${q.n}</span><span>${q.prompt}</span></div>
    ${body}
    ${review ? reviewBlock({ ...q, type, options: q.options || groupOptions }, val, ok) : ''}
  </div>`;
}

export function renderGroups(groups, responses, { review = false, result = null } = {}) {
  return html`${groups.map(
    (g) => html`<section class="qgroup">
      <h4>Questions ${g.range[0]}–${g.range[1]}</h4>
      <p class="instr">${g.instruction}</p>
      ${g.heading ? html`<p class="qheading">${g.heading}</p>` : ''}
      ${g.options && g.type === 'match'
        ? html`<div class="optbox">${g.options.map(([k, t]) => html`<div><b>${k}</b> ${t}</div>`)}</div>`
        : ''}
      ${g.questions.map((q) => renderQuestion(q, g.type, g.options, responses, review, result))}
    </section>`,
  )}`;
}

/** Wire inputs inside root so that responses[n] stays in sync. */
export function bindInputs(root, responses, onChange) {
  root.addEventListener('input', (e) => {
    const n = e.target.dataset?.n;
    if (!n) return;
    responses[n] = e.target.value;
    onChange?.(Number(n));
  });
  root.addEventListener('change', (e) => {
    const n = e.target.dataset?.n;
    if (!n) return;
    responses[n] = e.target.value;
    onChange?.(Number(n));
  });
}

export function navBar(numbers, responses, result) {
  return html`<nav class="qnav" aria-label="Question navigation">${numbers.map((n) => {
    const answered = responses[n] != null && String(responses[n]).trim() !== '';
    const cls = result ? (result.per[n] ? 'ok' : 'bad') : answered ? 'done' : '';
    return html`<button type="button" class="${cls}" data-jump="${n}" aria-label="Go to question ${n}">${n}</button>`;
  })}</nav>`;
}

export function updateNav(root, responses) {
  $$('.qnav [data-jump]', root).forEach((a) => {
    const n = a.dataset.jump;
    const answered = responses[n] != null && String(responses[n]).trim() !== '';
    a.classList.toggle('done', answered);
  });
}

/** Delegate clicks on [data-jump] to scroll the matching question into view. */
export function bindJump(root, beforeJump) {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-jump]');
    if (!b) return;
    const n = Number(b.dataset.jump);
    beforeJump?.(n);
    requestAnimationFrame(() => {
      const el = document.getElementById(`q-${n}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.querySelector('input,select')?.focus({ preventScroll: true });
      }
    });
  });
}
