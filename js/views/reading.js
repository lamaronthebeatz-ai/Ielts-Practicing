import { html, raw, $, $$, Countdown, fmtTime, toast, setLeaveGuard, bandClass, fmtBand } from '../ui.js';
import { store } from '../store.js';
import { readingTests, readingStrategies } from '../data/reading.js';
import { renderGroups, bindInputs, grade, navBar, updateNav, bindJump, allQuestions } from '../quiz.js';
import { rawToBand } from '../scoring.js';
import { bindLookupPopup } from '../dictionary.js';

export const TYPE_LABEL = { tfng: 'TRUE/FALSE/NOT GIVEN', ynng: 'YES/NO/NOT GIVEN', mcq: 'Multiple choice', match: 'Matching', gap: 'Completion (điền từ)' };

export function typeBreakdown(groupsList, per) {
  const out = {};
  for (const g of groupsList) {
    const label = TYPE_LABEL[g.type];
    out[label] ||= { correct: 0, total: 0 };
    for (const q of g.questions) {
      out[label].total++;
      if (per[q.n]) out[label].correct++;
    }
  }
  return out;
}

export function render(el, testId) {
  if (!testId) return renderList(el);
  const test = readingTests.find((t) => t.id === testId);
  if (!test) {
    el.innerHTML = String(html`<div class="alert bad">Không tìm thấy đề.</div>`);
    return;
  }
  return renderTest(el, test);
}

