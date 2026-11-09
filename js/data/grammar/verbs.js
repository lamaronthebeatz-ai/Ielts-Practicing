// Chương 2–4 — Động từ khuyết thiếu, câu bị động, dạng của động từ.

export const chapters = [
  { id: 'modals', title: '2. Động từ khuyết thiếu', en: 'Modal verbs' },
  { id: 'passive', title: '3. Câu bị động', en: 'The passive' },
  { id: 'verb-patterns', title: '4. Dạng của động từ', en: 'Verb patterns' },
];

export const topics = [
  {
    ch: 'modals',
    id: 'modals-ability-obligation',
    title: 'Khả năng, sự cho phép, sự bắt buộc',
    en: 'Ability, permission, obligation',
    what: 'Động từ khuyết thiếu + V nguyên mẫu (không "to", không chia). Nhóm này diễn tả khả năng (can/could/be able to), cho phép (can/may), bắt buộc và lời khuyên (must/have to/need to/should/ought to).',
    forms: [
      ['Cấu trúc chung', 'S + modal + V (nguyên mẫu)   ·   S + modal + not + V'],
      ['Khả năng', 'can / could (quá khứ) / be able to (mọi thì, thành công cụ thể)'],
      ['Bắt buộc', 'must (người nói/luật) · have to (hoàn cảnh bên ngoài) · need to'],
      ['Không cần thiết', 'don\'t have to / don\'t need to / needn\'t'],
      ['Cấm', 'must not / mustn\'t / cannot'],
      ['Lời khuyên', 'should / ought to / had better (cảnh báo)'],
    ],
    uses: [
      ['Đề xuất giải pháp Task 2', 'Governments should invest more in public transport.'],
      ['Bắt buộc pháp lý', 'Drivers must not use mobile phones while driving.'],
      ['Thành công cụ thể trong quá khứ', 'Despite the storm, they were able to reach the shelter.'],
      ['Không cần thiết', 'Students don\'t have to wear uniforms at my university.'],
    ],
    ielts: [
      'Task 2 dạng giải pháp: đa dạng hoá "should" bằng "ought to", "it is essential that…", "there is a need for…".',
      'mustn\'t (cấm) ≠ don\'t have to (không bắt buộc) — nhầm lẫn làm đổi nghĩa câu.',
    ],
    mistakes: [
      ['People should to recycle more.', 'People should recycle more.', 'Modal + V nguyên mẫu không "to" (trừ ought to, have to).'],
      ['He cans speak French.', 'He can speak French.', 'Modal không chia theo ngôi.'],
      ['Yesterday I could finish the report on time.', 'Yesterday I was able to / managed to finish the report on time.', 'Thành công cụ thể một lần trong quá khứ → was able to.'],
    ],
    quiz: [
      ['You ___ bring food into the exam room — it is forbidden.', ['don\'t have to', 'mustn\'t', 'needn\'t', 'shouldn\'t have'], 1, 'Cấm → mustn\'t.'],
      ['Governments ___ introduce stricter regulations on plastic.', ['should', 'should to', 'ought', 'musts'], 0, 'should + V.'],
      ['It\'s Sunday, so I ___ get up early.', ['mustn\'t', 'don\'t have to', 'can\'t', 'shouldn\'t to'], 1, 'Không cần thiết → don\'t have to.'],
    ],
  },
  {
    ch: 'modals',
    id: 'modals-deduction',
    title: 'Suy đoán & khả năng xảy ra (hiện tại, quá khứ)',
    en: 'Speculation and deduction',
    what: 'Dùng modal để diễn tả mức độ chắc chắn. Với quá khứ dùng "modal + have + V3".',
    forms: [
      ['Chắc chắn đúng', 'must + V  ·  must have + V3'],
      ['Có thể', 'may / might / could + V  ·  may/might/could have + V3'],
      ['Chắc chắn không', 'can\'t / couldn\'t + V  ·  can\'t/couldn\'t have + V3'],
      ['Lẽ ra nên (nhưng không)', 'should have + V3'],
      ['Lẽ ra đã có thể', 'could have + V3'],
    ],
    uses: [
      ['Suy luận hiện tại', 'The lights are off; they must be asleep.'],
      ['Suy luận quá khứ', 'The road is wet — it must have rained overnight.'],
      ['Khả năng', 'Automation may lead to job losses in some sectors.'],
      ['Tiếc nuối/phê phán', 'The government should have acted sooner.'],
    ],
    ielts: [
      'Speaking Part 3 khi suy đoán nguyên nhân: "It might be because…", "They may have been influenced by…".',
      'Task 2: dùng may/might/could để tránh khẳng định tuyệt đối (hedging).',
    ],
    mistakes: [
      ['He must went home.', 'He must have gone home.', 'Suy đoán quá khứ: modal + have + V3.'],
      ['She mustn\'t be at home; her car isn\'t here.', 'She can\'t be at home; her car isn\'t here.', 'Phủ định suy luận dùng can\'t, không dùng mustn\'t.'],
    ],
    quiz: [
      ['He\'s not answering. He ___ his phone at home.', ['must leave', 'might have left', 'can leave', 'should leave'], 1, 'Suy đoán quá khứ có thể → might have left.'],
      ['That ___ be Tom — he\'s in Paris this week.', ['mustn\'t', 'can\'t', 'shouldn\'t', 'needn\'t'], 1, 'Chắc chắn không → can\'t.'],
      ['You ___ told me earlier! I could have helped.', ['should have', 'must have', 'can have', 'would'], 0, 'Phê phán việc không làm → should have.'],
    ],
  },
  {
    ch: 'passive',
    id: 'passive-forms',
    title: 'Bị động ở mọi thì',
    en: 'Passive forms',
    what: 'Dùng khi tác nhân không quan trọng, không rõ, hoặc muốn nhấn mạnh đối tượng chịu tác động. Là công cụ chính tạo văn phong khách quan trong học thuật.',
    forms: [
      ['Công thức gốc', 'S + be (chia theo thì) + V3/ed (+ by + agent)'],
      ['Hiện tại đơn / tiếp diễn', 'is/are + V3 · is/are being + V3'],
      ['Quá khứ đơn / tiếp diễn', 'was/were + V3 · was/were being + V3'],
      ['Hoàn thành', 'has/have been + V3 · had been + V3 · will have been + V3'],
      ['Với modal', 'modal + be + V3 · modal + have been + V3'],
      ['Nguyên mẫu / V-ing', 'to be + V3 · being + V3'],
    ],
    uses: [
      ['Process Task 1', 'The clay is shaped into bricks, which are then dried for 48 hours.'],
      ['Map Task 1', 'A new car park has been built / was built to the north of the station.'],
      ['Khách quan Task 2', 'Stricter penalties should be imposed on companies that pollute.'],
      ['Tác nhân quan trọng', 'Penicillin was discovered by Alexander Fleming.'],
    ],
    ielts: [
      'Chỉ nội động từ (rise, fall, happen, occur, appear, remain, die) KHÔNG có bị động.',
      'Không lạm dụng: câu bị động liên tiếp làm văn khô. Kết hợp chủ động khi tác nhân rõ ràng.',
    ],
    mistakes: [
      ['The accident was happened at night.', 'The accident happened at night.', 'happen là nội động từ.'],
      ['The bricks are dry in a kiln.', 'The bricks are dried in a kiln.', 'Thiếu V3 → sai nghĩa.'],
      ['New roads should build.', 'New roads should be built.', 'Modal bị động: modal + be + V3.'],
    ],
    quiz: [
      ['Next, the mixture ___ for two hours.', ['heats', 'is heated', 'is heating', 'heated'], 1, 'Process → hiện tại đơn bị động.'],
      ['Since 2010, three new schools ___ in the town.', ['have been built', 'were built', 'have built', 'built'], 0, 'Since → hoàn thành; trường được xây → bị động.'],
      ['The population ___ significantly.', ['was risen', 'rose', 'was rose', 'has been risen'], 1, 'rise không có bị động.'],
    ],
  },
  {
    ch: 'passive',
    id: 'impersonal-passive',
    title: 'Bị động khách quan: It is said that… / X is said to…',
    en: 'Impersonal passive & reporting structures',
    what: 'Báo cáo ý kiến chung một cách khách quan với các động từ: say, believe, think, consider, expect, report, know, estimate, claim, argue.',
    forms: [
      ['Kiểu 1', 'It + is/was + V3 + that + clause'],
      ['Kiểu 2 (cùng thì)', 'S + is/was + V3 + to + V'],
      ['Kiểu 2 (sự việc xảy ra trước)', 'S + is/was + V3 + to have + V3'],
      ['There', 'There is/are + believed/thought + to be + N'],
    ],
    uses: [
      ['Ý kiến chung', 'It is widely believed that exercise improves mental health.'],
      ['Ước tính', 'The project is estimated to cost $2 billion.'],
      ['Sự việc quá khứ', 'The city is thought to have been founded in the 10th century.'],
      ['There', 'There are thought to be fewer than 500 tigers left in the region.'],
    ],
    ielts: [
      'Mở bài Task 2: "It is often argued that…" thay cho "Many people think that…" — tăng điểm GRA và văn phong.',
      'Tránh dùng để đưa số liệu bịa; dùng như cách trình bày quan điểm phổ biến.',
    ],
    mistakes: [
      ['It is believed that he to be rich.', 'It is believed that he is rich. / He is believed to be rich.', 'Không trộn hai kiểu.'],
      ['He is said to be left last year.', 'He is said to have left last year.', 'Sự việc trước → to have + V3.'],
    ],
    quiz: [
      ['___ that the new policy will reduce traffic.', ['It is expected', 'It expects', 'Is expected', 'It is expecting'], 0, 'It is + V3 + that.'],
      ['The painting is believed ___ in the 1500s.', ['to paint', 'to have been painted', 'painted', 'to be painting'], 1, 'Sự việc quá khứ + bị động → to have been painted.'],
      ['Over a million people are estimated ___ the festival each year.', ['attending', 'to attend', 'to have attending', 'attend'], 1, 'Cùng thời → to + V.'],
    ],
  },
  {
    ch: 'passive',
    id: 'causative',
    title: 'Thể nhờ bảo (causative)',
    en: 'have/get something done',
    what: 'Diễn tả việc nhờ/thuê người khác làm gì cho mình, hoặc việc không may xảy ra với mình.',
    forms: [
      ['Bị động nhờ bảo', 'S + have/get + O (vật) + V3'],
      ['Chủ động nhờ bảo', 'S + have + O (người) + V  ·  S + get + O (người) + to V'],
      ['Ép buộc / cho phép', 'make + O + V · let + O + V · allow/force + O + to V'],
    ],
    uses: [
      ['Dịch vụ', 'I had my hair cut yesterday.'],
      ['Việc không may', 'She had her phone stolen on the bus.'],
      ['Nhờ người', 'I\'ll get my brother to fix the computer.'],
    ],
    ielts: [
      'Speaking Part 2 kể trải nghiệm dịch vụ: "I had my laptop repaired at…" thể hiện ngữ pháp linh hoạt.',
    ],
    mistakes: [
      ['I cut my hair at the salon.', 'I had my hair cut at the salon.', 'Người khác cắt → causative.'],
      ['My parents made me to study.', 'My parents made me study.', 'make + O + V nguyên mẫu.'],
    ],
    quiz: [
      ['We need to ___ the roof repaired before winter.', ['have', 'make', 'let', 'do'], 0, 'have + O + V3.'],
      ['The teacher let us ___ early.', ['to leave', 'leave', 'leaving', 'left'], 1, 'let + O + V.'],
      ['I got a mechanic ___ the brakes.', ['check', 'to check', 'checked', 'checking'], 1, 'get + người + to V.'],
    ],
  },
  {
    ch: 'verb-patterns',
    id: 'gerund-infinitive',
    title: 'V-ing hay to V',
    en: 'Gerunds and infinitives',
    what: 'Một số động từ/tính từ/giới từ đòi hỏi V-ing, một số đòi hỏi to V; một số đổi nghĩa tùy dạng theo sau.',
    forms: [
      ['+ V-ing', 'avoid, consider, enjoy, finish, involve, mind, practise, risk, suggest, deny, admit, keep, can\'t help, be worth'],
      ['+ to V', 'afford, agree, aim, attempt, decide, expect, fail, hope, manage, plan, refuse, seem, tend, intend, choose'],
      ['Giới từ + V-ing', 'interested in doing · instead of going · by investing · without paying · look forward to meeting'],
      ['Đổi nghĩa', 'stop doing (thôi làm) / stop to do (dừng để làm) · remember/forget doing (nhớ đã làm) / to do (nhớ phải làm) · try doing (thử) / try to do (cố gắng) · regret doing / regret to inform'],
      ['V-ing làm chủ ngữ', 'Learning a language takes time.'],
    ],
    uses: [
      ['Task 2', 'Many people tend to underestimate the cost of owning a car.'],
      ['Giới từ', 'Cities can reduce congestion by investing in public transport.'],
      ['Đổi nghĩa', 'I stopped eating meat (bỏ hẳn) ≠ I stopped to eat (dừng lại để ăn).'],
    ],
    ielts: [
      '"look forward to", "be committed to", "contribute to", "object to", "be used to": "to" là GIỚI TỪ → + V-ing.',
      '"suggest" KHÔNG đi với to V: suggest doing / suggest that S (should) V.',
    ],
    mistakes: [
      ['I look forward to hear from you.', 'I look forward to hearing from you.', 'to là giới từ.'],
      ['He suggested to go by train.', 'He suggested going / suggested that we go by train.', 'suggest + V-ing / that-clause.'],
      ['This contributes to reduce pollution.', 'This contributes to reducing pollution.', 'contribute to + N/V-ing.'],
    ],
    quiz: [
      ['Many young people cannot afford ___ a house.', ['buying', 'to buy', 'buy', 'bought'], 1, 'afford + to V.'],
      ['Governments should consider ___ taxes on sugary drinks.', ['to raise', 'raising', 'raise', 'raised'], 1, 'consider + V-ing.'],
      ['Remember ___ your passport — you\'ll need it tomorrow.', ['bringing', 'to bring', 'bring', 'brought'], 1, 'Nhớ phải làm (tương lai) → to V.'],
    ],
  },
  {
    ch: 'verb-patterns',
    id: 'verb-object-patterns',
    title: 'Động từ + tân ngữ + to V / V / that-clause',
    en: 'Verb + object patterns',
    what: 'Cấu trúc động từ có tân ngữ theo sau rất thường gặp trong Task 2 khi nói về chính sách, ảnh hưởng.',
    forms: [
      ['V + O + to V', 'allow, enable, encourage, force, require, persuade, urge, warn, advise, expect, want'],
      ['V + O + V', 'make, let, help (help + O + (to) V)'],
      ['V + that + S + (should) + V', 'recommend, suggest, insist, demand, propose (thức giả định)'],
      ['V + O + from + V-ing', 'prevent, stop, discourage, prohibit, ban'],
    ],
    uses: [
      ['Chính sách', 'Tax incentives encourage companies to invest in renewable energy.'],
      ['Ngăn cản', 'High fees prevent many students from going to university.'],
      ['Giả định', 'Experts recommend that children (should) limit their screen time.'],
      ['Khả năng', 'Technology enables people to work from anywhere.'],
    ],
    ielts: [
      'Bộ "enable/allow/encourage/discourage/prevent … from" giúp diễn đạt nguyên nhân – kết quả chính xác hơn "make".',
    ],
    mistakes: [
      ['This allows to save money.', 'This allows people to save money. / This allows money to be saved.', 'allow cần tân ngữ trước to V.'],
      ['It prevents people to drive.', 'It prevents people from driving.', 'prevent + O + from + V-ing.'],
      ['I recommend him to goes.', 'I recommend that he go / he should go.', 'Thức giả định: V nguyên mẫu.'],
    ],
    quiz: [
      ['Online banking enables customers ___ money at any time.', ['transfer', 'to transfer', 'transferring', 'from transferring'], 1, 'enable + O + to V.'],
      ['The ban discourages people ___ plastic bags.', ['to use', 'from using', 'use', 'using'], 1, 'discourage + O + from V-ing.'],
      ['The doctor insisted that he ___ smoking.', ['stops', 'stop', 'stopped to', 'to stop'], 1, 'insist that + S + V (giả định).'],
    ],
  },
];
