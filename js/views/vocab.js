import { html, $, $$, toast } from '../ui.js';
import { store, markActivity } from '../store.js';
import { vocab } from '../data/vocab.js';
import { srsReview } from '../scoring.js';
import { say } from '../tts.js';
import { lookup, renderEntry, playAudio, cleanWord } from '../dictionary.js';

/** Built-in topic words plus the learner's own words added from the dictionary. */
export function allVocab() {
  return [...vocab, ...(store.get().customVocab || [])];
}

export function render(el, sub) {
  if (sub === 'review') return renderReview(el);
  const s = store.get();
  const words = allVocab();
  const topics = [...new Set(words.map((v) => v.topic))];
  const due = words.filter((v) => !s.srs[v.id] || s.srs[v.id].due <= Date.now());
  const learned = words.filter((v) => (s.srs[v.id]?.interval || 0) >= 21).length;
  let topic = 'all';
  let q = '';

  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Từ vựng & Từ điển</h1><p>Tra từ điển thực (phiên âm IPA, phát âm Anh–Anh/Anh–Mỹ, định nghĩa, ví dụ, đồng nghĩa) và liên kết Cambridge Dictionary Anh–Việt, Oxford Learner's.</p></div>
      <a class="btn primary" href="#/vocab/review">Ôn thẻ (${due.length} đến hạn)</a></div>

    <form class="card" id="dictForm">
      <h3>📘 Tra từ điển</h3>
      <div class="row"><input type="text" id="dq" placeholder="Nhập từ tiếng Anh, vd: mitigate" aria-label="Từ cần tra" autocomplete="off" autocapitalize="off" style="flex:1;min-width:200px"><button class="btn primary">Tra</button></div>
      <div id="dictOut" style="margin-top:.8rem"></div>
    </form>

    <div class="grid g4" style="margin-top:1rem">
      <div class="card stat"><span class="l">Tổng số thẻ</span><span class="v">${words.length}</span></div>
      <div class="card stat"><span class="l">Từ của tôi</span><span class="v">${(s.customVocab || []).length}</span></div>
      <div class="card stat"><span class="l">Thuộc lâu dài (≥ 21 ngày)</span><span class="v">${learned}</span></div>
      <div class="card stat"><span class="l">Đến hạn ôn</span><span class="v">${due.length}</span></div>
    </div>
    <div class="card" style="margin-top:1rem">
      <h3>Từ vựng học thuật theo chủ đề</h3>
      <p class="small muted">Bấm vào một từ để xem mục từ điển đầy đủ.</p>
      <div class="row" style="margin-bottom:.8rem">
        <select id="topic" aria-label="Chủ đề"><option value="all">Tất cả chủ đề</option>${topics.map((t) => html`<option>${t}</option>`)}</select>
        <input type="text" id="q" placeholder="Lọc từ hoặc nghĩa…" aria-label="Lọc" style="flex:1;min-width:180px">
      </div>
      <div class="vlist" id="list"></div>
    </div>
    <p class="small muted" style="margin-top:1rem">Ngữ pháp đã được chuyển sang mục riêng: <a href="#/grammar">Ngữ pháp học thuật →</a></p>
  `);

  const showEntry = async (word, target) => {
    target.innerHTML = String(html`<p class="muted small">Đang tra “${word}”…</p>`);
    const r = await lookup(word);
    const inDeck = r.entry && allVocab().some((v) => v.w.toLowerCase() === r.entry.word.toLowerCase());
    target.innerHTML = String(renderEntry(word, r, { addable: !!r.entry && !inDeck }));
  };

  $('#dictForm', el).addEventListener('submit', (e) => {
    e.preventDefault();
    const w = cleanWord($('#dq', el).value);
    if (w) showEntry(w, $('#dictOut', el));
  });

  const draw = () => {
    const list = allVocab().filter((v) => (topic === 'all' || v.topic === topic) && (!q || `${v.w} ${v.vi}`.toLowerCase().includes(q)));
    $('#list', el).innerHTML = String(
      list.length
        ? html`${list.map(
            (v) => html`<div class="vitem">
              <div><button class="linklike w" data-entry="${v.w}">${v.w}</button> <span class="muted small">(${v.pos})</span> — ${v.vi}</div>
              <div class="row" style="gap:.2rem">
                <button class="btn sm ghost" data-say="${v.w}" aria-label="Phát âm ${v.w}">🔊</button>
                ${v.id.startsWith('custom:') ? html`<button class="btn sm ghost" data-remove="${v.id}" aria-label="Xoá ${v.w}">🗑</button>` : ''}
              </div>
              ${v.ex ? html`<div class="small"><em>${v.ex}</em></div><div></div>` : ''}
              ${v.col ? html`<div class="small muted">${v.id.startsWith('custom:') ? 'Đồng nghĩa' : 'Collocations'}: ${v.col}</div>` : ''}
              <div class="entry-slot" style="grid-column:1/-1"></div>
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

  el.addEventListener('click', async (e) => {
    const t = e.target;
    const sayB = t.closest('[data-say]');
    if (sayB) return say(sayB.dataset.say);
    const audio = t.closest('[data-audio]');
    if (audio) return playAudio(audio.dataset.audio);
    const entry = t.closest('[data-entry]');
    if (entry) {
      const slot = $('.entry-slot', entry.closest('.vitem'));
      if (slot.innerHTML) slot.innerHTML = '';
      else showEntry(entry.dataset.entry, slot);
      return;
    }
    const lk = t.closest('[data-lookup]');
    if (lk) {
      e.preventDefault();
      $('#dq', el).value = lk.dataset.lookup;
      showEntry(lk.dataset.lookup, $('#dictOut', el));
      $('#dictForm', el).scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const add = t.closest('[data-add-word]');
    if (add) {
      const r = await lookup(add.dataset.addWord);
      if (!r.entry) return;
      const id = `custom:${r.entry.word}`;
      if (allVocab().some((v) => v.id === id || v.w.toLowerCase() === r.entry.word.toLowerCase())) return toast('Từ này đã có trong bộ thẻ.');
      const m = r.entry.meanings[0];
      store.update((s) => {
        s.customVocab ||= [];
        s.customVocab.push({ id, topic: 'Từ của tôi', w: r.entry.word, pos: m?.pos || '', vi: m?.defs[0]?.d || '', ex: m?.defs.find((d) => d.ex)?.ex || '', col: (m?.synonyms || []).slice(0, 5).join(', ') });
      });
      toast(`Đã thêm “${r.entry.word}” vào thẻ ôn.`, 'ok');
      draw();
      return;
    }
    const rm = t.closest('[data-remove]');
    if (rm && confirm('Xoá từ này khỏi bộ thẻ?')) {
      store.update((s) => {
        s.customVocab = (s.customVocab || []).filter((v) => v.id !== rm.dataset.remove);
        delete s.srs[rm.dataset.remove];
      });
      draw();
    }
  });
  draw();
}

function renderReview(el) {
  const s = store.get();
  const now = Date.now();
  const words = allVocab();
  const dueOld = words.filter((v) => s.srs[v.id] && s.srs[v.id].due <= now).sort((a, b) => s.srs[a.id].due - s.srs[b.id].due);
  const fresh = words.filter((v) => !s.srs[v.id]).slice(0, 10);
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
                ${v.ex ? html`<div><em>${v.ex}</em></div>` : ''}
                ${v.col ? html`<div class="small muted">${v.col}</div>` : ''}
                <button class="btn sm ghost" id="more">📘 Xem từ điển</button><div id="dict" style="text-align:left;width:100%"></div>`
              : html`<p class="muted small">Nhớ lại nghĩa và một collocation, rồi lật thẻ.</p>`}
          </div>
        </div>
        <div class="row" style="justify-content:center;margin-top:1rem">
          ${flipped
            ? html`<button class="btn danger" data-g="0">Quên</button><button class="btn" data-g="3">Khó</button><button class="btn primary" data-g="4">Nhớ</button><button class="btn" data-g="5">Dễ</button>`
            : html`<button class="btn primary" id="flip">Lật thẻ (Space)</button>`}
        </div>
        <p class="small muted" style="text-align:center">Phím tắt: Space = lật · 1 = Quên · 2 = Khó · 3 = Nhớ · 4 = Dễ</p>
      </div>`);
    $('#speak', el).onclick = () => say(v.w);
    const f = $('#flip', el);
    if (f) f.onclick = flip;
    const more = $('#more', el);
    if (more)
      more.onclick = async () => {
        const r = await lookup(v.w);
        $('#dict', el).innerHTML = String(renderEntry(v.w, r, { compact: true }));
      };
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
    if (g < 3) queue.push(v);
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
  const onAudio = (e) => {
    const a = e.target.closest('[data-audio]');
    if (a) playAudio(a.dataset.audio);
  };
  document.addEventListener('keydown', onKey);
  el.addEventListener('click', onAudio);
  if (!queue.length) toast('Không có thẻ nào đến hạn.');
  draw();
  return () => document.removeEventListener('keydown', onKey);
}
