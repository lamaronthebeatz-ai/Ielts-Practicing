import { html, $, $$, toast } from '../ui.js';
import { store, markActivity } from '../store.js';
import { chapters, topics } from '../data/grammar/index.js';

export function render(el, id) {
  if (id) {
    const t = topics.find((x) => x.id === id);
    if (t) return renderTopic(el, t);
  }
  return renderIndex(el);
}

function renderIndex(el) {
  const prog = store.get().grammar || {};
  const done = topics.filter((t) => prog[t.id]?.best === t.quiz.length).length;
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Ngữ pháp tiếng Anh học thuật</h1>
      <p>${topics.length} chủ điểm trong ${chapters.length} chương — mỗi chủ điểm gồm giải nghĩa, công thức, cách dùng có ví dụ, ứng dụng thực chiến cho IELTS, lỗi thường gặp và bài tập kiểm tra.</p></div>
      <span class="tag primary">Hoàn thành ${done}/${topics.length}</span></div>
    <div class="card"><input type="text" id="gq" placeholder="Tìm chủ điểm (vd: bị động, whereas, so sánh, mạo từ…)" aria-label="Tìm chủ điểm ngữ pháp" style="width:100%"></div>
    <div id="glist"></div>
  `);
  const draw = (q = '') => {
    const match = (t) => !q || `${t.title} ${t.en} ${t.what} ${t.forms.map((f) => f.join(' ')).join(' ')}`.toLowerCase().includes(q);
    $('#glist', el).innerHTML = String(html`${chapters.map((c) => {
      const list = topics.filter((t) => t.ch === c.id && match(t));
      if (!list.length) return '';
      return html`<div class="card" style="margin-top:1rem"><h3>${c.title} <span class="muted small">· ${c.en}</span></h3>
        <div class="grid g3">${list.map((t) => {
          const p = prog[t.id];
          return html`<a class="linkcard gtopic" href="#/grammar/${t.id}">
            <strong>${t.title}</strong><span class="small muted">${t.en}</span>
            <span class="small">${p ? html`Bài tập: ${p.best}/${t.quiz.length} ${p.best === t.quiz.length ? '✓' : ''}` : 'Chưa học'}</span></a>`;
        })}</div></div>`;
    })}`);
  };
  $('#gq', el).oninput = (e) => draw(e.target.value.trim().toLowerCase());
  draw();
}

function renderTopic(el, t) {
  const idx = topics.indexOf(t);
  const prev = topics[idx - 1];
  const next = topics[idx + 1];
  const ch = chapters.find((c) => c.id === t.ch);
  const answers = {};
  el.innerHTML = String(html`
    <p class="small"><a href="#/grammar">← Ngữ pháp</a> · ${ch?.title}</p>
    <div class="page-head"><div><h1>${t.title}</h1><p>${t.en}</p></div></div>
    <div class="stack">
      <div class="card"><h3>1. Giải nghĩa</h3><p>${t.what}</p></div>
      <div class="card"><h3>2. Công thức</h3>
        <div class="table-wrap"><table class="data formulas"><tbody>${t.forms.map(([k, v]) => html`<tr><th>${k}</th><td><code>${v}</code></td></tr>`)}</tbody></table></div></div>
      <div class="card"><h3>3. Cách dùng & ví dụ</h3>
        <ul class="clean">${t.uses.map(([u, ex]) => html`<li class="use"><strong>${u}</strong><div class="ex">${ex}</div></li>`)}</ul></div>
      <div class="card"><h3>4. Thực chiến IELTS</h3><ul class="ticks">${t.ielts.map((x) => html`<li>${x}</li>`)}</ul></div>
      <div class="card"><h3>5. Lỗi thường gặp</h3>
        <div class="table-wrap"><table class="data"><thead><tr><th>✗ Sai</th><th>✓ Đúng</th><th>Vì sao</th></tr></thead><tbody>
        ${t.mistakes.map(([w, r, n]) => html`<tr><td class="wrong">${w}</td><td class="right">${r}</td><td class="small">${n}</td></tr>`)}</tbody></table></div></div>
      <form class="card" id="quiz"><h3>6. Bài tập kiểm tra</h3>
        ${t.quiz.map(([q, opts], i) => html`<div class="q" role="group" aria-label="Câu ${i + 1}" id="gq-${i}">
          <div class="q-line"><span class="qn">${i + 1}</span><span>${q}</span></div>
          <div class="mcq">${opts.map((o, k) => html`<label class="opt"><input type="radio" name="g${i}" value="${k}"><span>${o}</span></label>`)}</div>
          <div class="review-slot"></div></div>`)}
        <div class="row"><button class="btn primary">Kiểm tra</button><button class="btn" type="button" id="reset">Làm lại</button><span id="score" class="spacer"></span></div>
      </form>
      <div class="row">
        ${prev ? html`<a class="btn" href="#/grammar/${prev.id}">← ${prev.title}</a>` : ''}<span class="spacer"></span>
        ${next ? html`<a class="btn primary" href="#/grammar/${next.id}">${next.title} →</a>` : ''}
      </div>
    </div>
  `);
  const form = $('#quiz', el);
  form.addEventListener('change', (e) => {
    if (e.target.name) answers[e.target.name.slice(1)] = Number(e.target.value);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < t.quiz.length) return toast('Hãy trả lời tất cả câu hỏi.', 'bad');
    let score = 0;
    t.quiz.forEach(([, opts, ans, why], i) => {
      const ok = answers[i] === ans;
      if (ok) score++;
      const fs = $(`#gq-${i}`, el);
      fs.classList.toggle('is-ok', ok);
      fs.classList.toggle('is-bad', !ok);
      $('.review-slot', fs).innerHTML = String(html`<div class="review ${ok ? 'ok' : 'bad'}"><strong>${ok ? '✓ Đúng' : '✗ Sai'}</strong> · Đáp án: <strong>${opts[ans]}</strong><div class="explain">${why}</div></div>`);
    });
    $('#score', el).textContent = `Kết quả: ${score}/${t.quiz.length}`;
    store.update((s) => {
      s.grammar ||= {};
      const prevBest = s.grammar[t.id]?.best || 0;
      s.grammar[t.id] = { best: Math.max(prevBest, score), last: score, at: Date.now() };
      markActivity();
    });
  });
  $('#reset', el).onclick = () => {
    form.reset();
    for (const k of Object.keys(answers)) delete answers[k];
    $$('.q', form).forEach((f) => {
      f.classList.remove('is-ok', 'is-bad');
      $('.review-slot', f).innerHTML = '';
    });
    $('#score', el).textContent = '';
  };
}
