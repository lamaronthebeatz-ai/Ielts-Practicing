import { store, streak, latestBands } from '../store.js';
import { html, bandClass, fmtBand } from '../ui.js';
import { overallBand, studyPlan } from '../scoring.js';
import { vocab } from '../data/vocab.js';

const SKILL_VI = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };

const PHASE = {
  none: 'Hãy đặt ngày thi trong Cài đặt để nhận lộ trình phù hợp.',
  past: 'Ngày thi đã qua — cập nhật ngày thi mới trong Cài đặt.',
  final: 'Tuần cuối: làm đề full timed, ôn lỗi sai, giữ sức khỏe và ngủ đủ. Không học thêm nội dung mới nặng.',
  intensive: 'Giai đoạn tăng tốc (≤ 4 tuần): mỗi tuần ít nhất 1 đề full Listening + Reading có bấm giờ, 2 bài Writing (1 Task 1 + 1 Task 2), 3 buổi Speaking ghi âm.',
  foundation: 'Giai đoạn nền tảng: củng cố từ vựng theo chủ đề, ngữ pháp câu phức, luyện từng dạng câu hỏi; mỗi 2 tuần làm 1 đề thử để đo tiến độ.',
};

const ACTIONS = {
  listening: ['Làm Listening Mock Test ở chế độ thi thật', 'Nghe lại phần sai ở chế độ luyện tập, đọc transcript để tìm bẫy'],
  reading: ['Làm Reading Mock Test 60 phút', 'Ôn chiến lược TRUE/FALSE/NOT GIVEN và Matching Headings'],
  writing: ['Viết 1 bài Task 2 trong 40 phút, tự chấm theo band descriptors', 'So sánh với bài mẫu: overview, topic sentence, từ nối'],
  speaking: ['Luyện Part 2 với đồng hồ 1 phút chuẩn bị + 2 phút nói, nghe lại bản ghi', 'Chú ý âm cuối, trọng âm và phát triển ý ở Part 3'],
};

export function render(el) {
  const s = store.get();
  const bands = latestBands();
  const target = Number(s.profile.target) || 7;
  const plan = studyPlan({ testDate: s.profile.testDate, target, bands });
  const haveAll = ['listening', 'reading', 'writing', 'speaking'].every((k) => bands[k] != null);
  const overall = haveAll ? overallBand(bands.listening, bands.reading, bands.writing, bands.speaking) : null;
  const due = vocab.filter((v) => !s.srs[v.id] || s.srs[v.id].due <= Date.now()).length;
  const st = streak();

  el.innerHTML = String(html`
    <div class="page-head">
      <div>
        <h1>${s.profile.name ? `Chào ${s.profile.name}!` : 'Ôn luyện IELTS'}</h1>
        <p>Mục tiêu: <strong>Band ${fmtBand(target)}</strong> · ${s.profile.module === 'academic' ? 'Academic' : 'General Training'}${plan.days != null && plan.days >= 0 ? html` · còn <strong>${plan.days}</strong> ngày đến kỳ thi` : ''}</p>
      </div>
      <a class="btn" href="#/settings">Thiết lập mục tiêu</a>
    </div>

    <div class="grid g4">
      ${['listening', 'reading', 'writing', 'speaking'].map(
        (k) => html`<a class="card linkcard stat" href="#/${k}">
          <span class="l">${SKILL_VI[k]} (gần nhất)</span>
          <span class="v"><span class="band ${bandClass(bands[k])}">${fmtBand(bands[k])}</span></span>
          <span class="l">${bands[k] == null ? 'Chưa có bài làm' : bands[k] >= target ? 'Đạt mục tiêu ✓' : `Cần thêm ${fmtBand(target - bands[k])}`}</span>
        </a>`,
      )}
    </div>

    <div class="grid g2" style="margin-top:1rem">
      <div class="card">
        <h3>Overall ước tính</h3>
        ${overall != null
          ? html`<p><span class="big-band ${bandClass(overall)}">${fmtBand(overall)}</span></p>
                 <p class="small muted">Tính theo quy tắc làm tròn chính thức từ band gần nhất của 4 kỹ năng. Writing/Speaking là tự đánh giá nên chỉ mang tính tham khảo.</p>`
          : html`<p class="muted">Cần kết quả của cả 4 kỹ năng để ước tính Overall. Còn thiếu: ${plan.untested.map((k) => SKILL_VI[k]).join(', ')}.</p>`}
        <div class="row small">
          <span class="tag">🔥 Chuỗi ngày học: ${st}</span>
          <span class="tag">🗂 Thẻ từ cần ôn: ${due}</span>
          <span class="tag">📝 Bài đã làm: ${s.attempts.length}</span>
        </div>
      </div>
      <div class="card">
        <h3>Lộ trình gợi ý</h3>
        <p>${PHASE[plan.phase]}</p>
        <p class="small muted">Ưu tiên theo khoảng cách tới mục tiêu${plan.untested.length ? ' (kỹ năng chưa có dữ liệu được xếp theo mức độ thường khó nhất)' : ''}:</p>
        <ol class="ticks">
          ${plan.priority.concat(plan.untested.filter((k) => !plan.priority.includes(k))).slice(0, 2).map(
            (k) => html`<li><strong>${SKILL_VI[k]}</strong>: ${ACTIONS[k][0]}. <span class="muted">${ACTIONS[k][1]}.</span></li>`,
          )}
          <li><strong>Từ vựng</strong>: ôn ${Math.min(due, 20)} thẻ đến hạn hôm nay. <a href="#/vocab/review">Ôn ngay →</a></li>
        </ol>
      </div>
    </div>

    <h2 style="margin-top:1.5rem">Bắt đầu luyện tập</h2>
    <div class="grid g3">
      <a class="card linkcard" href="#/listening/l-01"><h3>🎧 Listening Mock Test</h3><p class="muted small">4 phần · 40 câu · ~30 phút. Âm thanh tổng hợp giọng đọc ngay trên thiết bị, chấm điểm & quy đổi band tự động.</p></a>
      <a class="card linkcard" href="#/reading/ac-r-01"><h3>📖 Academic Reading Mock Test</h3><p class="muted small">3 passages · 40 câu · 60 phút. Giải thích chi tiết từng đáp án, có tô sáng văn bản.</p></a>
      <a class="card linkcard" href="#/writing"><h3>✍ Writing Task 1 & 2</h3><p class="muted small">Bấm giờ, đếm từ, phân tích văn bản, tự chấm theo band descriptors, bài mẫu có chú giải.</p></a>
      <a class="card linkcard" href="#/speaking"><h3>🎙 Speaking Simulation</h3><p class="muted small">Giám khảo đọc câu hỏi, ghi âm câu trả lời, đồng hồ Part 2 chuẩn, phân tích tốc độ nói.</p></a>
      <a class="card linkcard" href="#/vocab"><h3>🗂 Từ vựng học thuật</h3><p class="muted small">Theo chủ đề Task 2, flashcards với thuật toán lặp lại ngắt quãng (SM-2).</p></a>
      <a class="card linkcard" href="#/guide"><h3>ℹ Cấu trúc đề & cách chấm</h3><p class="muted small">Cập nhật định dạng thi hiện hành, band descriptors, quy tắc làm tròn Overall.</p></a>
    </div>
  `);
}
