# IELTS Prep Pro

Progressive Web App (PWA) ôn luyện IELTS 4 kỹ năng — hoạt động offline, cài được lên điện thoại/máy tính, không cần tài khoản hay máy chủ. Toàn bộ dữ liệu lưu trên thiết bị người dùng.

## Tính năng

| Kỹ năng | Nội dung |
|---|---|
| **Listening** | Đề thi thử đầy đủ 4 phần / 40 câu theo cấu trúc hiện hành. Âm thanh tạo bằng Web Speech API với giọng khác nhau cho từng người nói, có thời gian xem trước câu hỏi như đề thật. Chế độ *thi thật* (nghe 1 lần, 2 phút kiểm tra rồi tự nộp) và *luyện tập* (dừng/nghe lại, transcript sau khi nộp). |
| **Reading** | Đề Academic đầy đủ 3 passages / 40 câu / 60 phút: TRUE/FALSE/NOT GIVEN, YES/NO/NOT GIVEN, Matching Headings, Matching Features, Sentence Endings, Summary (word box), Note Completion, Multiple Choice. Tô sáng văn bản, bảng điều hướng câu hỏi, tự lưu bài làm dở, giải thích chỉ rõ bằng chứng cho **từng** đáp án. |
| **Writing** | Task 1 Academic (line, bar, table, process — biểu đồ SVG), Task 1 General Training (thư trang trọng/bán trang trọng/thân mật), Task 2 (7 dạng đề). Bấm giờ, đếm từ theo cách IELTS, tự lưu nháp, phân tích văn bản (độ dài, chia đoạn, overview, quan điểm, từ nối lạm dụng, từ lặp, viết tắt, đa dạng câu/từ vựng), tự chấm theo band descriptors, bài mẫu có chú giải. |
| **Speaking** | Mô phỏng bài thi đầy đủ Part 1 → 2 → 3: giám khảo đọc câu hỏi, đồng hồ Part 2 chuẩn (1 phút chuẩn bị + tối đa 2 phút nói), ghi âm toàn bộ để nghe lại/tải về, transcript tự động (nếu trình duyệt hỗ trợ), tốc độ nói (từ/phút), từ đệm, tự chấm theo 4 tiêu chí. |
| **Từ vựng & ngữ pháp** | Từ vựng học thuật theo chủ đề Task 2/Part 3 kèm collocation, flashcard với thuật toán lặp lại ngắt quãng (SM-2), ngữ pháp trọng tâm band 7+ và lỗi phổ biến của người Việt. |
| **Theo dõi** | Band từng kỹ năng, Overall ước tính, lộ trình gợi ý theo ngày thi và kỹ năng yếu nhất, biểu đồ tiến độ, lịch hoạt động, sao lưu/khôi phục JSON. |

## Tính chính xác & logic chấm điểm

- **Overall band**: trung bình 4 kỹ năng, làm tròn tới nửa band gần nhất; mốc .25 → lên .5, mốc .75 → lên band nguyên (đúng quy tắc chính thức).
- **Listening/Reading**: quy đổi theo bảng tham khảo khớp các mốc chính thức được công bố (Listening & Academic Reading: 16→5, 23→6, 30→7, 35→8; GT Reading: 15→4, 23→5, 30→6, 34→7, 38→8).
- **Điền từ**: không phân biệt hoa/thường; chấp nhận biến thể chính tả được liệt kê; **vượt giới hạn từ = sai**, sai chính tả = sai; từ có gạch nối tính là 1 từ.
- **Writing**: Task 2 trọng số gấp đôi Task 1; band tự chấm làm tròn xuống (ước tính thận trọng).
- **Band descriptors**: tóm tắt từ bản công khai sửa đổi tháng 5/2023.
- Định dạng đề, thời gian, One Skill Retake, IELTS Online, UKVI… được mô tả trong mục *Cấu trúc & Chấm điểm*.

Toàn bộ logic chấm điểm nằm trong `js/scoring.js` (hàm thuần, không phụ thuộc DOM) và được kiểm thử. Bộ kiểm thử nội dung đảm bảo: đánh số 1–40 liên tục, đáp án nằm trong phương án, đáp án điền từ xuất hiện nguyên văn trong bài đọc/được nói (hoặc đánh vần) trong bài nghe, không vượt giới hạn từ của chính câu hỏi, mọi câu đều có giải thích.

> Ứng dụng độc lập, không liên kết với British Council, IDP hay Cambridge University Press & Assessment. Đề luyện tập là nội dung biên soạn mới; dữ liệu biểu đồ Task 1 mang tính minh họa.

## Chạy cục bộ

Không cần build. Chỉ cần một static server (service worker yêu cầu `http://localhost` hoặc HTTPS):

```bash
npm start            # = python3 -m http.server 8080
# mở http://localhost:8080
```

Kiểm thử (Node ≥ 20):

```bash
npm test
```

## Triển khai

Workflow `.github/workflows/pages.yml` chạy kiểm thử và triển khai lên GitHub Pages khi push vào `main`. Bật một lần tại **Settings → Pages → Build and deployment → Source: GitHub Actions**. Mọi đường dẫn đều tương đối nên ứng dụng chạy được ở thư mục con (`/<repo>/`).

Khi sửa bất kỳ file nào được cache, tăng `VERSION` trong `sw.js` để người dùng nhận bản cập nhật (ứng dụng sẽ hiện nút "Cập nhật").

## Cấu trúc

```
index.html, manifest.webmanifest, sw.js   PWA shell, manifest, service worker (offline)
css/app.css                               Giao diện (sáng/tối, responsive)
js/app.js                                 Router (hash), đăng ký service worker
js/scoring.js                             Logic chấm điểm, quy đổi band, phân tích Writing/Speaking, SRS
js/store.js                               Lưu trữ localStorage có versioning
js/quiz.js, tts.js, charts.js, ui.js      Engine câu hỏi, giọng đọc, biểu đồ SVG, tiện ích
js/data/*                                 Đề thi, band descriptors, cấu trúc đề, từ vựng
js/views/*                                Các màn hình
tests/*                                   Kiểm thử logic & tính toàn vẹn nội dung
tools/make-icons.cjs                      Tạo icon PNG từ SVG (Playwright)
```

## Trình duyệt

Chrome/Edge (đầy đủ nhất, gồm nhận dạng giọng nói), Safari iOS/macOS, Firefox (không có nhận dạng giọng nói — vẫn ghi âm và tự chấm được). Chất lượng giọng đọc phụ thuộc giọng có sẵn trên hệ điều hành.
