import { html, raw, $, Stopwatch, fmtTime, toast, bandClass, fmtBand, fmtDate } from '../ui.js';
import { store } from '../store.js';
import { task1Academic, task1General, task2, writingLanguageBank } from '../data/writing.js';
import { writingCriteria } from '../data/descriptors.js';
import { analyzeWriting, criteriaBand, wordCount } from '../scoring.js';
import { lineChart, barChart } from '../charts.js';

const ALL = [...task1Academic.map((t) => ({ ...t, task: 1, module: 'academic' })), ...task1General.map((t) => ({ ...t, task: 1, module: 'general' })), ...task2.map((t) => ({ ...t, task: 2, module: 'both' }))];

export function render(el, id) {
  if (!id) return renderList(el);
  const t = ALL.find((x) => x.id === id);
  if (!t) {
    el.innerHTML = String(html`<div class="alert bad">Không tìm thấy đề.</div>`);
    return;
  }
  return renderTask(el, t);
}

function renderList(el) {
  const s = store.get();
  const gt = s.profile.module === 'general';
  const done = (id) => s.attempts.filter((a) => a.ref === id);
  const item = (t) => {
    const d = done(t.id);
    const draft = s.drafts[t.id];
    return html`<a class="card linkcard" href="#/writing/${t.id}">
      <div class="row small"><span class="tag primary">Task ${t.task}</span>${t.type ? html`<span class="tag">${t.type}</span>` : ''}${t.tone ? html`<span class="tag">${t.tone}</span>` : ''}${t.model ? html`<span class="tag">có bài mẫu</span>` : ''}</div>
      <h3 style="margin-top:.5rem">${t.title || t.topic}</h3>
      <p class="small muted">${t.prompt.split('\n')[0].slice(0, 160)}…</p>
      <p class="small">${d.length ? html`Đã làm ${d.length} lần · gần nhất <span class="band ${bandClass(d.at(-1).band)}">${fmtBand(d.at(-1).band)}</span>` : draft?.text ? `Bản nháp ${wordCount(draft.text)} từ` : ''}</p>
    </a>`;
  };
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Writing</h1><p>60 phút · Task 1 (≥150 từ, ~20 phút) + Task 2 (≥250 từ, ~40 phút). Task 2 có trọng số gấp đôi.</p></div></div>
    <h2>Task 1 — ${gt ? 'General Training (viết thư)' : 'Academic (mô tả dữ liệu)'}</h2>
    <div class="grid g3">${(gt ? task1General : task1Academic).map((t) => item({ ...t, task: 1 }))}</div>
    <details style="margin-top:.75rem"><summary>Xem Task 1 của ${gt ? 'Academic' : 'General Training'}</summary>
      <div class="grid g3">${(gt ? task1Academic : task1General).map((t) => item({ ...t, task: 1 }))}</div>
    </details>
    <h2 style="margin-top:1.5rem">Task 2 — Essay</h2>
    <div class="grid g3">${task2.map((t) => item({ ...t, task: 2 }))}</div>
    <div class="card" style="margin-top:1.5rem">
      <h3>Ngân hàng ngôn ngữ</h3>
      <div class="grid g2">${writingLanguageBank.map((b) => html`<div><h4>${b.title}</h4><ul class="ticks small">${b.items.map((i) => html`<li>${i}</li>`)}</ul></div>`)}</div>
    </div>
  `);
}

function visual(t) {
  if (t.kind === 'line') return raw(lineChart(t.chart, t.title));
  if (t.kind === 'bar') return raw(barChart(t.chart, t.title));
  if (t.kind === 'table')
    return html`<div class="table-wrap"><table class="data"><thead><tr>${t.table.head.map((h) => html`<th>${h}</th>`)}</tr></thead><tbody>${t.table.rows.map((r) => html`<tr>${r.map((c) => html`<td>${c}</td>`)}</tr>`)}</tbody></table></div>`;
  if (t.kind === 'process') return html`<ol class="process">${t.steps.map((s) => html`<li>${s}</li>`)}</ol>`;
  return '';
}

function renderTask(el, t) {
  const draft = store.get().drafts[t.id] || { text: '' };
  const minutes = t.task === 1 ? 20 : 40;
  const min = t.task === 1 ? 150 : 250;
  const crit = t.task === 1 ? ['TA', 'CC', 'LR', 'GRA'] : ['TR', 'CC', 'LR', 'GRA'];
  const sw = new Stopwatch((e) => {
    const tm = $('#tm', el);
    if (!tm) return;
    const left = minutes * 60 - e;
    tm.textContent = left >= 0 ? `Còn ${fmtTime(left)}` : `Quá giờ ${fmtTime(-left)}`;
    tm.classList.toggle('low', left < 120);
  });
  let saveT;

  el.innerHTML = String(html`
    <div class="page-head"><div><p><a href="#/writing">← Writing</a></p><h1>${t.title || `Task 2 — ${t.topic}`}</h1>
      <p>Task ${t.task}${t.type ? ` · ${t.type}` : ''} · tối thiểu ${min} từ · gợi ý ${minutes} phút</p></div></div>
    <div class="split">
      <div class="pane stack">
        <div class="prompt-box">${t.prompt}</div>
        ${t.kind || t.table ? html`<div>${visual(t)}</div>` : ''}
        ${t.kind ? html`<p class="small muted">Dữ liệu minh họa cho mục đích luyện tập.</p>` : ''}
        ${t.model ? html`<details><summary>Bài mẫu tham khảo (band 8+) & chú giải</summary><div class="model">${t.model}</div><h4 style="margin-top:.8rem">Vì sao bài này đạt điểm cao</h4><ul class="ticks small">${t.notes.map((n) => html`<li>${n}</li>`)}</ul><p class="small muted">${wordCount(t.model)} từ. Nên tự viết trước rồi mới đọc bài mẫu.</p></details>` : ''}
      </div>
      <div class="pane editor">
        <div class="row" style="margin-bottom:.5rem">
          <span class="wc" id="wc"></span><span class="spacer"></span>
          <span class="timer" id="tm">${minutes}:00</span>
          <button class="btn sm" id="timerBtn">▶ Bấm giờ</button>
        </div>
        <textarea id="text" spellcheck="false" placeholder="Viết bài của bạn ở đây… (đã tắt kiểm tra chính tả để giống điều kiện thi)" aria-label="Bài viết">${draft.text}</textarea>
        <div class="row" style="margin-top:.6rem">
          <span class="small muted" id="saved">Tự động lưu nháp</span><span class="spacer"></span>
          <button class="btn" id="clear">Xóa</button>
          <button class="btn primary" id="analyze">Phân tích & tự chấm</button>
        </div>
      </div>
    </div>
    <div id="report"></div>
    <div id="history"></div>
  `);

  const ta = $('#text', el);
  const updateWc = () => {
    const n = wordCount(ta.value);
    const wc = $('#wc', el);
    wc.textContent = `${n} từ`;
    wc.classList.toggle('under', n < min);
  };
  updateWc();
  ta.addEventListener('input', () => {
    updateWc();
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      store.update((s) => (s.drafts[t.id] = { text: ta.value, at: Date.now() }));
      $('#saved', el).textContent = `Đã lưu nháp lúc ${new Date().toLocaleTimeString('vi-VN')}`;
    }, 700);
  });
  let running = false;
  $('#timerBtn', el).onclick = () => {
    running = !running;
    if (running) sw.start();
    else sw.stop();
    $('#timerBtn', el).textContent = running ? '⏸ Dừng' : '▶ Tiếp tục';
  };
  $('#clear', el).onclick = () => {
    if (ta.value && !confirm('Xóa toàn bộ bài viết?')) return;
    ta.value = '';
    ta.dispatchEvent(new Event('input'));
  };
  $('#analyze', el).onclick = () => {
    if (wordCount(ta.value) < 20) return toast('Hãy viết ít nhất vài câu trước khi phân tích.', 'bad');
    showReport();
  };

  function showReport() {
    const a = analyzeWriting(ta.value, { task: t.task, module: t.module === 'general' ? 'general' : 'academic' });
    const rep = $('#report', el);
    rep.innerHTML = String(html`
      <div class="grid g2" style="margin-top:1rem">
        <div class="card">
          <h3>Phân tích văn bản tự động</h3>
          <p class="small muted">Các chỉ số dưới đây là <strong>chỉ báo</strong> giúp bạn tự soát lỗi, KHÔNG phải điểm chính thức. Band IELTS do giám khảo đánh giá dựa trên chất lượng nội dung và ngôn ngữ.</p>
          <div class="metric"><span>Số từ</span><strong class="${a.words < a.min ? 'wc under' : ''}">${a.words} / tối thiểu ${a.min}</strong></div>
          <div class="metric"><span>Số đoạn</span><strong>${a.paragraphs}</strong></div>
          <div class="metric"><span>Số câu · độ dài TB</span><strong>${a.sentences} · ${a.avgSentence} từ/câu</strong></div>
          <div class="metric"><span>Độ đa dạng độ dài câu (SD)</span><strong>${a.sentenceSd}</strong></div>
          <div class="metric"><span>Độ đa dạng từ vựng (MATTR)</span><strong>${a.mattr}</strong></div>
          <div class="metric"><span>Từ nối (số lượng · nhóm chức năng)</span><strong>${a.linkerTotal} · ${a.linkerCategories}/7</strong></div>
          ${Object.keys(a.linkers).length ? html`<p class="small" style="margin-top:.5rem">Đã dùng: ${Object.entries(a.linkers).map(([k, v]) => `${k} (${v.count})`).join(', ')}</p>` : ''}
          ${a.warnings.length ? html`<div class="alert bad small" style="margin-top:.6rem"><ul class="ticks">${a.warnings.map((w) => html`<li>${w}</li>`)}</ul></div>` : ''}
          ${a.tips.length ? html`<div class="alert warn small" style="margin-top:.6rem"><ul class="ticks">${a.tips.map((w) => html`<li>${w}</li>`)}</ul></div>` : ''}
          ${!a.warnings.length && !a.tips.length ? html`<div class="alert ok small" style="margin-top:.6rem">Không phát hiện vấn đề hình thức rõ ràng. Hãy tự chấm nội dung theo band descriptors.</div>` : ''}
        </div>
        <form class="card" id="selfForm">
          <h3>Tự chấm theo band descriptors</h3>
          <p class="small muted">Đọc lại bài và chọn mô tả <em>phù hợp nhất</em> cho từng tiêu chí. Hãy khắt khe: một bài đạt band 7 phải thỏa <em>tất cả</em> đặc điểm của band 7.</p>
          <div class="criteria-pick">${crit.map(
            (c) => html`<fieldset><legend>${writingCriteria[c].name}</legend><div class="band-opts">${[9, 8, 7, 6, 5, 4].map(
              (b) => html`<label><input type="radio" name="${c}" value="${b}" required><b>${b}</b><span>${writingCriteria[c].bands[b]}</span></label>`,
            )}</div></fieldset>`,
          )}</div>
          <div class="row" style="margin-top:1rem"><span>Band Task ${t.task}: <span class="band band-none" id="tb">–</span></span><span class="spacer"></span><button class="btn primary" type="submit">Lưu kết quả</button></div>
          <p class="small muted">Band của Task = trung bình 4 tiêu chí (làm tròn xuống nửa band — ước tính thận trọng).</p>
        </form>
      </div>`);
    const form = $('#selfForm', el);
    const vals = () => crit.map((c) => Number(form.querySelector(`input[name=${c}]:checked`)?.value)).filter((x) => !Number.isNaN(x));
    form.addEventListener('change', () => {
      const v = vals();
      if (v.length === 4) {
        const b = criteriaBand(v);
        $('#tb', el).textContent = fmtBand(b);
        $('#tb', el).className = `band ${bandClass(b)}`;
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = vals();
      if (v.length !== 4) return toast('Hãy chọn band cho cả 4 tiêu chí.', 'bad');
      const band = criteriaBand(v);
      store.addAttempt({ skill: 'writing', ref: t.id, title: t.title || `Task 2 — ${t.topic}`, band, detail: { task: t.task, criteria: v, words: a.words, seconds: Math.round(sw.elapsed), text: ta.value } });
      toast(`Đã lưu: Task ${t.task} band ${fmtBand(band)}`, 'ok');
      drawHistory();
    });
    rep.scrollIntoView({ behavior: 'smooth' });
  }

  function drawHistory() {
    const list = store.get().attempts.filter((a) => a.ref === t.id).reverse();
    $('#history', el).innerHTML = list.length
      ? String(html`<div class="card" style="margin-top:1rem"><h3>Lịch sử bài viết</h3>${list.map(
          (a) => html`<details><summary>${fmtDate(a.date)} · ${a.detail.words} từ · <span class="band ${bandClass(a.band)}">${fmtBand(a.band)}</span> <span class="small muted">(${crit.map((c, i) => `${c} ${a.detail.criteria[i]}`).join(' · ')})</span></summary><div class="model">${a.detail.text}</div></details>`,
        )}</div>`)
      : '';
  }
  drawHistory();

  return () => {
    sw.stop();
    clearTimeout(saveT);
    store.update((s) => (s.drafts[t.id] = { text: ta.value, at: Date.now() }));
  };
}


