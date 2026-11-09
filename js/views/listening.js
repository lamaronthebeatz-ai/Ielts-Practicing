import { html, raw, $, $$, Countdown, fmtTime, toast, setLeaveGuard, bandClass, fmtBand } from '../ui.js';
import { store } from '../store.js';
import { listeningTests, listeningStrategies } from '../data/listening.js';
import { renderGroups, bindInputs, grade, navBar, updateNav, bindJump, allQuestions } from '../quiz.js';
import { rawToBand } from '../scoring.js';
import { ScriptPlayer, ttsSupported, loadVoices } from '../tts.js';
import { typeBreakdown } from './reading.js';

export function render(el, testId) {
  if (!testId) return renderList(el);
  const test = listeningTests.find((t) => t.id === testId);
  if (!test) {
    el.innerHTML = String(html`<div class="alert bad">Không tìm thấy đề.</div>`);
    return;
  }
  return renderTest(el, test);
}

function renderList(el) {
  const s = store.get();
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Listening</h1><p>~30 phút · 40 câu · 4 phần. Nghe một lần duy nhất trong bài thi thật.</p></div></div>
    ${!ttsSupported() ? html`<div class="alert warn" style="margin-bottom:1rem">Trình duyệt này không hỗ trợ tổng hợp giọng nói. Hãy dùng Chrome, Edge hoặc Safari bản mới. Bạn vẫn có thể luyện bằng cách đọc transcript.</div>` : ''}
    <div class="grid g2">
      ${listeningTests.map((t) => {
        const prev = s.attempts.filter((a) => a.ref === t.id && a.skill === 'listening');
        const best = prev.length ? Math.max(...prev.map((a) => a.band)) : null;
        return html`<div class="card">
          <h3>${t.title}</h3>
          <ul class="ticks small">${t.parts.map((p) => html`<li>${p.title}</li>`)}</ul>
          <p class="row small"><span class="tag">40 câu</span>${best != null ? html`<span class="band ${bandClass(best)}">Cao nhất ${fmtBand(best)}</span>` : ''}</p>
          <a class="btn primary" href="#/listening/${t.id}">Mở đề</a>
        </div>`;
      })}
      <div class="card"><h3>Chiến lược</h3><ul class="ticks">${listeningStrategies.map((t) => html`<li>${t}</li>`)}</ul>
        <p class="small muted">Âm thanh được tạo bằng giọng đọc tổng hợp (text-to-speech) có sẵn trên thiết bị, với giọng khác nhau cho từng người nói. Chất lượng giọng phụ thuộc hệ điều hành; trên Windows/macOS/Android/iOS thường có giọng Anh–Anh, Anh–Úc, Anh–Mỹ.</p>
      </div>
    </div>`);
}

function renderTest(el, test) {
  const state = { mode: 'exam', part: 0, responses: {}, result: null, player: null, checkTimer: null, started: false };

  function intro() {
    el.innerHTML = String(html`
      <div class="card" style="max-width:760px">
        <h1>${test.title}</h1>
        <fieldset class="row" style="border:0;padding:0;margin:0 0 1rem">
          <label class="chip"><input type="radio" name="mode" value="exam" checked><span>Thi thật — 4 phần liên tục, không dừng, không nghe lại</span></label>
          <label class="chip"><input type="radio" name="mode" value="practice"><span>Luyện tập từng phần — dừng/nghe lại, xem transcript sau khi nộp</span></label>
        </fieldset>
        <div id="partPick" hidden>
          <label class="field">Chọn phần<select id="part">${test.parts.map((p, i) => html`<option value="${i}">${p.title}</option>`)}</select></label>
        </div>
        <ul class="ticks small" style="margin-top:1rem">
          <li>Kiểm tra âm lượng trước khi bắt đầu: <button class="btn sm" id="test">🔊 Nghe thử</button></li>
          <li>Thi thật: có thời gian xem trước câu hỏi như đề thật; cuối bài có 2 phút kiểm tra (như thi trên máy tính), sau đó tự động nộp.</li>
          <li>Đáp án chấm theo quy tắc IELTS: sai chính tả hoặc vượt giới hạn số từ đều tính sai.</li>
        </ul>
        ${!ttsSupported() ? html`<div class="alert warn">Trình duyệt không hỗ trợ giọng đọc. Chỉ có thể dùng chế độ luyện tập với transcript.</div>` : ''}
        <div class="row" style="margin-top:1rem"><button class="btn primary" id="go">Bắt đầu</button><a class="btn ghost" href="#/listening">Quay lại</a></div>
      </div>`);
    $$('input[name=mode]', el).forEach((r) =>
      r.addEventListener('change', () => {
        state.mode = r.value;
        $('#partPick', el).hidden = state.mode !== 'practice';
      }),
    );
    $('#test', el).onclick = async () => {
      if (!ttsSupported()) return toast('Không hỗ trợ giọng đọc.', 'bad');
      const p = new ScriptPlayer([{ s: 'A', t: 'This is a sound check. You should be able to hear this clearly.' }, { s: 'B', t: 'And this is a second speaker with a different voice.' }], { A: { voice: 'gb-f' }, B: { voice: 'gb-m' } });
      p.play();
    };
    $('#go', el).onclick = () => {
      if (state.mode === 'exam' && !ttsSupported()) return toast('Thi thật cần giọng đọc. Hãy chọn chế độ luyện tập.', 'bad');
      state.part = state.mode === 'practice' ? Number($('#part', el).value) : 0;
      start();
    };
  }

  const partsInPlay = () => (state.mode === 'exam' ? test.parts : [test.parts[state.part]]);
  const groupsInPlay = () => partsInPlay().flatMap((p) => p.groups);

  function start() {
    state.started = true;
    setLeaveGuard(() => (state.result ? null : 'Bài nghe đang diễn ra. Nếu rời trang, tiến trình sẽ mất. Rời trang?'));
    layout();
    if (state.mode === 'exam') {
      const script = test.parts.flatMap((p, i) => p.script.map((it) => ({ ...it, part: i, speakers: p.speakers })));
      const speakers = {};
      test.parts.forEach((p, i) => Object.entries(p.speakers).forEach(([k, v]) => (speakers[`${i}:${k}`] = v)));
      const keyed = script.map((it) => (it.s ? { ...it, s: `${it.part}:${it.s}` } : it));
      state.player = new ScriptPlayer(keyed, speakers, {
        onLine: (i, item) => {
          if (item.part !== state.playingPart) {
            state.playingPart = item.part;
            state.viewPart = -1;
            showPart(item.part);
          }
          const now = $('#now', el);
          const sp = item.s ? speakers[item.s] : null;
          if (now) now.textContent = item.pause ? '⏸ Thời gian xem câu hỏi / kiểm tra…' : `🔊 ${sp?.role === 'narrator' ? 'Hướng dẫn' : sp?.role || ''} đang nói…`;
          $('#bar', el).style.width = `${Math.round((i / keyed.length) * 100)}%`;
        },
        onPause: (sec) => {
          $('#now', el).textContent = `⏸ ${sec} giây xem/kiểm tra câu hỏi`;
        },
        onPauseTick: (left) => {
          $('#now', el).textContent = `⏸ ${left} giây xem/kiểm tra câu hỏi`;
        },
        onEnd: () => {
          $('#bar', el).style.width = '100%';
          $('#now', el).textContent = 'Bài nghe đã kết thúc. Bạn có 2 phút để kiểm tra đáp án.';
          state.checkTimer = new Countdown(120, {
            onTick: (r) => {
              const t = $('#timer', el);
              if (t) t.textContent = fmtTime(r);
            },
            onEnd: () => submit(true),
          });
          state.checkTimer.start();
        },
      });
      state.player.play().catch((e) => toast(e.message, 'bad'));
    }
  }

  function showPart(i) {
    if (state.mode !== 'exam' || state.viewPart === i) return;
    state.viewPart = i;
    $$('[data-part]', el).forEach((b) => b.classList.toggle('on', Number(b.dataset.part) === i));
    drawQuestions();
  }

  function layout() {
    state.viewPart = state.mode === 'exam' ? 0 : state.part;
    const exam = state.mode === 'exam';
    el.innerHTML = String(html`
      <div class="testbar">
        <strong class="small">${test.title}${exam ? '' : ` — ${test.parts[state.part].title}`}</strong>
        ${exam ? html`<div class="tabs">${test.parts.map((p, i) => html`<button data-part="${i}" class="${i === 0 ? 'on' : ''}">Part ${i + 1}</button>`)}</div>` : ''}
        <span class="spacer"></span>
        ${exam ? html`<span class="timer" id="timer" title="Thời gian kiểm tra cuối bài">--:--</span>` : ''}
        ${state.result ? html`<a class="btn sm" href="#/listening">Xong</a>` : html`<button class="btn primary sm" id="submit">Nộp bài</button>`}
      </div>
      <div id="resultBox"></div>
      <div class="card player">
        <div class="progressbar"><div id="bar"></div></div>
        <div class="nowline" id="now">${exam ? 'Đang chuẩn bị âm thanh…' : 'Nhấn ▶ để bắt đầu nghe.'}</div>
        ${!exam && !state.result
          ? html`<div class="row">
              <button class="btn primary" id="play" ${raw(ttsSupported() ? '' : 'disabled')}>▶ Phát</button>
              <button class="btn" id="pause" disabled>⏸ Tạm dừng</button>
              <button class="btn" id="restart" disabled>↺ Nghe lại từ đầu</button>
              <button class="btn" id="skip" disabled>⏭ Bỏ qua thời gian chờ</button>
              ${!ttsSupported() ? html`<button class="btn" id="showTs">Hiện transcript</button>` : ''}
            </div>`
          : ''}
        ${exam && !state.result ? html`<p class="small muted">Chế độ thi thật: không thể tạm dừng hoặc nghe lại. Trả lời ngay khi nghe.</p>` : ''}
      </div>
      <div class="card" style="margin-top:1rem" id="questions"></div>
      <div class="card" style="margin-top:1rem"><div id="nav"></div></div>
      <div class="card transcript" id="ts" hidden></div>
    `);
    drawQuestions();
    $$('[data-part]', el).forEach((b) =>
      b.addEventListener('click', () => {
        state.viewPart = -1;
        showPart(Number(b.dataset.part));
      }),
    );
    const sb = $('#submit', el);
    if (sb) sb.onclick = () => submit(false);
    bindInputs($('#questions', el), state.responses, () => updateNav(el, state.responses));
    bindJump(el, (n) => {
      const pi = test.parts.findIndex((p) => p.groups.some((g) => n >= g.range[0] && n <= g.range[1]));
      if (state.mode === 'exam' && pi !== state.viewPart) {
        state.viewPart = -1;
        showPart(pi);
      }
    });
    if (state.mode === 'practice' && !state.result) wirePractice();
  }

  function drawQuestions() {
    const part = test.parts[state.viewPart];
    const groups = state.result ? groupsInPlay() : part.groups;
    $('#questions', el).innerHTML = String(html`<h3>${state.result && state.mode === 'exam' ? 'Xem lại toàn bộ đáp án' : part.title}</h3>${renderGroups(groups, state.responses, { review: !!state.result, result: state.result })}`);
    const nums = allQuestions(groupsInPlay()).map((q) => q.n);
    $('#nav', el).innerHTML = String(html`<p class="small muted" style="margin-bottom:.4rem">Bảng câu hỏi:</p>${navBar(nums, state.responses, state.result)}`);
  }

  function wirePractice() {
    const part = test.parts[state.part];
    const btn = (id) => $(`#${id}`, el);
    const setBtns = (playing) => {
      btn('play').disabled = playing || !ttsSupported();
      btn('pause').disabled = !playing;
      btn('restart').disabled = false;
    };
    state.player = new ScriptPlayer(part.script, part.speakers, {
      onLine: (i, item) => {
        $('#bar', el).style.width = `${Math.round((i / part.script.length) * 100)}%`;
        $('#now', el).textContent = item.pause ? '⏸ Thời gian chờ…' : `🔊 ${part.speakers[item.s]?.role === 'narrator' ? 'Hướng dẫn' : part.speakers[item.s]?.role} đang nói…`;
        btn('skip').disabled = !item.pause;
      },
      onPauseTick: (left) => ($('#now', el).textContent = `⏸ Thời gian chờ: ${left} giây`),
      onEnd: () => {
        $('#bar', el).style.width = '100%';
        $('#now', el).textContent = 'Đã nghe hết. Kiểm tra lại đáp án rồi nộp bài.';
        setBtns(false);
        btn('play').textContent = '▶ Phát lại';
      },
    });
    btn('play').onclick = () => {
      setBtns(true);
      const from = state.player.state === 'ended' ? 0 : state.player.i;
      state.player.play(from).catch((e) => toast(e.message, 'bad'));
    };
    btn('pause').onclick = () => {
      state.player.pause();
      setBtns(false);
      btn('play').textContent = '▶ Tiếp tục';
      $('#now', el).textContent = 'Đã tạm dừng.';
    };
    btn('restart').onclick = () => {
      state.player.stop();
      setBtns(true);
      state.player.play(0).catch((e) => toast(e.message, 'bad'));
    };
    btn('skip').onclick = () => state.player.skip();
    const st = $('#showTs', el);
    if (st) st.onclick = () => showTranscript();
  }

  function showTranscript() {
    const box = $('#ts', el);
    box.hidden = false;
    box.innerHTML = String(html`<h3>Transcript</h3>${partsInPlay().map(
      (p) => html`<h4>${p.title}</h4>${p.script.filter((x) => x.t).map((x) => html`<p><span class="spk">${p.speakers[x.s].role === 'narrator' ? 'Narrator' : p.speakers[x.s].role}:</span> ${x.t}</p>`)}`,
    )}`);
  }

  function submit(auto) {
    if (state.result) return;
    const groups = groupsInPlay();
    const nums = allQuestions(groups).map((q) => q.n);
    const unanswered = nums.filter((n) => !String(state.responses[n] ?? '').trim()).length;
    if (!auto && unanswered && !confirm(`Còn ${unanswered} câu chưa trả lời. Nộp bài?`)) return;
    state.player?.stop();
    state.checkTimer?.stop();
    const result = grade(groups, state.responses);
    state.result = result;
    const exam = state.mode === 'exam';
    const band = exam ? rawToBand(result.correct, 'listening') : null;
    const breakdown = typeBreakdown(groups, result.per);
    store.addAttempt({
      skill: exam ? 'listening' : 'listening-practice', ref: test.id, title: exam ? test.title : `${test.title} — Part ${state.part + 1}`,
      raw: result.correct, total: result.total, band, detail: { breakdown, mode: state.mode },
    });
    setLeaveGuard(null);
    layout();
    showTranscript();
    $('#resultBox', el).innerHTML = String(html`<div class="card" style="margin-bottom:1rem">
      <div class="row">
        <div class="stat"><span class="l">Điểm</span><span class="v">${result.correct}/${result.total}</span></div>
        ${exam ? html`<div class="stat" style="margin-left:1.5rem"><span class="l">Band ước tính</span><span class="v"><span class="band ${bandClass(band)}">${fmtBand(band)}</span></span></div>` : html`<p class="small muted" style="margin-left:1rem">Luyện tập từng phần không quy đổi band. Làm chế độ thi thật để có band ước tính.</p>`}
      </div>
      <div class="table-wrap" style="margin-top:.6rem"><table class="data"><thead><tr><th>Dạng câu hỏi</th><th>Đúng</th></tr></thead><tbody>${Object.entries(breakdown).map(([k, v]) => html`<tr><td>${k}</td><td>${v.correct}/${v.total}</td></tr>`)}</tbody></table></div>
      <p class="small muted" style="margin-top:.6rem">Đọc transcript ở cuối trang để tìm đúng chỗ bạn bỏ lỡ và các bẫy (tự sửa, thông tin thay đổi).</p>
    </div>`);
    window.scrollTo(0, 0);
  }

  loadVoices();
  intro();
  return () => {
    state.player?.stop();
    state.checkTimer?.stop();
  };
}
