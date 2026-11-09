import { html, $, Countdown, fmtTime, toast, setLeaveGuard, bandClass, fmtBand, shuffle, pick } from '../ui.js';
import { store } from '../store.js';
import { part1, part2, speakingTips } from '../data/speaking.js';
import { speakingCriteria } from '../data/descriptors.js';
import { analyzeSpeech, criteriaBand } from '../scoring.js';
import { say, stopSpeaking, ttsSupported } from '../tts.js';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export function render(el, mode) {
  if (!mode) return renderList(el);
  let steps;
  let title;
  let full = false;
  if (mode === 'full') {
    full = true;
    title = 'Speaking — Mô phỏng bài thi đầy đủ';
    steps = buildFull();
  } else if (mode === 'p1') {
    const topics = shuffle(part1).slice(0, 2);
    title = `Part 1 — ${topics.map((t) => t.topic).join(' & ')}`;
    steps = topics.flatMap((t, i) => [{ type: 'info', part: 1, text: i === 0 ? `Let's talk about ${t.topic.toLowerCase()}.` : `Now let's move on to ${t.topic.toLowerCase()}.` }, ...t.qs.map((q) => ({ type: 'ask', part: 1, text: q }))]);
  } else {
    const card = part2.find((c) => c.id === mode);
    if (!card) {
      el.innerHTML = String(html`<div class="alert bad">Không tìm thấy cue card.</div>`);
      return;
    }
    title = `Part 2 & 3 — ${card.card}`;
    steps = part2Steps(card);
  }
  return runSession(el, { title, steps, full, ref: mode });
}

function part2Steps(card) {
  return [
    { type: 'info', part: 2, text: 'Now I\'m going to give you a topic, and I\'d like you to talk about it for one to two minutes. Before you talk, you\'ll have one minute to think about what you\'re going to say. You can make some notes if you wish. Here is your topic.' },
    { type: 'prep', part: 2, secs: 60, card },
    { type: 'info', part: 2, text: 'All right? Remember, you have one to two minutes for this, so don\'t worry if I stop you. I\'ll tell you when the time is up. Can you start speaking now, please?', card },
    { type: 'talk', part: 2, secs: 120, card },
    { type: 'info', part: 2, text: 'Thank you.' },
    { type: 'info', part: 3, text: 'We\'ve been talking about ' + card.card.replace(/^Describe /, '').replace(/\.$/, '') + '. I\'d like to discuss with you one or two more general questions related to this.' },
    ...card.part3.map((q) => ({ type: 'ask', part: 3, text: q })),
  ];
}

function buildFull() {
  const topics = shuffle(part1.slice(1)).slice(0, 2);
  const card = pick(part2);
  return [
    { type: 'info', part: 1, text: 'Good afternoon. My name is Sarah, and I will be your examiner today. This test is being recorded.' },
    { type: 'ask', part: 1, text: 'Can you tell me your full name, please?' },
    { type: 'info', part: 1, text: 'Thank you. Now, in this first part, I\'d like to ask you some questions about yourself.' },
    ...part1[0].qs.slice(0, 2).map((q) => ({ type: 'ask', part: 1, text: q })),
    ...topics.flatMap((t) => [{ type: 'info', part: 1, text: `Let's talk about ${t.topic.toLowerCase()}.` }, ...t.qs.slice(0, 3).map((q) => ({ type: 'ask', part: 1, text: q }))]),
    ...part2Steps(card),
    { type: 'info', part: 3, text: 'Thank you. That is the end of the speaking test.' },
  ];
}

