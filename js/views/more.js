import { html } from '../ui.js';

export function render(el) {
  el.innerHTML = String(html`
    <h1>Thêm</h1>
    <div class="grid g2">
      <a class="card linkcard" href="#/cambridge"><h3>📚 Luyện đề Cambridge</h3><p class="muted small">Phiếu trả lời, bấm giờ, chấm & quy đổi band cho sách Cambridge IELTS của bạn.</p></a>
      <a class="card linkcard" href="#/vocab"><h3>🗂 Từ vựng & Từ điển</h3><p class="muted small">Tra từ điển (IPA, phát âm, ví dụ), Cambridge Anh–Việt, flashcards SM-2.</p></a>
      <a class="card linkcard" href="#/grammar"><h3>🧩 Ngữ pháp học thuật</h3><p class="muted small">Toàn bộ chủ điểm: giải nghĩa, công thức, cách dùng thực chiến, bài tập.</p></a>
      <a class="card linkcard" href="#/progress"><h3>📈 Tiến độ</h3><p class="muted small">Lịch sử bài làm, biểu đồ band theo thời gian.</p></a>
      <a class="card linkcard" href="#/guide"><h3>ℹ Cấu trúc & Chấm điểm</h3><p class="muted small">Định dạng đề, band descriptors, bảng quy đổi.</p></a>
      <a class="card linkcard" href="#/tools"><h3>🧮 Tính band</h3><p class="muted small">Quy đổi điểm thô, tính Overall.</p></a>
      <a class="card linkcard" href="#/settings"><h3>⚙ Cài đặt</h3><p class="muted small">Mục tiêu, ngày thi, giao diện, sao lưu dữ liệu.</p></a>
    </div>
  `);
}
