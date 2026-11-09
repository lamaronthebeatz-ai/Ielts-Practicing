// IELTS test format overview. Based on publicly available information from the
// test owners (British Council, IDP IELTS, Cambridge University Press & Assessment).
// Policies such as result times and One Skill Retake availability vary by country
// and test centre — always confirm with your local centre before booking.

export const FORMAT_UPDATED = '2026';

export const skills = [
  {
    key: 'listening', name: 'Listening', time: '≈ 30 phút (+10 phút chép đáp án nếu thi giấy; 2 phút kiểm tra nếu thi máy)', questions: '40 câu · 4 phần',
    same: 'Giống nhau cho Academic và General Training',
    parts: [
      'Part 1: hội thoại 2 người, bối cảnh đời sống (đặt chỗ, đăng ký…).',
      'Part 2: độc thoại, bối cảnh đời sống (giới thiệu địa điểm, sự kiện…).',
      'Part 3: hội thoại tối đa 4 người, bối cảnh học thuật (sinh viên – giảng viên).',
      'Part 4: độc thoại học thuật (bài giảng).',
    ],
    notes: ['Mỗi câu 1 điểm; nghe một lần duy nhất.', 'Dạng câu hỏi: multiple choice, matching, plan/map/diagram labelling, form/note/table/flow-chart/summary completion, sentence completion.', 'Sai chính tả và vượt giới hạn từ đều bị tính sai.'],
  },
  {
    key: 'reading', name: 'Reading', time: '60 phút (không có thời gian chép đáp án thêm)', questions: '40 câu · 3 phần',
    same: 'Khác nhau giữa Academic và General Training',
    parts: [
      'Academic: 3 bài đọc dài, lấy từ sách, tạp chí, báo — chủ đề học thuật phổ thông.',
      'General Training: Section 1 (2–3 văn bản ngắn đời sống), Section 2 (2 văn bản liên quan công việc), Section 3 (1 văn bản dài chủ đề chung).',
    ],
    notes: ['Dạng câu hỏi: multiple choice, TRUE/FALSE/NOT GIVEN, YES/NO/NOT GIVEN, matching information/headings/features/sentence endings, sentence/summary/note/table/flow-chart completion, diagram label completion, short-answer questions.', 'Bảng quy đổi điểm của GT khắt khe hơn Academic (cần nhiều câu đúng hơn cho cùng band).'],
  },
  {
    key: 'writing', name: 'Writing', time: '60 phút', questions: '2 bài',
    same: 'Task 1 khác nhau; Task 2 cùng dạng (bài luận)',
    parts: [
      'Task 1 Academic (≥150 từ, gợi ý 20 phút): mô tả biểu đồ đường/cột/tròn, bảng, quy trình, bản đồ.',
      'Task 1 General Training (≥150 từ, gợi ý 20 phút): viết thư (trang trọng, bán trang trọng, thân mật) theo 3 gạch đầu dòng.',
      'Task 2 (≥250 từ, gợi ý 40 phút): bài luận trình bày quan điểm/thảo luận/giải pháp…',
    ],
    notes: ['Task 2 chiếm trọng số gấp đôi Task 1.', '4 tiêu chí ngang nhau: Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.', 'Bài dưới số từ tối thiểu bị trừ điểm; nội dung học thuộc hoặc lạc đề bị đánh giá thấp; từ chép nguyên văn từ đề không được tính.'],
  },
  {
    key: 'speaking', name: 'Speaking', time: '11–14 phút', questions: '3 phần',
    same: 'Giống nhau cho Academic và General Training',
    parts: [
      'Part 1 (4–5 phút): giới thiệu và trả lời câu hỏi về chủ đề quen thuộc.',
      'Part 2 (3–4 phút): cue card — 1 phút chuẩn bị (có giấy bút), nói tối đa 2 phút, có thể có 1–2 câu hỏi kết thúc.',
      'Part 3 (4–5 phút): thảo luận trừu tượng, mở rộng từ chủ đề Part 2.',
    ],
    notes: ['Phỏng vấn trực tiếp với giám khảo (face-to-face hoặc video call tùy địa điểm), được ghi âm.', '4 tiêu chí ngang nhau: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.'],
  },
];

export const scoringRules = [
  'Mỗi kỹ năng được chấm theo thang 0–9, có nửa band (ví dụ 6.5).',
  'Overall = trung bình 4 kỹ năng, làm tròn đến nửa band gần nhất: x.25 → làm tròn lên x.5; x.75 → làm tròn lên (x+1).0; thấp hơn các mốc này làm tròn xuống.',
  'Ví dụ: L 6.5, R 6.5, W 5.0, S 7.0 → TB 6.25 → Overall 6.5. L 4.0, R 3.5, W 4.0, S 4.0 → TB 3.875 → Overall 4.0. L 6.5, R 6.5, W 5.5, S 6.0 → TB 6.125 → Overall 6.0.',
];

export const testOptions = [
  { name: 'IELTS Academic', desc: 'Dành cho du học đại học/sau đại học và đăng ký hành nghề chuyên môn.' },
  { name: 'IELTS General Training', desc: 'Dành cho định cư (Úc, Canada, New Zealand, Anh…), làm việc hoặc học nghề/trung học.' },
  { name: 'IELTS for UKVI', desc: 'Phiên bản được UK Visas and Immigration chấp nhận cho hồ sơ visa Anh (nội dung giống Academic/GT, tổ chức tại trung tâm được phê duyệt).' },
  { name: 'IELTS Life Skills (A1, A2, B1)', desc: 'Chỉ kiểm tra Nghe và Nói, phục vụ một số loại visa Anh.' },
  { name: 'Hình thức thi', desc: 'Thi trên giấy hoặc trên máy tính tại trung tâm; IELTS Online (thi tại nhà) ở một số quốc gia và mục đích. Nội dung, độ khó và cách chấm như nhau giữa các hình thức.' },
  { name: 'One Skill Retake', desc: 'Ở nhiều trung tâm (thi trên máy tính), thí sinh có thể thi lại MỘT kỹ năng trong vòng 60 ngày sau bài thi gốc. Chỉ dùng được nếu tổ chức tiếp nhận chấp nhận — cần kiểm tra trước.' },
  { name: 'Kết quả', desc: 'Thi máy tính: thường có trong vài ngày; thi giấy: khoảng 13 ngày. Hầu hết tổ chức chấp nhận kết quả trong 2 năm.' },
];