function renderList(el) {
  const s = store.get();
  const hist = s.attempts.filter((a) => a.skill.startsWith('speaking')).slice(-5).reverse();
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Speaking</h1><p>11–14 phút · 3 phần · phỏng vấn trực tiếp với giám khảo.</p></div></div>
    ${!ttsSupported() ? html`<div class="alert warn" style="margin-bottom:1rem">Trình duyệt không hỗ trợ giọng đọc — câu hỏi sẽ chỉ hiển thị dạng chữ.</div>` : ''}
    <div class="grid g3">
      <a class="card linkcard" href="#/speaking/full"><h3>🎯 Mô phỏng bài thi đầy đủ</h3><p class="small muted">Part 1 → Part 2 (1 phút chuẩn bị + 2 phút nói) → Part 3. Giám khảo đọc câu hỏi, toàn bộ bài được ghi âm để nghe lại và tự chấm.</p></a>
      <a class="card linkcard" href="#/speaking/p1"><h3>💬 Luyện Part 1</h3><p class="small muted">2 chủ đề ngẫu nhiên, mỗi chủ đề 4 câu hỏi.</p></a>
      <div class="card"><h3>🗒 Luyện Part 2 & 3</h3><ul class="clean small">${part2.map((c) => html`<li style="margin:.3rem 0"><a href="#/speaking/${c.id}">${c.card}</a></li>`)}</ul></div>
    </div>
    <div class="grid g2" style="margin-top:1rem">
      ${speakingTips.map((t) => html`<div class="card"><h3>${t.part}</h3><ul class="ticks small">${t.tips.map((x) => html`<li>${x}</li>`)}</ul></div>`)}
    </div>
    <details style="margin-top:1rem"><summary>Ngân hàng câu hỏi Part 1</summary>
      <div class="grid g3">${part1.map((t) => html`<div><h4>${t.topic}</h4><ul class="ticks small">${t.qs.map((q) => html`<li>${q}</li>`)}</ul></div>`)}</div>
    </details>
    ${hist.length ? html`<div class="card" style="margin-top:1rem"><h3>Gần đây</h3><ul class="ticks small">${hist.map((a) => html`<li>${a.title} — <span class="band ${bandClass(a.band)}">${fmtBand(a.band)}</span> ${a.detail?.wpm ? `· ${a.detail.wpm} từ/phút` : ''}</li>`)}</ul></div>` : ''}
  `);
}

function runSession(el, { title, steps, full, ref }) {
  const st = { i: -1, recorder: null, chunks: [], stream: null, rec: null, transcript: '', interim: '', answerSec: 0, answerStart: null, timer: null, ended: false, showText: true, audioUrl: null };

  el.innerHTML = String(html`
    <div class="card" style="max-width:760px">
      <p><a href="#/speaking">← Speaking</a></p>
      <h1>${title}</h1>
      <ul class="ticks small">
        <li>Ứng dụng sẽ xin quyền dùng micro để ghi âm câu trả lời. Bản ghi chỉ lưu trên thiết bị trong phiên này — bạn có thể tải về sau khi kết thúc.</li>
        <li>${SR ? 'Trình duyệt hỗ trợ nhận dạng giọng nói: bản ghi lời (transcript) sẽ được tạo để tính tốc độ nói và từ đệm. Tính năng này có thể cần kết nối mạng.' : 'Trình duyệt không hỗ trợ nhận dạng giọng nói — bạn vẫn ghi âm và tự chấm được.'}</li>
        <li>Trả lời xong mỗi câu, bấm <strong>Câu tiếp theo</strong> (giống như giám khảo chuyển câu).</li>
      </ul>
      <label class="row small"><input type="checkbox" id="showText" checked> Hiển thị câu hỏi dạng chữ (tắt để giống thi thật — chỉ nghe)</label>
      <div class="row" style="margin-top:1rem"><button class="btn primary" id="begin">🎙 Bắt đầu</button><button class="btn" id="noMic">Bắt đầu không ghi âm</button></div>
    </div>`);

  $('#begin', el).onclick = () => begin(true);
  $('#noMic', el).onclick = () => begin(false);

  async function begin(withMic) {
    st.showText = $('#showText', el).checked;
    if (withMic) {
      try {
        st.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => window.MediaRecorder?.isTypeSupported?.(m));
        st.recorder = new MediaRecorder(st.stream, mime ? { mimeType: mime } : undefined);
        st.recorder.ondataavailable = (e) => e.data.size && st.chunks.push(e.data);
        st.recorder.start(1000);
      } catch (e) {
        toast('Không truy cập được micro — tiếp tục không ghi âm.', 'bad');
      }
    }
    setLeaveGuard(() => (st.ended ? null : 'Bài nói đang diễn ra. Rời trang sẽ mất bản ghi. Tiếp tục?'));
    el.innerHTML = String(html`
      <div class="testbar"><strong class="small">${title}</strong><span class="spacer"></span>
        ${st.recorder ? html`<span class="small"><span class="rec-dot"></span> Đang ghi âm</span>` : ''}
        <span class="tag" id="partTag"></span>
        <button class="btn sm danger" id="stop">Kết thúc</button></div>
      <div class="card stack">
        <div class="examiner" id="ex" aria-live="polite"></div>
        <div id="cue"></div>
        <div class="row"><span class="timer" id="tm" hidden></span><span class="spacer"></span><button class="btn" id="repeat">🔁 Nhắc lại câu hỏi</button><button class="btn primary" id="next">Câu tiếp theo →</button></div>
        ${SR ? html`<div><p class="small muted" style="margin:0">Transcript (tự động):</p><div class="live-transcript" id="live"></div></div>` : ''}
      </div>`);
    $('#next', el).onclick = next;
    $('#repeat', el).onclick = () => {
      const s = steps[st.i];
      if (s?.text) speak(s.text);
    };
    $('#stop', el).onclick = () => {
      if (confirm('Kết thúc bài nói và chuyển sang phần đánh giá?')) finish();
    };
    next();
  }

  function speak(text) {
    stopAnswer();
    return say(text, { voiceKey: 'gb-f' });
  }

  function startAnswer() {
    st.answerStart = Date.now();
    if (SR && !st.rec) {
      try {
        const r = new SR();
        r.lang = 'en-GB';
        r.continuous = true;
        r.interimResults = true;
        r.onresult = (e) => {
          let interim = '';
          for (let k = e.resultIndex; k < e.results.length; k++) {
            if (e.results[k].isFinal) st.transcript += e.results[k][0].transcript.trim() + '. ';
            else interim += e.results[k][0].transcript;
          }
          st.interim = interim;
          const live = $('#live', el);
          if (live) live.textContent = (st.transcript + interim).slice(-400);
        };
        r.onend = () => {
          if (st.rec === r && st.answerStart && !st.ended) {
            try {
              r.start();
            } catch {
              /* already started */
            }
          }
        };
        r.onerror = () => {};
        st.rec = r;
        r.start();
      } catch {
        st.rec = null;
      }
    }
  }

  function stopAnswer() {
    if (st.answerStart) {
      st.answerSec += (Date.now() - st.answerStart) / 1000;
      st.answerStart = null;
    }
    if (st.rec) {
      const r = st.rec;
      st.rec = null;
      try {
        r.stop();
      } catch {
        /* ignore */
      }
    }
  }

  async function next() {
    st.timer?.stop();
    stopAnswer();
    st.i++;
    if (st.i >= steps.length) return finish();
    const s = steps[st.i];
    $('#partTag', el).textContent = `Part ${s.part}`;
    const ex = $('#ex', el);
    const cue = $('#cue', el);
    const tm = $('#tm', el);
    tm.hidden = true;
    $('#next', el).disabled = false;
    if (s.type !== 'prep' && s.type !== 'talk' && !s.card) cue.innerHTML = '';
    if (s.type === 'info' || s.type === 'ask') {
      ex.textContent = st.showText ? s.text : '🔊 Giám khảo đang nói…';
      $('#next', el).disabled = true;
      await speak(s.text);
      if (steps[st.i] !== s) return;
      $('#next', el).disabled = false;
      if (s.type === 'info') {
        // Examiner instructions flow straight into the next step
        if (!st.showText) ex.textContent = '';
        return next();
      }
      if (!st.showText) ex.textContent = '🎙 Bạn trả lời…';
      startAnswer();
    } else if (s.type === 'prep') {
      ex.textContent = '📝 1 phút chuẩn bị — ghi chú từ khóa cho từng ý.';
      cue.innerHTML = String(cueCard(s.card));
      tm.hidden = false;
      $('#next', el).textContent = 'Bắt đầu nói ngay →';
      st.timer = new Countdown(s.secs, { onTick: (r) => (tm.textContent = fmtTime(r)), onEnd: () => next() });
      st.timer.start();
    } else if (s.type === 'talk') {
      ex.textContent = '🎙 Hãy nói về chủ đề trong 1–2 phút. Giám khảo sẽ dừng bạn khi hết 2 phút.';
      cue.innerHTML = String(cueCard(s.card));
      tm.hidden = false;
      $('#next', el).textContent = 'Tôi đã nói xong →';
      startAnswer();
      st.timer = new Countdown(s.secs, {
        onTick: (r) => {
          tm.textContent = fmtTime(r);
          tm.classList.toggle('low', r < 20);
        },
        onEnd: () => next(),
      });
      st.timer.start();
    }
    if (s.type !== 'prep' && s.type !== 'talk') $('#next', el).textContent = 'Câu tiếp theo →';
  }

  function cueCard(card) {
    return html`<div class="cue"><h3>${card.card}</h3><p class="small" style="margin:0">You should say:</p><ul class="ticks">${card.bullets.map((b) => html`<li>${b}</li>`)}</ul></div>`;
  }

  async function finish() {
    if (st.ended) return;
    st.ended = true;
    st.timer?.stop();
    stopAnswer();
    stopSpeaking();
    setLeaveGuard(null);
    if (st.recorder && st.recorder.state !== 'inactive') {
      await new Promise((res) => {
        st.recorder.onstop = res;
        st.recorder.stop();
      });
    }
    st.stream?.getTracks().forEach((t) => t.stop());
    if (st.chunks.length) st.audioUrl = URL.createObjectURL(new Blob(st.chunks, { type: st.recorder.mimeType || 'audio/webm' }));
    const transcript = (st.transcript + st.interim).trim();
    const sp = analyzeSpeech(transcript, st.answerSec);
    el.innerHTML = String(html`
      <div class="page-head"><div><p><a href="#/speaking">← Speaking</a></p><h1>Đánh giá: ${title}</h1></div></div>
      <div class="grid g2">
        <div class="card stack">
          <h3>Bản ghi</h3>
          ${st.audioUrl ? html`<audio controls src="${st.audioUrl}" style="width:100%"></audio><button class="btn sm" id="dl">⬇ Tải bản ghi</button>` : html`<p class="muted">Không có bản ghi âm.</p>`}
          <div class="metric"><span>Thời gian trả lời</span><strong>${fmtTime(st.answerSec)}</strong></div>
          ${transcript
            ? html`<div class="metric"><span>Số từ nhận dạng</span><strong>${sp.words}</strong></div>
              <div class="metric"><span>Tốc độ nói</span><strong>${sp.wpm} từ/phút</strong></div>
              <div class="metric"><span>Từ đệm (um, uh, like, you know…)</span><strong>${sp.fillerTotal} (${Math.round(sp.fillerRate * 100)}%)</strong></div>
              <p class="small muted">Tham khảo: người nói lưu loát thường ở khoảng 120–160 từ/phút. Nhận dạng giọng nói có thể bỏ sót từ (đặc biệt từ đệm), nên chỉ số chỉ mang tính tham khảo.</p>
              <details><summary>Transcript</summary><p class="small">${transcript}</p></details>`
            : html`<p class="small muted">Không có transcript (trình duyệt không hỗ trợ hoặc không nhận dạng được giọng nói). Hãy nghe lại bản ghi để tự đánh giá.</p>`}
          <div class="alert info small"><strong>Cách tự đánh giá hiệu quả:</strong> nghe lại bản ghi 2 lần — lần 1 chú ý độ trôi chảy & mạch lạc, lần 2 ghi lại lỗi ngữ pháp, từ vựng lặp, âm cuối bị nuốt. So với band descriptors bên cạnh.</div>
        </div>
        <form class="card" id="selfForm">
          <h3>Tự chấm theo band descriptors</h3>
          <div class="criteria-pick">${Object.entries(speakingCriteria).map(
            ([k, c]) => html`<fieldset><legend>${c.name}</legend><div class="band-opts">${[9, 8, 7, 6, 5, 4].map((b) => html`<label><input type="radio" name="${k}" value="${b}"><b>${b}</b><span>${c.bands[b]}</span></label>`)}</div></fieldset>`,
          )}</div>
          <div class="row" style="margin-top:1rem"><span>Band: <span class="band band-none" id="sb">–</span></span><span class="spacer"></span><button class="btn primary">Lưu kết quả</button></div>
          <p class="small muted">${full ? 'Kết quả bài mô phỏng đầy đủ được dùng làm band Speaking trên trang tổng quan.' : 'Kết quả luyện từng phần được lưu vào lịch sử, không thay band Speaking tổng.'}</p>
        </form>
      </div>`);
    const dl = $('#dl', el);
    if (dl)
      dl.onclick = async () => {
        const blob = await fetch(st.audioUrl).then((r) => r.blob());
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ielts-speaking-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.${(blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm')}`;
        a.click();
      };
    const form = $('#selfForm', el);
    const keys = Object.keys(speakingCriteria);
    const vals = () => keys.map((k) => Number(form.querySelector(`input[name=${k}]:checked`)?.value)).filter((x) => !Number.isNaN(x));
    form.addEventListener('change', () => {
      const v = vals();
      if (v.length === 4) {
        const b = criteriaBand(v);
        $('#sb', el).textContent = fmtBand(b);
        $('#sb', el).className = `band ${bandClass(b)}`;
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = vals();
      if (v.length !== 4) return toast('Hãy chọn band cho cả 4 tiêu chí.', 'bad');
      const band = criteriaBand(v);
      store.addAttempt({ skill: full ? 'speaking' : 'speaking-practice', ref, title, band, detail: { criteria: v, wpm: sp.wpm, words: sp.words, seconds: Math.round(st.answerSec), transcript } });
      toast(`Đã lưu band ${fmtBand(band)}`, 'ok');
      form.querySelector('button').disabled = true;
    });
  }

  return () => {
    st.ended = true;
    st.timer?.stop();
    stopAnswer();
    stopSpeaking();
    if (st.recorder && st.recorder.state !== 'inactive') st.recorder.stop();
    st.stream?.getTracks().forEach((t) => t.stop());
  };
}


