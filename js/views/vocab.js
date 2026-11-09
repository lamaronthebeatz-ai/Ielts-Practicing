import { html, $, $$, toast } from '../ui.js';
import { store, markActivity } from '../store.js';
import { vocab, grammarNotes } from '../data/vocab.js';
import { srsReview } from '../scoring.js';
import { say } from '../tts.js';

const topics = [...new Set(vocab.map((v) => v.topic))];

export function render(el, sub) {
  if (sub === 'review') return renderReview(el);
  const s = store.get();
  const due = vocab.filter((v) => !s.srs[v.id] || s.srs[v.id].due <= Date.now());
  const learned = vocab.filter((v) => (s.srs[v.id]?.interval || 0) >= 21).length;
  let topic = 'all';
  let q = '';

  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Từ vựng & Ngữ pháp</h1><p>${vocab.length} từ/cụm từ học thuật theo chủ đề Task 2 & Speaking Part 3, kèm collocation.</p></div>
      <a class="btn primary" href="#/vocab/review">Ôn thẻ (${due.length} đến hạn)</a></div>
    <div class="grid g4">
      <div class="card stat"><span class="l">Tổng số thẻ</span><span class="v">${vocab.length}</span></div>
      <div class="card stat"><span class="l">Đã học</span><span class="v">${Object.keys(s.srs).length}</span></div>
      <div class="card stat"><span class="l">Thuộc lâu dài (≥ 21 ngày)</span><span class="v">${learned}</span></div>
      <div class="card stat"><span class="l">Đến hạn ôn</span><span class="v">${due.length}</span></div>
    </div>
    <div class="card" style="margin-top:1rem">
      <div class="row" style="margin-bottom:.8rem">
        <select id="topic" aria-label="Chủ đề"><option value="all">Tất cả chủ đề</option>${topics.map((t) => html`<option>${t}</option>`)}</select>
        <input type="text" id="q" placeholder="Tìm từ hoặc nghĩa…" aria-label="Tìm kiếm" style="flex:1;min-width:180px">
      </div>
      <div class="vlist" id="list"></div>
    </div>
    <div class="card" style="margin-top:1rem">
      <h3>Ngữ pháp trọng tâm cho band 7+</h3>
      ${grammarNotes.map((g) => html`<details><summary>${g.title}</summary><p>${g.body}</p></details>`)}
    </div>
  `);

  const draw = () => {
    const list = vocab.filter((v) => (topic === 'all' || v.topic === topic) && (!q || `${v.w} ${v.vi}`.toLowerCase().includes(q)));
    $('#list', el).innerHTML = String(
      list.length
        ? html`${list.map(
            (v) => html`<div class="vitem">
              <div><span class="w">${v.w}</span> <span class="muted small">(${v.pos})</span> — ${v.vi}</div>
              <button class="btn sm ghost" data-say="${v.w}" aria-label="Phát âm ${v.w}">🔊</button>
              <div class="small"><em>${v.ex}</em></div><div></div>
              <div class="small muted">Collocations: ${v.col}</div>
            </div>`,
          )}`
        : html`<p class="muted">Không có kết quả.</p>`,
    );
  };
  $('#topic', el).onchange = (e) => {
    topic = e.target.value;
    draw();
  };
  $('#q', el).oninput = (e) => {
    q = e.target.value.trim().toLowerCase();
    draw();
  };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (b) say(b.dataset.say);
  });
  draw();
}

function renderReview(el) {
  const s = store.get();
  const now = Date.now();
  // due reviews first (oldest due first), then up to 10 new cards
  const dueOld = vocab.filter((v) => s.srs[v.id] && s.srs[v.id].due <= now).sort((a, b) => s.srs[a.id].due - s.srs[b.id].due);
  const fresh = vocab.filter((v) => !s.srs[v.id]).slice(0, 10);
  const queue = [...dueOld, ...fresh];
  let i = 0;
  let flipped = false;
  let reviewed = 0;

  const draw = () => {
    if (i >= queue.length) {
      el.innerHTML = String(html`<div class="card" style="max-width:640px;margin:auto;text-align:center">
        <h2>🎉 Hoàn thành!</h2><p>Bạn đã ôn ${reviewed} thẻ. Các thẻ sẽ quay lại đúng thời điểm bạn sắp quên (lặp lại ngắt quãng).</p>
        <div class="row" style="justify-content:center"><a class="btn primary" href="#/vocab">Về danh sách từ</a><a class="btn" href="#/">Tổng quan</a></div></div>`);
      return;
    }
    const v = queue[i];
    el.innerHTML = String(html`
      <div style="max-width:640px;margin:auto">
        <div class="row" style="margin-bottom:.6rem"><a href="#/vocab">← Từ vựng</a><span class="spacer"></span><span class="tag">${i + 1}/${queue.length}</span><span class="tag">${v.topic}</span></div>
        <div class="card flash">
          <div class="face">
            <div class="word">${v.w}</div><div class="muted">(${v.pos})</div>
            <button class="btn sm" id="speak">🔊 Phát âm</button>
            ${flipped
              ? html`<hr style="width:100%;border:0;border-top:1px solid var(--border)">
                <div style="font-size:1.2rem;font-weight:600">${v.vi}</div>
                <div><em>${v.ex}</em></div>
                <div class="small muted">Collocations: ${v.col}</div>`
              : html`<p class="muted small">Nhớ lại nghĩa và một collocation, rồi lật thẻ.</p>`}
          </div>
        </div>
        <div class="row" style="justify-content:center;margin-top:1rem">
          ${flipped
            ? html`<button class="btn danger" data-g="0">Quên (0)</button><button class="btn" data-g="3">Khó (3)</button><button class="btn primary" data-g="4">Nhớ (4)</button><button class="btn" data-g="5">Dễ (5)</button>`
            : html`<button class="btn primary" id="flip">Lật thẻ (Space)</button>`}
        </div>
        <p class="small muted" style="text-align:center">Phím tắt: Space = lật · 1 = Quên · 2 = Khó · 3 = Nhớ · 4 = Dễ</p>
      </div>`);
    $('#speak', el).onclick = () => say(v.w);
    const f = $('#flip', el);
    if (f) f.onclick = flip;
    $$('[data-g]', el).forEach((b) => (b.onclick = () => rate(Number(b.dataset.g))));
  };
  const flip = () => {
    flipped = true;
    draw();
  };
  const rate = (g) => {
    const v = queue[i];
    store.update((st) => {
      st.srs[v.id] = srsReview(st.srs[v.id], g);
      markActivity();
    });
    reviewed++;
    if (g < 3) queue.push(v); // see it again in this session
    i++;
    flipped = false;
    draw();
  };
  const onKey = (e) => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.code === 'Space' && !flipped) {
      e.preventDefault();
      flip();
    } else if (flipped && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
      rate([0, 3, 4, 5][Number(e.code.slice(-1)) - 1]);
    }
  };
  document.addEventListener('keydown', onKey);
  if (!queue.length) toast('Không có thẻ nào đến hạn.');
  draw();
  return () => document.removeEventListener('keydown', onKey);
}
