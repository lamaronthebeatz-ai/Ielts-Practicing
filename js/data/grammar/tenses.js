// Chương 1 — Thì của động từ (Tenses) và thể (aspect).
// Cấu trúc mỗi chủ điểm: what (giải nghĩa), forms (công thức), uses (cách dùng + ví dụ),
// ielts (ứng dụng thực chiến), mistakes ([sai, đúng, ghi chú]), quiz ([câu hỏi, lựa chọn, đáp án index, giải thích]).

export const chapter = { id: 'tenses', title: '1. Thì & thể của động từ', en: 'Tenses and aspect' };

export const topics = [
  {
    id: 'present-simple',
    title: 'Hiện tại đơn',
    en: 'Present simple',
    what: 'Diễn tả sự thật, quy luật, thói quen, trạng thái lâu dài. Là thì "mặc định" của văn học thuật khi trình bày sự thật chung, quan điểm và mô tả quy trình (process).',
    forms: [
      ['Khẳng định', 'S + V(s/es)   ·   S + am/is/are + N/Adj'],
      ['Phủ định', 'S + do/does + not + V   ·   S + am/is/are + not'],
      ['Nghi vấn', 'Do/Does + S + V?   ·   Am/Is/Are + S …?'],
      ['Bị động', 'S + am/is/are + V3/ed'],
    ],
    uses: [
      ['Sự thật, chân lý, kiến thức chung', 'Water boils at 100°C at sea level.'],
      ['Quan điểm, lập luận trong Task 2', 'I believe that free tuition benefits society as a whole.'],
      ['Mô tả biểu đồ/bảng/sơ đồ ở dạng tổng quát', 'The chart shows / compares / illustrates …'],
      ['Quy trình (thường ở thể bị động)', 'The bottles are sorted by colour and then crushed.'],
      ['Thói quen, tần suất (Speaking Part 1)', 'I usually cycle to work, but I take the bus when it rains.'],
    ],
    ielts: [
      'Câu mở bài Task 1: "The line graph compares …" (luôn hiện tại đơn, kể cả khi dữ liệu ở quá khứ).',
      'Process diagram: dùng hiện tại đơn bị động xuyên suốt; mỗi bước một động từ chính rõ ràng.',
      'Speaking Part 1 về thói quen: kết hợp trạng từ tần suất (usually, tend to, hardly ever).',
    ],
    mistakes: [
      ['The number of cars increase every year.', 'The number of cars increases every year.', '"The number of" là chủ ngữ số ít.'],
      ['Many people doesn\'t agree.', 'Many people don\'t agree.', 'Chủ ngữ số nhiều dùng do not.'],
      ['The chart is showing the data.', 'The chart shows the data.', 'show là động từ chỉ trạng thái trong ngữ cảnh này — không dùng tiếp diễn.'],
    ],
    quiz: [
      ['The diagram ___ how glass is recycled.', ['is showing', 'shows', 'showed', 'has shown'], 1, 'Mô tả biểu đồ dùng hiện tại đơn: shows.'],
      ['Each of the students ___ a laptop.', ['have', 'are having', 'has', 'having'], 2, '"Each of + N số nhiều" đi với động từ số ít.'],
      ['Finally, the glass ___ into new bottles.', ['moulds', 'is moulded', 'is moulding', 'moulded'], 1, 'Quy trình → hiện tại đơn bị động.'],
    ],
  },
  {
    id: 'present-continuous',
    title: 'Hiện tại tiếp diễn',
    en: 'Present continuous',
    what: 'Hành động đang diễn ra quanh thời điểm nói, tình huống tạm thời, xu hướng đang thay đổi, hoặc kế hoạch đã sắp xếp trong tương lai gần.',
    forms: [
      ['Khẳng định', 'S + am/is/are + V-ing'],
      ['Phủ định', 'S + am/is/are + not + V-ing'],
      ['Nghi vấn', 'Am/Is/Are + S + V-ing?'],
      ['Bị động', 'S + am/is/are + being + V3/ed'],
    ],
    uses: [
      ['Xu hướng đang diễn ra (rất hữu ích cho Task 2)', 'More and more people are working from home.'],
      ['Tình huống tạm thời', 'I\'m living with my cousin until I find a flat.'],
      ['Kế hoạch đã sắp xếp', 'I\'m taking the test next Saturday.'],
      ['Phàn nàn với always', 'He is always interrupting me.'],
    ],
    ielts: [
      'Mở bài Task 2 về xu hướng: "An increasing number of young people are choosing to …".',
      'Speaking: phân biệt "I work in a bank" (lâu dài) và "I\'m working on a project at the moment" (tạm thời).',
      'Động từ trạng thái (know, believe, belong, contain, consist, seem, own…) thường KHÔNG dùng tiếp diễn.',
    ],
    mistakes: [
      ['I am knowing the answer.', 'I know the answer.', 'know là động từ trạng thái.'],
      ['Nowadays people use more and more online banking.', 'Nowadays more and more people are using online banking.', 'Xu hướng đang thay đổi → tiếp diễn tự nhiên hơn.'],
    ],
    quiz: [
      ['Cities ___ rapidly, which puts pressure on housing.', ['grow', 'are growing', 'grew', 'have grown up'], 1, 'Xu hướng đang diễn ra → are growing.'],
      ['This report ___ three sections.', ['is containing', 'contains', 'is contained', 'contain'], 1, 'contain là động từ trạng thái → hiện tại đơn.'],
      ['I ___ my grandparents this weekend — it\'s all arranged.', ['visit', 'will visiting', 'am visiting', 'have visited'], 2, 'Kế hoạch đã sắp xếp → hiện tại tiếp diễn.'],
    ],
  },
  {
    id: 'present-perfect',
    title: 'Hiện tại hoàn thành',
    en: 'Present perfect',
    what: 'Nối quá khứ với hiện tại: hành động/thay đổi xảy ra trong khoảng thời gian chưa kết thúc, kinh nghiệm sống, kết quả còn ảnh hưởng đến hiện tại.',
    forms: [
      ['Khẳng định', 'S + have/has + V3/ed'],
      ['Phủ định', 'S + have/has + not + V3/ed'],
      ['Nghi vấn', 'Have/Has + S + V3/ed?'],
      ['Bị động', 'S + have/has + been + V3/ed'],
      ['Dấu hiệu', 'since + mốc · for + khoảng · so far · recently · over the past decade · in recent years · already · yet · ever · never'],
    ],
    uses: [
      ['Thay đổi trong khoảng thời gian đến nay', 'Internet use has risen dramatically over the past two decades.'],
      ['Kinh nghiệm (Speaking)', 'I have never been abroad, but I\'d love to visit Japan.'],
      ['Kết quả hiện tại', 'The government has introduced a sugar tax, so soft drinks now cost more.'],
      ['Với since / for', 'She has worked here since 2019 / for six years.'],
    ],
    ielts: [
      'Mở bài Task 2: "In recent years, remote work has become increasingly common."',
      'Không dùng hiện tại hoàn thành với mốc quá khứ xác định (in 2010, last year, ago) → dùng quá khứ đơn.',
      'Task 1 có dữ liệu dự báo tới nay? Thông thường dữ liệu quá khứ dùng quá khứ đơn, KHÔNG dùng hiện tại hoàn thành.',
    ],
    mistakes: [
      ['I have visited London in 2019.', 'I visited London in 2019.', 'Mốc quá khứ xác định → quá khứ đơn.'],
      ['Technology has changed our lives since many years.', 'Technology has changed our lives for many years / since the 1990s.', 'for + khoảng thời gian; since + mốc.'],
      ['Between 2000 and 2010, the figure has doubled.', 'Between 2000 and 2010, the figure doubled.', 'Khoảng thời gian đã kết thúc → quá khứ đơn.'],
    ],
    quiz: [
      ['Over the last ten years, house prices ___ significantly.', ['rose', 'have risen', 'are rising', 'had risen'], 1, 'Khoảng thời gian kéo dài đến hiện tại → have risen.'],
      ['The museum ___ in 1902.', ['has opened', 'opened', 'has been opened', 'is opened'], 1, 'Mốc quá khứ xác định → opened.'],
      ['I ___ this book three times so far.', ['read', 'am reading', 'have read', 'had read'], 2, '"so far" → hiện tại hoàn thành.'],
    ],
  },
  {
    id: 'present-perfect-continuous',
    title: 'Hiện tại hoàn thành tiếp diễn',
    en: 'Present perfect continuous',
    what: 'Nhấn mạnh quá trình/độ dài của một hoạt động bắt đầu trong quá khứ và còn tiếp diễn (hoặc vừa dừng, để lại dấu vết).',
    forms: [
      ['Khẳng định', 'S + have/has + been + V-ing'],
      ['Phủ định', 'S + have/has + not + been + V-ing'],
      ['Nghi vấn', 'Have/Has + S + been + V-ing?'],
    ],
    uses: [
      ['Độ dài của hoạt động đến nay', 'I have been studying English for eight years.'],
      ['Hoạt động vừa dừng, còn dấu vết', 'The roads are wet — it has been raining.'],
      ['Xu hướng kéo dài', 'Scientists have been warning about climate change for decades.'],
    ],
    ielts: [
      'Speaking Part 1: "How long have you been learning English?" → "I\'ve been learning it since primary school."',
      'So sánh: "I have read the book" (xong, kết quả) vs "I have been reading the book" (quá trình, chưa chắc xong).',
    ],
    mistakes: [
      ['I am learning English for five years.', 'I have been learning English for five years.', 'Hoạt động kéo dài đến hiện tại + for → hoàn thành tiếp diễn.'],
      ['I have been knowing her for years.', 'I have known her for years.', 'Động từ trạng thái không dùng dạng tiếp diễn.'],
    ],
    quiz: [
      ['She is tired because she ___ all day.', ['worked', 'has been working', 'works', 'is worked'], 1, 'Hoạt động kéo dài vừa dừng, để lại kết quả (mệt).'],
      ['How long ___ in this city?', ['do you live', 'are you living', 'have you been living', 'did you live'], 2, 'Hỏi độ dài đến hiện tại.'],
      ['I ___ him since we were at school.', ['have been knowing', 'know', 'have known', 'am knowing'], 2, 'know là động từ trạng thái → have known.'],
    ],
  },
  {
    id: 'past-simple',
    title: 'Quá khứ đơn',
    en: 'Past simple',
    what: 'Hành động/trạng thái đã kết thúc tại một thời điểm hoặc khoảng thời gian xác định trong quá khứ. Là thì chính khi mô tả dữ liệu quá khứ trong Task 1.',
    forms: [
      ['Khẳng định', 'S + V2/ed   ·   S + was/were + N/Adj'],
      ['Phủ định', 'S + did not + V   ·   S + was/were + not'],
      ['Nghi vấn', 'Did + S + V?   ·   Was/Were + S …?'],
      ['Bị động', 'S + was/were + V3/ed'],
    ],
    uses: [
      ['Dữ liệu quá khứ trong Task 1', 'In 2000, 45% of households had internet access.'],
      ['Chuỗi sự kiện', 'The factory closed in 1995, and the site was later converted into a park.'],
      ['Kể chuyện (Speaking Part 2)', 'I first went there when I was about twelve.'],
    ],
    ielts: [
      'Task 1 với năm quá khứ: dùng quá khứ đơn cho TẤT CẢ số liệu (rose, fell, peaked, remained).',
      'Map Task 1 (so sánh 2 thời điểm): quá khứ đơn bị động — "The farmland was replaced by a housing estate."',
      'Part 2 kể kỷ niệm: quá khứ đơn là xương sống, xen quá khứ tiếp diễn cho bối cảnh.',
    ],
    mistakes: [
      ['In 1990, the figure is 20%.', 'In 1990, the figure was 20%.', 'Mốc quá khứ → quá khứ đơn.'],
      ['The sales rised sharply.', 'The sales rose sharply.', 'rise – rose – risen (bất quy tắc).'],
      ['The number of visitors was fell.', 'The number of visitors fell.', 'fall là nội động từ, không có bị động.'],
    ],
    quiz: [
      ['The percentage ___ to a peak of 60% in 2015.', ['rises', 'rose', 'has risen', 'was risen'], 1, 'Mốc quá khứ → rose.'],
      ['In 2005, the old library ___ .', ['demolished', 'was demolished', 'has demolished', 'demolishes'], 1, 'Thư viện bị phá → bị động quá khứ.'],
      ['The figure ___ steady at around 30% between 2010 and 2015.', ['remained', 'was remained', 'has remained', 'remains'], 0, 'remain là nội động từ, quá khứ đơn chủ động.'],
    ],
  },
  {
    id: 'past-continuous',
    title: 'Quá khứ tiếp diễn',
    en: 'Past continuous',
    what: 'Hành động đang diễn ra tại một thời điểm trong quá khứ, làm bối cảnh cho sự kiện khác, hoặc hai hành động song song.',
    forms: [
      ['Khẳng định', 'S + was/were + V-ing'],
      ['Phủ định', 'S + was/were + not + V-ing'],
      ['Nghi vấn', 'Was/Were + S + V-ing?'],
    ],
    uses: [
      ['Bối cảnh bị một sự kiện xen vào', 'I was waiting for the bus when I met my old teacher.'],
      ['Hai hành động song song', 'While my father was cooking, my sister was setting the table.'],
      ['Bối cảnh câu chuyện', 'The sun was shining and everyone was in a good mood.'],
    ],
    ielts: [
      'Speaking Part 2 kể trải nghiệm: mở đầu bằng bối cảnh tiếp diễn rồi chuyển sang quá khứ đơn cho sự kiện chính.',
      'Ít dùng trong Writing Task 1/2.',
    ],
    mistakes: [
      ['When I was arriving, the film started.', 'When I arrived, the film was starting / had started.', 'Hành động ngắn xen vào dùng quá khứ đơn.'],
    ],
    quiz: [
      ['I ___ dinner when the phone rang.', ['had', 'was having', 'have had', 'am having'], 1, 'Hành động đang diễn ra bị xen ngang.'],
      ['While she ___ abroad, she learnt three languages.', ['was living', 'lives', 'has lived', 'is living'], 0, 'Bối cảnh kéo dài trong quá khứ.'],
      ['When the alarm went off, everyone immediately ___ the building.', ['was leaving', 'left', 'leaves', 'had been left'], 1, '"immediately" — phản ứng ngay sau sự kiện → quá khứ đơn.'],
    ],
  },
  {
    id: 'past-perfect',
    title: 'Quá khứ hoàn thành (& tiếp diễn)',
    en: 'Past perfect (and continuous)',
    what: 'Hành động xảy ra TRƯỚC một thời điểm/hành động khác trong quá khứ ("quá khứ của quá khứ"). Dạng tiếp diễn nhấn mạnh quá trình kéo dài trước mốc đó.',
    forms: [
      ['Quá khứ hoàn thành', 'S + had + V3/ed'],
      ['Quá khứ hoàn thành tiếp diễn', 'S + had + been + V-ing'],
      ['Bị động', 'S + had + been + V3/ed'],
      ['Dấu hiệu', 'by + mốc quá khứ · by the time · before · after · already · when'],
    ],
    uses: [
      ['Mốc "by + năm" trong Task 1', 'By 2010, the figure had doubled.'],
      ['Thứ tự hai hành động', 'When I arrived, the lecture had already started.'],
      ['Quá trình trước mốc quá khứ', 'She had been working there for ten years before she was promoted.'],
      ['Câu điều kiện loại 3', 'If I had known, I would have helped.'],
    ],
    ielts: [
      'Task 1: "By 2015, Brampton had overtaken Calder" — thể hiện Grammatical Range tự nhiên.',
      'Chỉ dùng khi cần làm rõ thứ tự; lạm dụng làm câu nặng nề.',
    ],
    mistakes: [
      ['By 2000, the population reached 5 million.', 'By 2000, the population had reached 5 million.', '"By + mốc quá khứ" → quá khứ hoàn thành.'],
      ['I had visited Paris last year.', 'I visited Paris last year.', 'Không có mốc quá khứ thứ hai → quá khứ đơn.'],
    ],
    quiz: [
      ['By the end of the period, sales ___ by 40%.', ['increased', 'had increased', 'have increased', 'were increasing'], 1, '"By the end of the period" (quá khứ) → had increased.'],
      ['The train ___ when we got to the station.', ['already left', 'has already left', 'had already left', 'was leaving already'], 2, 'Tàu đi trước khi chúng tôi đến.'],
      ['They ___ for hours before help arrived.', ['had been walking', 'have walked', 'were walked', 'walk'], 0, 'Quá trình kéo dài trước mốc quá khứ.'],
    ],
  },
  {
    id: 'future-forms',
    title: 'Các cách diễn đạt tương lai',
    en: 'Future forms',
    what: 'Tiếng Anh không có một "thì tương lai" duy nhất. Lựa chọn hình thức phụ thuộc vào mức độ chắc chắn, kế hoạch hay dự đoán.',
    forms: [
      ['will + V', 'dự đoán, quyết định tức thời, hứa hẹn'],
      ['be going to + V', 'dự định đã có; dự đoán có bằng chứng hiện tại'],
      ['Hiện tại tiếp diễn', 'kế hoạch đã sắp xếp (thời gian, địa điểm)'],
      ['Hiện tại đơn', 'lịch trình cố định (timetable)'],
      ['be + to-V / be about to / be on the point of', 'sắp xếp chính thức; sắp xảy ra'],
    ],
    uses: [
      ['Dự đoán', 'Artificial intelligence will transform many professions.'],
      ['Dự định', 'I\'m going to study for a master\'s degree in Australia.'],
      ['Dự đoán có bằng chứng', 'Look at those clouds — it\'s going to rain.'],
      ['Lịch trình', 'The exam starts at 8.30 tomorrow.'],
      ['Mệnh đề thời gian: dùng hiện tại, KHÔNG dùng will', 'When I finish university, I will look for a job abroad.'],
    ],
    ielts: [
      'Speaking Part 1 "What are your plans?": dùng be going to / be planning to / hope to.',
      'Task 2 dự đoán: kết hợp hedging — "is likely to", "may well", "will probably".',
      'Sau when, as soon as, before, after, until, once: dùng hiện tại đơn/hiện tại hoàn thành cho tương lai.',
    ],
    mistakes: [
      ['When I will graduate, I will work in a bank.', 'When I graduate, I will work in a bank.', 'Mệnh đề thời gian không dùng will.'],
      ['I will meet my friend tonight at 7 — we booked a table.', 'I\'m meeting my friend tonight at 7.', 'Kế hoạch đã sắp xếp → hiện tại tiếp diễn.'],
    ],
    quiz: [
      ['As soon as I ___ my results, I will apply.', ['will get', 'get', 'am getting', 'got'], 1, 'Mệnh đề thời gian → hiện tại đơn.'],
      ['I\'ve decided: I ___ a gap year.', ['take', 'am going to take', 'took', 'have taken'], 1, 'Dự định đã quyết → be going to.'],
      ['The conference ___ on 3 June according to the programme.', ['begins', 'will be begun', 'is beginning to', 'began'], 0, 'Lịch trình cố định → hiện tại đơn.'],
    ],
  },
  {
    id: 'future-perfect-continuous',
    title: 'Tương lai tiếp diễn & tương lai hoàn thành',
    en: 'Future continuous and future perfect',
    what: 'Tương lai tiếp diễn: hành động đang diễn ra tại một thời điểm tương lai. Tương lai hoàn thành: hành động sẽ hoàn tất TRƯỚC một mốc tương lai — rất hữu ích cho số liệu dự báo.',
    forms: [
      ['Tương lai tiếp diễn', 'S + will + be + V-ing'],
      ['Tương lai hoàn thành', 'S + will + have + V3/ed'],
      ['Tương lai hoàn thành bị động', 'S + will + have + been + V3/ed'],
    ],
    uses: [
      ['Dự báo đến một mốc (Task 1)', 'By 2040, the proportion of elderly people will have reached 25%.'],
      ['Hành động đang diễn ra trong tương lai', 'This time next year, I will be studying in Melbourne.'],
    ],
    ielts: [
      'Task 1 có dữ liệu dự báo (2030, 2050): "is projected to / is expected to / is predicted to + V" và "will have + V3" với "by".',
      'Tránh lặp "will" mãi: luân phiên "is forecast to rise", "is set to double".',
    ],
    mistakes: [
      ['By 2050, the figure will reach 80%.', 'By 2050, the figure will have reached 80%.', '"By + mốc tương lai" → tương lai hoàn thành (dạng tự nhiên hơn).'],
    ],
    quiz: [
      ['By 2030, the number of cars ___ .', ['will have doubled', 'will doubling', 'has doubled', 'doubles'], 0, 'By + mốc tương lai.'],
      ['Don\'t call at 9 — I ___ my presentation then.', ['will give', 'will be giving', 'will have given', 'give'], 1, 'Đang diễn ra tại thời điểm tương lai.'],
      ['Coal use ___ to fall to 10% by 2040.', ['projects', 'is projected', 'will project', 'has projected'], 1, 'Cấu trúc dự báo: be projected to + V.'],
    ],
  },
  {
    id: 'stative-verbs',
    title: 'Động từ trạng thái vs hành động',
    en: 'Stative vs dynamic verbs',
    what: 'Động từ trạng thái mô tả suy nghĩ, cảm xúc, sở hữu, giác quan, tính chất — thường không dùng ở dạng tiếp diễn. Một số động từ có cả hai nghĩa.',
    forms: [
      ['Suy nghĩ', 'know, believe, understand, realise, suppose, mean, doubt'],
      ['Cảm xúc', 'like, love, hate, prefer, want, need, wish'],
      ['Sở hữu/quan hệ', 'have (sở hữu), own, belong, contain, consist of, include, involve, depend'],
      ['Tính chất/giác quan', 'seem, appear, look (trông có vẻ), sound, smell, taste, cost, weigh, matter'],
    ],
    uses: [
      ['Nghĩa trạng thái', 'I think online learning is effective. (= tin rằng)'],
      ['Nghĩa hành động', 'I\'m thinking about changing my major. (= đang cân nhắc)'],
      ['have', 'She has two brothers. / She is having lunch.'],
    ],
    ielts: [
      'Lỗi "I am agree" và "I am believing" rất phổ biến và bị trừ điểm GRA — viết "I agree", "I believe".',
    ],
    mistakes: [
      ['I am agree with this view.', 'I agree with this view.', 'agree là động từ, không cần be.'],
      ['The course is consisting of four modules.', 'The course consists of four modules.', 'consist of là động từ trạng thái.'],
    ],
    quiz: [
      ['This decision ___ on the budget.', ['is depending', 'depends', 'depend', 'is depended'], 1, 'depend là động từ trạng thái.'],
      ['I ___ of moving to the countryside next year.', ['think', 'am thinking', 'thought', 'am thought'], 1, 'think (cân nhắc) là nghĩa hành động.'],
      ['Most people ___ that education is important.', ['are agree', 'agree', 'agreeing', 'are agreeing'], 1, 'agree là động từ thường.'],
    ],
  },
  {
    id: 'past-habits',
    title: 'Thói quen quá khứ: used to, would, be/get used to',
    en: 'used to / would / be used to',
    what: 'Diễn tả thói quen hoặc trạng thái trong quá khứ nay không còn; phân biệt với "quen với việc" (be/get used to + V-ing).',
    forms: [
      ['used to + V', 'thói quen/trạng thái quá khứ (nay không còn)'],
      ['would + V', 'thói quen lặp lại trong quá khứ (chỉ hành động, không dùng cho trạng thái)'],
      ['be used to + V-ing/N', 'đã quen với'],
      ['get used to + V-ing/N', 'dần quen với'],
      ['Phủ định/nghi vấn', 'didn\'t use to + V · Did you use to + V?'],
    ],
    uses: [
      ['Trạng thái quá khứ', 'There used to be a cinema in my street.'],
      ['Thói quen (would)', 'Every summer, we would go to my grandparents\' village.'],
      ['Đã quen', 'I\'m used to getting up early.'],
      ['Dần quen', 'It took me months to get used to driving on the left.'],
    ],
    ielts: [
      'Speaking Part 1 "Did you … as a child?" → "I used to …, but these days I …" — so sánh quá khứ/hiện tại rất tự nhiên.',
      'Part 2 kể kỷ niệm tuổi thơ: luân phiên used to và would để tránh lặp.',
    ],
    mistakes: [
      ['I used to living in Hanoi.', 'I used to live in Hanoi.', 'used to + V nguyên mẫu.'],
      ['I am used to get up early.', 'I am used to getting up early.', 'be used to + V-ing.'],
      ['I would have long hair as a child.', 'I used to have long hair as a child.', 'would không dùng cho trạng thái.'],
    ],
    quiz: [
      ['When I was a child, I ___ climb trees every afternoon.', ['would', 'am used to', 'was used to', 'get used to'], 0, 'Thói quen hành động quá khứ → would (hoặc used to).'],
      ['She has lived in London for years, so she\'s used to ___ in crowds.', ['travel', 'travelling', 'travelled', 'be travelling'], 1, 'be used to + V-ing.'],
      ['There ___ a lake here, but it was drained.', ['would be', 'used to be', 'is used to be', 'was used to'], 1, 'Trạng thái quá khứ → used to.'],
    ],
  },
];
