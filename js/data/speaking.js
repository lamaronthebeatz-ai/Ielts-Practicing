// Speaking question bank (original questions in the style of the current test).
// Part 1: 4–5 min, familiar topics. Part 2: 1 min preparation + up to 2 min talk
// (the examiner stops you at 2 min). Part 3: 4–5 min, abstract discussion linked to Part 2.

export const part1 = [
  { topic: 'Work or studies', qs: ['Do you work or are you a student?', 'What do you like most about your job/studies?', 'Is there anything you would like to change about it?', 'Do you think you will do the same kind of work in the future?'] },
  { topic: 'Hometown', qs: ['Where is your hometown?', 'What do you like about living there?', 'How has your hometown changed in recent years?', 'Would you recommend it to tourists? Why?'] },
  { topic: 'Accommodation', qs: ['Do you live in a house or an apartment?', 'Which room do you spend the most time in?', 'What would you like to change about your home?', 'Would you prefer to live in the city centre or the suburbs?'] },
  { topic: 'Daily routine', qs: ['What is the busiest part of your day?', 'Do you prefer mornings or evenings?', 'Has your routine changed since you were a child?', 'Do you like to plan your day in advance?'] },
  { topic: 'Weather', qs: ['What is the weather usually like where you live?', 'What kind of weather do you like best?', 'Does the weather affect your mood?', 'Do you check the weather forecast regularly?'] },
  { topic: 'Mobile phones', qs: ['How often do you use your phone?', 'What do you mainly use it for?', 'Could you live without a phone for a week?', 'Do you think people spend too much time on their phones?'] },
  { topic: 'Reading', qs: ['Do you enjoy reading?', 'What kinds of things do you read?', 'Do you prefer printed books or e-books?', 'Did you read much when you were a child?'] },
  { topic: 'Music', qs: ['What kind of music do you like?', 'When do you usually listen to music?', 'Have you ever learnt to play an instrument?', 'Is music important in your culture?'] },
  { topic: 'Food & cooking', qs: ['What is your favourite food?', 'Do you often cook at home?', 'Is there any food you disliked as a child but enjoy now?', 'Do you prefer eating at home or eating out?'] },
  { topic: 'Public transport', qs: ['How do you usually travel around your city?', 'Is public transport good where you live?', 'How could public transport be improved?', 'Did you use public transport much as a child?'] },
];

export const part2 = [
  {
    id: 'c-skill', card: 'Describe a skill that took you a long time to learn.',
    bullets: ['what the skill was', 'when and how you learnt it', 'why it took a long time', 'and explain how you felt when you finally learnt it.'],
    part3: ['What skills do young people need most nowadays?', 'Is it better to learn skills at school or through experience?', 'Why do some people give up learning new skills quickly?', 'How has technology changed the way people learn skills?'],
  },
  {
    id: 'c-place', card: 'Describe a quiet place you like to visit.',
    bullets: ['where it is', 'how often you go there', 'what you do there', 'and explain why you like this place.'],
    part3: ['Why do some people prefer quiet places?', 'Is it harder to find quiet places in cities today?', 'Should governments create more green spaces in cities?', 'How does noise pollution affect people\'s lives?'],
  },
  {
    id: 'c-person', card: 'Describe a person who has had a positive influence on your life.',
    bullets: ['who this person is', 'how you know them', 'what they have done', 'and explain how they have influenced you.'],
    part3: ['Who has more influence on children: parents or teachers?', 'Do celebrities have a responsibility to be good role models?', 'How has social media changed who young people admire?', 'What qualities make someone a good leader?'],
  },
  {
    id: 'c-decision', card: 'Describe an important decision you made.',
    bullets: ['what the decision was', 'when you made it', 'how you made it', 'and explain why it was important.'],
    part3: ['What important decisions do young people have to make?', 'Should parents make decisions for their children?', 'Why do some people find it hard to make decisions?', 'Is it better to make decisions quickly or slowly?'],
  },
  {
    id: 'c-tech', card: 'Describe a piece of technology that you find useful.',
    bullets: ['what it is', 'when you got it', 'how you use it', 'and explain why you find it useful.'],
    part3: ['How has technology changed the way people communicate?', 'Are older people disadvantaged by rapid technological change?', 'Do you think people rely too much on technology?', 'What technology will be most important in the future?'],
  },
  {
    id: 'c-event', card: 'Describe a celebration or festival you enjoyed.',
    bullets: ['what it was', 'when and where it took place', 'what people did', 'and explain why you enjoyed it.'],
    part3: ['Why are traditional festivals important?', 'Have festivals become too commercial?', 'How do festivals in cities differ from those in the countryside?', 'Should children learn about other countries\' festivals?'],
  },
  {
    id: 'c-book', card: 'Describe a book or film that made you think.',
    bullets: ['what it was', 'when you read or watched it', 'what it was about', 'and explain why it made you think.'],
    part3: ['Do people read less than in the past?', 'Should films based on true stories be completely accurate?', 'What is the role of art in society?', 'Why are some books still popular after hundreds of years?'],
  },
  {
    id: 'c-environment', card: 'Describe something you do to help the environment.',
    bullets: ['what you do', 'when you started doing it', 'how difficult or easy it is', 'and explain why you do it.'],
    part3: ['Whose responsibility is it to protect the environment: individuals or governments?', 'Why do some people not care about environmental problems?', 'Should companies be punished for pollution?', 'How can schools teach children to protect the environment?'],
  },
];

export const speakingTips = [
  { part: 'Part 1 (4–5 phút)', tips: ['Trả lời 2–3 câu: câu trả lời trực tiếp + lý do/ví dụ. Không trả lời một từ, cũng không nói quá dài.', 'Dùng thì đúng theo câu hỏi (hiện tại, quá khứ khi hỏi về tuổi thơ, tương lai).', 'Không học thuộc câu trả lời — giám khảo được đào tạo để nhận ra và chuyển câu hỏi.'] },
  { part: 'Part 2 (1 phút chuẩn bị + tối đa 2 phút nói)', tips: ['Dùng 1 phút ghi từ khóa (không viết câu) cho mỗi bullet point.', 'Nói liên tục 1,5–2 phút; giám khảo sẽ dừng bạn khi hết 2 phút. Bullet cuối (explain…) quan trọng nhất — dành nhiều thời gian nhất.', 'Kể theo trình tự rõ ràng, dùng thì quá khứ chính xác nếu kể trải nghiệm.'] },
  { part: 'Part 3 (4–5 phút)', tips: ['Câu hỏi trừu tượng, mang tính xã hội — trả lời kiểu: quan điểm → lý do → ví dụ → (so sánh/hệ quả).', 'Dùng cấu trúc suy đoán và hedging: It depends on…, I would say that…, This is likely to…', 'Được phép xin thời gian suy nghĩ tự nhiên: "That\'s an interesting question — I\'ve never really thought about it, but…"'] },
  { part: 'Chung', tips: ['4 tiêu chí ngang nhau 25%: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.', 'Phát âm không đòi hỏi giọng bản xứ: quan trọng là dễ hiểu, trọng âm, ngữ điệu, âm cuối (ending sounds — lỗi phổ biến của người Việt).', 'Bài thi được ghi âm; Speaking luôn là hội thoại trực tiếp với giám khảo (trực tiếp hoặc qua video call tùy địa điểm).'] },
];