function renderList(el) {
  const s = store.get();
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Reading</h1><p>60 phút · 40 câu · 3 passages. Không có thời gian chép đáp án thêm.</p></div></div>
    <div class="grid g2">
      ${readingTests.map((t) => {
        const prev = s.attempts.filter((a) => a.ref === t.id);
        const best = prev.length ? Math.max(...prev.map((a) => a.band)) : null;
        const ip = s.inProgress[t.id];
        return html`<div class="card">
          <h3>${t.title}</h3>
          <p class="muted small">${t.passages.map((p, i) => `Passage ${i + 1}: ${p.title}`).join(' · ')}</p>
          <p class="row small"><span class="tag">${t.minutes} phút</span><span class="tag">40 câu</span>${best != null ? html`<span class="band ${bandClass(best)}">Cao nhất ${fmtBand(best)}</span>` : ''}</p>
          <a class="btn primary" href="#/reading/${t.id}">${ip ? 'Tiếp tục bài đang làm' : 'Bắt đầu'}</a>
        </div>`;
      })}
      <div class="card">
        <h3>Chiến lược theo dạng câu hỏi</h3>
        ${readingStrategies.map((st) => html`<details><summary>${st.type}</summary><ul class="ticks">${st.tips.map((t) => html`<li>${t}</li>`)}</ul></details>`)}
      </div>
    </div>
    ${s.profile.module === 'general' ? html`<div class="alert info" style="margin-top:1rem">Bạn đang chọn General Training. Đề mẫu hiện tại là Academic (độ khó cao hơn) — vẫn rất hữu ích để luyện kỹ năng; band được quy đổi theo bảng Academic.</div>` : ''}
  `);
}

function renderTest(el, test) {
  const groupsAll = test.passages.flatMap((p) => p.groups);
  const qs = allQuestions(groupsAll);
  const numbers = qs.map((q) => q.n);
  const saved = store.get().inProgress[test.id];
  const state = {
    responses: saved?.responses || {},
    remaining: saved?.remaining ?? test.minutes * 60,
    mode: saved?.mode || 'exam',
    passage: 0,
    started: false,
    result: null,
  };
  let timer = null;
  let saveT = null;
  let closeDict = null;

  const persist = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      if (state.result) return;
      store.update((s) => {
        s.inProgress[test.id] = { responses: state.responses, remaining: Math.round(timer?.remaining ?? state.remaining), mode: state.mode, savedAt: Date.now() };
      });
    }, 600);
  };

  const passageOf = (n) => test.passages.findIndex((p) => p.groups.some((g) => n >= g.range[0] && n <= g.range[1]));

  function intro() {
    el.innerHTML = String(html`
      <div class="card" style="max-width:720px">
        <h1>${test.title}</h1>
        <ul class="ticks">
          <li>3 passages, 40 câu hỏi. Mỗi câu đúng được 1 điểm; điểm thô được quy đổi sang band theo bảng ${store.get().profile.module === 'general' ? 'Academic (đề mẫu là Academic)' : 'Academic'}.</li>
          <li>Thời gian: 60 phút, đã bao gồm việc ghi đáp án.</li>
          <li>Bôi đen văn bản để <mark>tô sáng</mark>; bấm vào vùng tô sáng để bỏ.</li>
          <li>Chế độ luyện tập (hoặc sau khi nộp bài): nhấp đúp vào một từ để tra từ điển.</li>
          <li>Bài làm được lưu tự động — bạn có thể quay lại sau.</li>
        </ul>
        <fieldset class="row" style="border:0;padding:0;margin:1rem 0">
          <label class="chip"><input type="radio" name="mode" value="exam" ${raw(state.mode === 'exam' ? 'checked' : '')}><span>Thi thật (bấm giờ, tự nộp khi hết giờ)</span></label>
          <label class="chip"><input type="radio" name="mode" value="practice" ${raw(state.mode === 'practice' ? 'checked' : '')}><span>Luyện tập (không giới hạn thời gian)</span></label>
        </fieldset>
        ${saved ? html`<p class="alert info small">Bạn có bài làm dở (${Object.keys(saved.responses).length} câu đã trả lời, còn ${fmtTime(saved.remaining)}).</p>` : ''}
        <div class="row">
          <button class="btn primary" id="start">${saved ? 'Tiếp tục' : 'Bắt đầu làm bài'}</button>
          ${saved ? html`<button class="btn" id="restart">Làm lại từ đầu</button>` : ''}
          <a class="btn ghost" href="#/reading">Quay lại</a>
        </div>
      </div>`);
    $$('input[name=mode]', el).forEach((r) => r.addEventListener('change', () => (state.mode = r.value)));
    $('#start', el).onclick = start;
    const rs = $('#restart', el);
    if (rs)
      rs.onclick = () => {
        state.responses = {};
        state.remaining = test.minutes * 60;
        store.update((s) => delete s.inProgress[test.id]);
        start();
      };
  }

  function start() {
    state.started = true;
    setLeaveGuard(() => (state.result ? null : 'Bài làm đang diễn ra và đã được lưu tự động. Rời trang?'));
    layout();
    if (state.mode === 'exam') {
      timer = new Countdown(state.remaining, {
        onTick: (r) => {
          const t = $('#timer', el);
          if (t) {
            t.textContent = fmtTime(r);
            t.classList.toggle('low', r <= 300);
          }
          if (Math.round(r) === 600) toast('Còn 10 phút.');
          if (Math.round(r) % 15 === 0) persist();
        },
        onEnd: () => {
          toast('Hết giờ — bài làm đã được nộp tự động.', 'bad');
          submit(true);
        },
      });
      timer.start();
    }
  }

  function layout() {
    el.innerHTML = String(html`
      <div class="testbar">
        <strong class="small">${test.title}</strong>
        <div class="tabs" role="tablist">${test.passages.map((p, i) => html`<button role="tab" data-p="${i}" class="${i === state.passage ? 'on' : ''}">Passage ${i + 1}</button>`)}</div>
        <span class="spacer"></span>
        ${state.mode === 'exam' && !state.result ? html`<span class="timer" id="timer" aria-live="off">${fmtTime(state.remaining)}</span>` : ''}
        ${state.result ? html`<a class="btn sm" href="#/reading">Xong</a>` : html`<button class="btn primary sm" id="submit">Nộp bài</button>`}
      </div>
      <div id="resultBox"></div>
      <div class="split">
        <article class="pane passage" id="passage"></article>
        <section class="pane" id="questions"></section>
      </div>
      <div class="card" style="margin-top:1rem"><div id="nav"></div></div>
    `);
    drawPassage();
    $$('[data-p]', el).forEach((b) => (b.onclick = () => switchPassage(Number(b.dataset.p))));
    const sb = $('#submit', el);
    if (sb) sb.onclick = () => submit(false);
    bindInputs($('#questions', el), state.responses, () => {
      updateNav(el, state.responses);
      persist();
    });
    bindJump(el, (n) => {
      const p = passageOf(n);
      if (p !== state.passage) switchPassage(p);
    });
    bindHighlight($('#passage', el));
    // Dictionary on double-click: only in practice mode or after submitting (never in timed exam conditions)
    closeDict?.();
    closeDict = bindLookupPopup($('#passage', el), () => state.mode === 'practice' || !!state.result);
  }

  function switchPassage(i) {
    state.passage = i;
    $$('[data-p]', el).forEach((b) => b.classList.toggle('on', Number(b.dataset.p) === i));
    drawPassage();
    $('#passage', el).scrollTop = 0;
    $('#questions', el).scrollTop = 0;
  }

  function drawPassage() {
    const p = test.passages[state.passage];
    const letters = 'ABCDEFGHIJ';
    $('#passage', el).innerHTML = String(html`
      <p class="small muted" style="font-family:var(--font)">READING PASSAGE ${state.passage + 1} — Questions ${p.groups[0].range[0]}–${p.groups.at(-1).range[1]}</p>
      <h2>${p.title}</h2>
      ${p.paragraphs.map((t, i) => html`<p>${p.labelled ? html`<span class="plabel">${letters[i]}</span>` : ''}${t}</p>`)}
    `);
    $('#questions', el).innerHTML = String(renderGroups(p.groups, state.responses, { review: !!state.result, result: state.result }));
    $('#nav', el).innerHTML = String(html`<p class="small muted" style="margin-bottom:.4rem">Bảng câu hỏi (bấm để chuyển nhanh):</p>${navBar(numbers, state.responses, state.result)}`);
  }

  function submit(auto) {
    if (state.result) return;
    const unanswered = numbers.filter((n) => !String(state.responses[n] ?? '').trim()).length;
    if (!auto && unanswered && !confirm(`Còn ${unanswered} câu chưa trả lời. Nộp bài?`)) return;
    timer?.stop();
    const result = grade(groupsAll, state.responses);
    state.result = result;
    const band = rawToBand(result.correct, 'academicReading');
    const breakdown = typeBreakdown(groupsAll, result.per);
    const used = state.mode === 'exam' ? test.minutes * 60 - Math.round(timer?.remaining ?? 0) : null;
    store.addAttempt({ skill: 'reading', ref: test.id, title: test.title, raw: result.correct, total: result.total, band, detail: { breakdown, mode: state.mode, seconds: used } });
    store.update((s) => delete s.inProgress[test.id]);
    setLeaveGuard(null);
    layout();
    $('#resultBox', el).innerHTML = String(html`
      <div class="card" style="margin-bottom:1rem">
        <div class="row">
          <div class="stat"><span class="l">Điểm thô</span><span class="v">${result.correct}/${result.total}</span></div>
          <div class="stat" style="margin-left:1.5rem"><span class="l">Band ước tính</span><span class="v"><span class="band ${bandClass(band)}">${fmtBand(band)}</span></span></div>
          ${used != null ? html`<div class="stat" style="margin-left:1.5rem"><span class="l">Thời gian</span><span class="v">${fmtTime(used)}</span></div>` : ''}
        </div>
        <div class="table-wrap" style="margin-top:.8rem"><table class="data"><thead><tr><th>Dạng câu hỏi</th><th>Đúng</th><th>Tỷ lệ</th></tr></thead><tbody>
          ${Object.entries(breakdown).map(([k, v]) => html`<tr><td>${k}</td><td>${v.correct}/${v.total}</td><td>${Math.round((v.correct / v.total) * 100)}%</td></tr>`)}
        </tbody></table></div>
        <p class="small muted" style="margin-top:.6rem">Xem lại từng passage bên dưới: mỗi câu có giải thích vị trí bằng chứng trong bài. Ưu tiên ôn dạng câu hỏi có tỷ lệ đúng thấp nhất.</p>
      </div>`);
    window.scrollTo(0, 0);
  }

  intro();
  return () => {
    timer?.stop();
    closeDict?.();
    if (state.started && !state.result) {
      state.remaining = timer?.remaining ?? state.remaining;
      clearTimeout(saveT);
      store.update((s) => {
        s.inProgress[test.id] = { responses: state.responses, remaining: Math.round(state.remaining), mode: state.mode, savedAt: Date.now() };
      });
    }
  };
}

/** Allow highlighting text in the passage (like the computer-delivered test). */
export function bindHighlight(container) {
  container.addEventListener('mouseup', (e) => {
    if (e.detail >= 2) return; // double-click is reserved for dictionary lookup
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return;
    try {
      const mark = document.createElement('mark');
      range.surroundContents(mark);
      sel.removeAllRanges();
    } catch {
      // selection spans multiple elements — ignore silently
    }
  });
  container.addEventListener('click', (e) => {
    const m = e.target.closest('mark');
    if (!m || !window.getSelection().isCollapsed) return;
    m.replaceWith(...m.childNodes);
  });
}
