// Cambridge IELTS practice mode.
// The questions, recordings and answer keys belong to Cambridge University Press &
// Assessment and are NOT bundled with this app. The learner uses their own copy of the
// book; the app provides the exam environment: answer sheet, timer, local audio player,
// marking against the key the learner types in once (stored only on this device),
// band conversion and progress tracking.
import { html, $, $$, Countdown, fmtTime, toast, setLeaveGuard, bandClass, fmtBand, fmtDate } from '../ui.js';
import { store } from '../store.js';
import { parseKeyText, gradeSheet, rawToBand } from '../scoring.js';

/** key format: l-<book>-t<test>  |  r-<ac|gt>-<book>-t<test> */
export function parseId(id) {
  let m = String(id).match(/^l-(\d{1,2})-t([1-4])$/);
  if (m) return { id, skill: 'listening', book: Number(m[1]), test: Number(m[2]), module: null };
  m = String(id).match(/^r-(ac|gt)-(\d{1,2})-t([1-4])$/);
  if (m) return { id, skill: 'reading', module: m[1], book: Number(m[2]), test: Number(m[3]) };
  return null;
}

export function camTitle(p) {
  return `Cambridge IELTS ${p.book}${p.module ? ` ${p.module === 'ac' ? 'Academic' : 'General Training'}` : ''} · Test ${p.test} · ${p.skill === 'listening' ? 'Listening' : 'Reading'}`;
}

export function render(el, id) {
  if (!id) return renderHome(el);
  const p = parseId(id);
  if (!p) {
    el.innerHTML = String(html`<div class="alert bad">Mã bài không hợp lệ. <a href="#/cambridge">Quay lại</a></div>`);
    return;
  }
  return renderSheet(el, p);
}

function renderHome(el) {
  const s = store.get();
  const done = s.attempts.filter((a) => a.ref?.startsWith('cam:')).reverse();
  const keys = Object.keys(s.cambridgeKeys || {});
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Luyện đề Cambridge IELTS</h1>
      <p>Làm bài từ sách Cambridge IELTS của bạn trong môi trường thi chuẩn: phiếu trả lời 40 câu, bấm giờ, chấm theo quy tắc IELTS, quy đổi band và theo dõi tiến độ theo từng cuốn/từng test.</p></div></div>

    <div class="alert info small">
      <strong>Vì sao ứng dụng không chứa sẵn đề Cambridge?</strong> Toàn bộ bài đọc, bài nghe, câu hỏi và đáp án của bộ Cambridge IELTS 1–20 thuộc bản quyền của Cambridge University Press & Assessment, nên không thể đăng công khai trên website này. Bạn dùng sách (bản in hoặc bản điện tử hợp pháp) và audio đi kèm; ứng dụng lo phần còn lại. Đáp án bạn nhập chỉ lưu trên thiết bị của bạn.
    </div>

    <div class="grid g2" style="margin-top:1rem">
      <form class="card stack" id="pick">
        <h3>Chọn bài</h3>
        <div class="grid g2">
          <label class="field">Kỹ năng<select name="skill"><option value="r">Reading</option><option value="l">Listening</option></select></label>
          <label class="field">Module (Reading)<select name="mod"><option value="ac" ${s.profile.module !== 'general' ? 'selected' : ''}>Academic</option><option value="gt" ${s.profile.module === 'general' ? 'selected' : ''}>General Training</option></select></label>
          <label class="field">Cambridge IELTS số (cuốn)<input type="number" name="book" min="1" max="30" value="20" required></label>
          <label class="field">Test<select name="test">${[1, 2, 3, 4].map((t) => html`<option value="${t}">Test ${t}</option>`)}</select></label>
        </div>
        <button class="btn primary">Mở phiếu trả lời →</button>
        <p class="small muted" style="margin:0">Mỗi cuốn Cambridge IELTS có 4 bài thi (Test 1–4). Các cuốn gần đây có ấn bản Academic và General Training riêng — chọn đúng module để quy đổi band theo đúng bảng.</p>
      </form>

      <div class="card">
        <h3>Writing & Speaking từ sách Cambridge</h3>
        <p class="small muted">Nhập đề Writing hoặc cue card Speaking từ sách để dùng trình soạn thảo có bấm giờ, phân tích bài viết, ghi âm và tự chấm theo band descriptors.</p>
        <div class="row"><a class="btn" href="#/writing/new">＋ Nhập đề Writing</a><a class="btn" href="#/speaking/new">＋ Nhập cue card Speaking</a></div>
        <h4 style="margin-top:1rem">Quy trình đề xuất</h4>
        <ol class="ticks small">
          <li>Mở phiếu trả lời, bật chế độ thi thật. Listening: chọn file audio của test (phát ngay trên máy, không tải lên đâu).</li>
          <li>Làm bài trên sách, ghi đáp án vào phiếu — như thi trên máy tính.</li>
          <li>Nộp bài → lần đầu nhập đáp án từ phần Answer Key cuối sách (dán nhanh dạng "1 library"). Các lần làm lại sẽ tự chấm.</li>
          <li>Xem câu sai, đối chiếu transcript/bài đọc trong sách để tìm nguyên nhân.</li>
        </ol>
      </div>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>Lịch sử luyện đề Cambridge</h3>
      ${done.length
        ? html`<div class="table-wrap"><table class="data"><thead><tr><th>Thời gian</th><th>Bài</th><th>Điểm</th><th>Band</th><th></th></tr></thead><tbody>
          ${done.map((a) => html`<tr><td>${fmtDate(a.date)}</td><td>${a.title}</td><td>${a.raw}/${a.total}</td><td><span class="band ${bandClass(a.band)}">${fmtBand(a.band)}</span></td><td><a class="btn sm" href="#/cambridge/${a.ref.slice(4)}">Làm lại</a></td></tr>`)}
          </tbody></table></div>`
        : html`<p class="muted">Chưa có bài nào.</p>`}
      ${keys.length ? html`<p class="small muted">Đã lưu đáp án cho ${keys.length} bài: ${keys.map((k) => camTitle(parseId(k))).join(' · ')}</p>` : ''}
    </div>
  `);
  $('#pick', el).addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const id = f.get('skill') === 'l' ? `l-${f.get('book')}-t${f.get('test')}` : `r-${f.get('mod')}-${f.get('book')}-t${f.get('test')}`;
    location.hash = `#/cambridge/${id}`;
  });
}

