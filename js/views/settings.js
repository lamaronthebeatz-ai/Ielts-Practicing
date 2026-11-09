import { html, $, toast, download } from '../ui.js';
import { store } from '../store.js';
import { say, ttsSupported, loadVoices } from '../tts.js';

const TARGETS = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export function render(el) {
  const s = store.get();
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Cài đặt</h1></div></div>
    <form class="card stack" id="profile">
      <h3>Hồ sơ & mục tiêu</h3>
      <div class="grid g2">
        <label class="field">Tên hiển thị<input type="text" name="name" value="${s.profile.name}" maxlength="40"></label>
        <label class="field">Loại bài thi<select name="module">
          <option value="academic" ${s.profile.module === 'academic' ? 'selected' : ''}>Academic</option>
          <option value="general" ${s.profile.module === 'general' ? 'selected' : ''}>General Training</option></select></label>
        <label class="field">Band mục tiêu (Overall)<select name="target">${TARGETS.map((t) => html`<option value="${t}" ${Number(s.profile.target) === t ? 'selected' : ''}>${t.toFixed(1)}</option>`)}</select></label>
        <label class="field">Ngày thi dự kiến<input type="date" name="testDate" value="${s.profile.testDate}"></label>
      </div>
      <div><button class="btn primary">Lưu</button></div>
    </form>
    <div class="card stack">
      <h3>Giao diện & âm thanh</h3>
      <div class="grid g2">
        <label class="field">Chủ đề màu<select id="theme">
          <option value="auto" ${s.settings.theme === 'auto' ? 'selected' : ''}>Theo hệ thống</option>
          <option value="light" ${s.settings.theme === 'light' ? 'selected' : ''}>Sáng</option>
          <option value="dark" ${s.settings.theme === 'dark' ? 'selected' : ''}>Tối</option></select></label>
        <label class="field">Tốc độ giọng đọc: <span id="rateV">${s.settings.ttsRate}</span><input type="range" id="rate" min="0.7" max="1.2" step="0.05" value="${s.settings.ttsRate}"></label>
      </div>
      <div class="row"><button class="btn" id="tryVoice">🔊 Nghe thử</button>
        <span class="small muted" id="voiceInfo">${ttsSupported() ? 'Đang kiểm tra giọng đọc…' : 'Trình duyệt không hỗ trợ giọng đọc.'}</span></div>
    </div>
    <div class="card stack">
      <h3>Dữ liệu</h3>
      <p class="small muted">Dữ liệu (kết quả, bài viết, tiến độ từ vựng) chỉ lưu trong trình duyệt trên thiết bị này. Hãy sao lưu định kỳ hoặc khi chuyển thiết bị.</p>
      <div class="row">
        <button class="btn" id="export">⬇ Xuất dữ liệu (JSON)</button>
        <label class="btn">⬆ Nhập dữ liệu<input type="file" id="import" accept="application/json,.json" hidden></label>
        <button class="btn danger" id="reset">Xóa toàn bộ dữ liệu</button>
      </div>
    </div>
    <div class="card small muted">
      <h3>Giới thiệu</h3>
      <p>IELTS Prep Pro là ứng dụng luyện thi độc lập, không liên kết với British Council, IDP hay Cambridge University Press & Assessment. Toàn bộ đề luyện tập là nội dung biên soạn mới theo đúng định dạng đề thi hiện hành. Band Listening/Reading là ước tính theo bảng quy đổi tham khảo; band Writing/Speaking là tự đánh giá theo band descriptors công khai.</p>
    </div>
  `);

  if (ttsSupported())
    loadVoices().then((all) => {
      const voices = all.filter((v) => /^en[-_]/i.test(v.lang));
      const info = $('#voiceInfo', el);
      if (info) info.textContent = `Thiết bị có ${voices.length} giọng tiếng Anh${voices.length ? `: ${[...new Set(voices.map((v) => v.lang))].join(', ')}` : ''}.`;
    });

  $('#profile', el).addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    store.update((st) => {
      st.profile.name = String(f.get('name') || '').trim();
      st.profile.module = f.get('module');
      st.profile.target = Number(f.get('target'));
      st.profile.testDate = f.get('testDate') || '';
    });
    toast('Đã lưu.', 'ok');
  });
  $('#theme', el).onchange = (e) => store.update((st) => (st.settings.theme = e.target.value));
  $('#rate', el).oninput = (e) => {
    $('#rateV', el).textContent = e.target.value;
    store.update((st) => (st.settings.ttsRate = Number(e.target.value)));
  };
  $('#tryVoice', el).onclick = () => say('Welcome to IELTS practice. The weather in London is expected to improve later this week.');
  $('#export', el).onclick = () => download(`ielts-prep-backup-${new Date().toISOString().slice(0, 10)}.json`, store.export());
  $('#import', el).onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      store.import(await file.text());
      toast('Đã nhập dữ liệu.', 'ok');
      render(el);
    } catch (err) {
      toast(`Lỗi: ${err.message}`, 'bad');
    }
  };
  $('#reset', el).onclick = () => {
    if (confirm('Xóa TOÀN BỘ dữ liệu? Không thể hoàn tác.') && confirm('Bạn chắc chắn chứ?')) {
      store.reset();
      toast('Đã xóa dữ liệu.');
      render(el);
    }
  };
}
