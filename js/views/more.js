import { html } from '../ui.js';

export function render(el) {
  el.innerHTML = String(html`
    <h1>Thêm</h1>
    <div class="grid g2">
      <a class="card linkcard" href="#/vocab"><h3>🗂 Từ vựng & Ngữ pháp</h3><p class="muted small">Flashcards theo chủ đề, ngữ pháp trọng tâm band 7+.</p></a>
      <a class="card linkcard" href="#/progress"><h3>📈 Tiến độ</h3><p class="muted small">Lịch sử bài làm, biểu đồ band theo thời gian.</p></a>
      <a class="card linkcard" href="#/guide"><h3>ℹ Cấu trúc & Chấm điểm</h3><p class="muted small">Định dạng đề, band descriptors, bảng quy đổi.</p></a>
      <a class="card linkcard" href="#/tools"><h3>🧮 Tính band</h3><p class="muted small">Quy đổi điểm thô, tính Overall.</p></a>
      <a class="card linkcard" href="#/settings"><h3>⚙ Cài đặt</h3><p class="muted small">Mục tiêu, ngày thi, giao diện, sao lưu dữ liệu.</p></a>
    </div>
  `);
}