const SECTIONS = {
  listening: [['Part 1', 1, 10], ['Part 2', 11, 20], ['Part 3', 21, 30], ['Part 4', 31, 40]],
  reading: [['Passage / Section 1', 1, 13], ['Passage / Section 2', 14, 26], ['Passage / Section 3', 27, 40]],
};

function renderSheet(el, p) {
  const title = camTitle(p);
  const saved = store.get().inProgress[`cam:${p.id}`];
  const st = {
    responses: saved?.responses || {},
    remaining: saved?.remaining ?? (p.skill === 'reading' ? 3600 : 120),
    mode: saved?.mode || 'exam',
    timer: null,
    result: null,
    audioUrl: null,
  };
  let saveT;
  const persist = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      if (st.result) return;
      store.update((s) => (s.inProgress[`cam:${p.id}`] = { responses: st.responses, remaining: Math.round(st.timer?.remaining ?? st.remaining), mode: st.mode, savedAt: Date.now() }));
    }, 500);
  };

  el.innerHTML = String(html`
    <p class="small"><a href="#/cambridge">← Luyện đề Cambridge</a></p>
    <div class="testbar">
      <strong class="small">${title}</strong><span class="spacer"></span>
      <span class="timer" id="tm">${p.skill === 'reading' ? fmtTime(st.remaining) : '--:--'}</span>
      ${p.skill === 'reading' ? html`<button class="btn sm" id="tbtn">▶ Bắt đầu tính giờ</button>` : ''}
      <button class="btn sm primary" id="submit">Nộp bài</button>
    </div>
    ${p.skill === 'listening'
      ? html`<div class="card stack">
          <h3>Audio</h3>
          <p class="small muted" style="margin:0">Chọn file audio của Test ${p.test} từ tài nguyên đi kèm sách (MP3/M4A…). File chỉ phát trên thiết bị này, không được tải lên đâu. Bài thi thật chỉ nghe một lần — hãy không tua lại.</p>
          <input type="file" id="af" accept="audio/*">
          <audio id="au" controls hidden style="width:100%"></audio>
          <p class="small muted" style="margin:0">Khi audio kết thúc, bạn có 2 phút kiểm tra đáp án (như thi trên máy tính), sau đó nộp bài.</p>
        </div>`
      : html`<div class="alert info small">Thời gian Reading: 60 phút cho 40 câu, không có thời gian chép thêm. Phân bổ thường gặp: Passage 1 ~17 phút, Passage 2 ~20 phút, Passage 3 ~23 phút.</div>`}
    <div id="result"></div>
    <form class="card" id="sheet" autocomplete="off" style="margin-top:1rem">
      <h3>Phiếu trả lời</h3>
      <p class="small muted">Viết đáp án đúng như yêu cầu của đề (chữ cái A–I, TRUE/FALSE/NOT GIVEN viết đầy đủ, từ/số theo giới hạn). Không phân biệt chữ hoa/thường. Sai chính tả bị tính sai.</p>
      ${SECTIONS[p.skill].map(([name, a, b]) => html`<fieldset class="sheet-sec"><legend>${name}</legend><div class="sheet-grid">
        ${Array.from({ length: b - a + 1 }, (_, i) => a + i).map((n) => html`<label class="sheet-cell" id="q-${n}"><span class="qn">${n}</span><input type="text" data-n="${n}" value="${st.responses[n] || ''}" autocapitalize="off" spellcheck="false" aria-label="Câu ${n}"><span class="mark"></span></label>`)}
      </div></fieldset>`)}
    </form>
    <div id="keyBox"></div>
  `);

  const sheet = $('#sheet', el);
  sheet.addEventListener('input', (e) => {
    const n = e.target.dataset.n;
    if (n) {
      st.responses[n] = e.target.value;
      persist();
    }
  });
  setLeaveGuard(() => (st.result || !Object.keys(st.responses).length ? null : 'Bài làm đang dở (đã lưu tự động). Rời trang?'));

  const startTimer = (secs, onEnd) => {
    st.timer?.stop();
    st.timer = new Countdown(secs, {
      onTick: (r) => {
        $('#tm', el).textContent = fmtTime(r);
        $('#tm', el).classList.toggle('low', r <= 300);
      },
      onEnd,
    });
    st.timer.start();
  };

  if (p.skill === 'reading') {
    $('#tbtn', el).onclick = (e) => {
      e.target.remove();
      startTimer(st.remaining, () => {
        toast('Hết giờ — bài làm được nộp tự động.', 'bad');
        submit(true);
      });
    };
  } else {
    $('#af', el).onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (st.audioUrl) URL.revokeObjectURL(st.audioUrl);
      st.audioUrl = URL.createObjectURL(f);
      const au = $('#au', el);
      au.src = st.audioUrl;
      au.hidden = false;
      au.play().catch(() => {});
    };
    $('#au', el).addEventListener('ended', () => {
      toast('Audio kết thúc — 2 phút kiểm tra.');
      startTimer(120, () => submit(true));
    });
  }

  $('#submit', el).onclick = () => submit(false);

  function keyFor() {
    const raw = store.get().cambridgeKeys?.[p.id];
    return raw ? parseKeyText(raw) : null;
  }

  function submit(auto) {
    if (st.result) return;
    const answered = Object.values(st.responses).filter((v) => String(v).trim()).length;
    if (!auto && answered < 40 && !confirm(`Bạn mới trả lời ${answered}/40 câu. Nộp bài?`)) return;
    st.timer?.stop();
    const key = keyFor();
    if (!key) return askKey();
    grade(key);
  }

  function askKey(existing = '') {
    const box = $('#keyBox', el);
    box.innerHTML = String(html`<form class="card stack" id="kf" style="margin-top:1rem">
      <h3>Nhập đáp án (Answer Key) từ sách</h3>
      <p class="small muted" style="margin:0">Mở phần Answer Key cuối sách cho <strong>${title}</strong>, nhập mỗi câu một dòng. Đáp án chỉ lưu trên thiết bị này và dùng lại cho các lần làm sau.</p>
      <ul class="ticks small">
        <li>Từ trong ngoặc là không bắt buộc, giữ nguyên ngoặc: <code>3 (the) library</code></li>
        <li>Nhiều đáp án chấp nhận: dùng "/" hoặc OR: <code>7 24 / twenty-four</code></li>
        <li>Hai câu chọn chữ cái theo thứ tự bất kỳ (IN EITHER ORDER): <code>21-22 B, D</code></li>
      </ul>
      <textarea id="kt" rows="14" placeholder="1 library&#10;2 (the) car park&#10;3 24 / twenty-four&#10;…&#10;21-22 B, D&#10;…&#10;40 FALSE">${existing}</textarea>
      <div id="kerr"></div>
      <div class="row"><button class="btn primary">Lưu đáp án & chấm bài</button></div>
    </form>`);
    $('#kf', el).addEventListener('submit', (e) => {
      e.preventDefault();
      const text = $('#kt', el).value;
      const k = parseKeyText(text);
      const covered = new Set([...Object.keys(k.answers).map(Number), ...k.groups.flatMap((g) => g.nums)]);
      const missing = Array.from({ length: 40 }, (_, i) => i + 1).filter((n) => !covered.has(n));
      if (k.errors.length || missing.length) {
        $('#kerr', el).innerHTML = String(html`<div class="alert warn small">
          ${k.errors.length ? html`<div>Không đọc được các dòng: <code>${k.errors.slice(0, 5).join(' | ')}</code></div>` : ''}
          ${missing.length ? html`<div>Thiếu đáp án cho câu: ${missing.join(', ')}</div>` : ''}
          <div>Vẫn lưu? Câu thiếu đáp án sẽ không được chấm.</div>
          <button type="button" class="btn sm" id="force">Vẫn lưu & chấm</button></div>`);
        $('#force', el).onclick = () => saveKey(text);
        return;
      }
      saveKey(text);
    });
    box.scrollIntoView({ behavior: 'smooth' });
  }

  function saveKey(text) {
    store.update((s) => {
      s.cambridgeKeys ||= {};
      s.cambridgeKeys[p.id] = text;
    });
    $('#keyBox', el).innerHTML = '';
    grade(parseKeyText(text));
  }

  function grade(key) {
    const r = gradeSheet(st.responses, key);
    st.result = r;
    const table = p.skill === 'listening' ? 'listening' : p.module === 'gt' ? 'generalReading' : 'academicReading';
    const complete = r.total === 40;
    const band = complete ? rawToBand(r.correct, table) : null;
    store.addAttempt({ skill: p.skill, ref: `cam:${p.id}`, title, raw: r.correct, total: r.total, band, detail: { source: 'cambridge', per: r.per } });
    store.update((s) => delete s.inProgress[`cam:${p.id}`]);
    setLeaveGuard(null);
    // Mark the sheet
    $$('.sheet-cell', el).forEach((c) => {
      const n = c.id.slice(2);
      const ok = r.per[n];
      c.classList.toggle('ok', ok === true);
      c.classList.toggle('bad', ok === false);
      const acc = key.answers[n] || key.groups.find((g) => g.nums.includes(Number(n)))?.letters.join(' / ');
      $('.mark', c).textContent = ok === undefined ? '' : ok ? '✓' : `✗ ${Array.isArray(acc) ? acc.join(' / ') : acc || ''}`;
      $('input', c).disabled = true;
    });
    $('#submit', el).disabled = true;
    const wrongBySection = SECTIONS[p.skill].map(([name, a, b]) => [name, Array.from({ length: b - a + 1 }, (_, i) => a + i).filter((n) => r.per[n]).length, b - a + 1]);
    $('#result', el).innerHTML = String(html`<div class="card" style="margin-top:1rem">
      <div class="row">
        <div class="stat"><span class="l">Điểm</span><span class="v">${r.correct}/${r.total}</span></div>
        <div class="stat" style="margin-left:1.5rem"><span class="l">Band ước tính</span><span class="v"><span class="band ${bandClass(band)}">${fmtBand(band)}</span></span></div>
      </div>
      ${!complete ? html`<p class="small muted">Đáp án chưa đủ 40 câu nên không quy đổi band.</p>` : ''}
      <div class="table-wrap" style="margin-top:.6rem"><table class="data"><thead><tr><th>Phần</th><th>Đúng</th></tr></thead><tbody>${wrongBySection.map(([n, c, t]) => html`<tr><td>${n}</td><td>${c}/${t}</td></tr>`)}</tbody></table></div>
      <p class="small muted">Bảng quy đổi: ${table === 'listening' ? 'Listening' : table === 'generalReading' ? 'General Training Reading' : 'Academic Reading'} (tham khảo, khớp các mốc chính thức). Mỗi câu sai hiển thị đáp án đúng ngay trên phiếu.</p>
      <div class="row"><button class="btn" id="editKey">Sửa đáp án đã nhập</button><a class="btn" href="#/cambridge">Về danh sách</a><button class="btn primary" id="retry">Làm lại test này</button></div>
    </div>`);
    $('#editKey', el).onclick = () => askKey(store.get().cambridgeKeys?.[p.id] || '');
    $('#retry', el).onclick = () => {
      store.update((s) => delete s.inProgress[`cam:${p.id}`]);
      location.reload();
    };
    window.scrollTo(0, 0);
  }

  return () => {
    st.timer?.stop();
    if (st.audioUrl) URL.revokeObjectURL(st.audioUrl);
    if (!st.result && Object.keys(st.responses).length) {
      clearTimeout(saveT);
      store.update((s) => (s.inProgress[`cam:${p.id}`] = { responses: st.responses, remaining: Math.round(st.timer?.remaining ?? st.remaining), mode: st.mode, savedAt: Date.now() }));
    }
  };
}

