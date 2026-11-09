// Writing prompts (original). Data in Task 1 visuals is illustrative and refers to
// fictional towns, as is common practice in IELTS-style materials.

export const task1Academic = [
  {
    id: 'w1-line',
    kind: 'line',
    title: 'Line graph — Household internet access',
    prompt: 'The graph below shows the percentage of households with internet access in three towns between 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chart: {
      unit: '%', yMax: 100, x: ['2000', '2005', '2010', '2015', '2020'],
      series: [
        { name: 'Ashford', data: [30, 52, 74, 88, 95] },
        { name: 'Brampton', data: [12, 20, 41, 69, 90] },
        { name: 'Calder', data: [45, 58, 63, 66, 70] },
      ],
    },
    model: `The line graph compares the proportion of households that had access to the internet in Ashford, Brampton and Calder over a twenty-year period from 2000.

Overall, internet access rose in all three towns, but the pace of growth varied considerably. Brampton, which started with the lowest figure, experienced the most dramatic increase, whereas Calder, initially the best-connected town, ended the period with the lowest rate.

In 2000, 45% of households in Calder were online, compared with 30% in Ashford and just 12% in Brampton. Over the following decade, Ashford's figure climbed rapidly to 74%, overtaking Calder in around 2007, while Brampton's more than tripled to 41%.

From 2010 onwards, growth in Calder slowed markedly, with the rate edging up from 63% to only 70% by 2020. By contrast, connectivity in Brampton accelerated, rising by almost 50 percentage points to reach 90%, close to Ashford's final figure of 95%, the highest of the three.`,
    notes: [
      'Đoạn mở: paraphrase đề (graph below shows → line graph compares; between 2000 and 2020 → over a twenty-year period).',
      'Overview tách riêng, nêu xu hướng chung + điểm nổi bật nhất, KHÔNG có số liệu chi tiết.',
      'Nhóm dữ liệu theo giai đoạn (2000–2010, 2010–2020) thay vì mô tả lần lượt từng đường — thể hiện "key features skilfully selected".',
      'Phân biệt "per cent" và "percentage points" khi so sánh tỷ lệ phần trăm.',
      'Không đưa ra lý do/ý kiến cá nhân — Academic Task 1 chỉ mô tả dữ liệu.',
    ],
  },
  {
    id: 'w1-bar',
    kind: 'bar',
    title: 'Bar chart — Weekly leisure time by age group',
    prompt: 'The chart below shows the average number of hours per week spent on four leisure activities by people in different age groups in one country.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chart: {
      unit: 'hours', yMax: 22, x: ['16–24', '25–44', '45–64', '65+'],
      series: [
        { name: 'Social media', data: [14, 9, 5, 2] },
        { name: 'Watching TV', data: [8, 10, 13, 20] },
        { name: 'Exercise', data: [5, 4, 3.5, 3] },
        { name: 'Reading', data: [2, 2.5, 4, 7] },
      ],
    },
  },
  {
    id: 'w1-table',
    kind: 'table',
    title: 'Table — Metro systems in four cities',
    prompt: 'The table below gives information about the metro (underground railway) systems in four cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    table: {
      head: ['City', 'Year opened', 'Route length (km)', 'Passengers per year (millions)'],
      rows: [
        ['Riverton', '1902', '210', '1,100'],
        ['Lakeside', '1965', '85', '420'],
        ['Hillport', '1990', '140', '610'],
        ['Seaview', '2018', '32', '95'],
      ],
    },
  },
  {
    id: 'w1-process',
    kind: 'process',
    title: 'Process diagram — Recycling glass bottles',
    prompt: 'The diagram below shows how glass bottles are recycled.\n\nSummarise the information by selecting and reporting the main features.',
    steps: [
      'Used bottles collected from bottle banks',
      'Transported by lorry to a treatment plant',
      'Sorted by colour (clear, green, brown)',
      'Washed; labels and caps removed',
      'Crushed into small pieces ("cullet")',
      'Melted in a furnace at about 1,500°C',
      'Molten glass shaped in moulds into new bottles',
      'New bottles filled and sent to shops',
    ],
  },
];

export const task1General = [
  {
    id: 'w1-gt-formal',
    title: 'Formal letter — Faulty product',
    prompt: 'You recently bought a piece of equipment for your kitchen, but it did not work properly when you got it home.\n\nWrite a letter to the shop manager. In your letter:\n• describe the problem with the equipment\n• explain what happened when you phoned the shop about it\n• say what you would like the manager to do\n\nWrite at least 150 words. You do NOT need to write any addresses.\n\nBegin your letter as follows: Dear Sir or Madam,',
    tone: 'formal',
    model: `Dear Sir or Madam,

I am writing to complain about a food processor that I purchased from your Westgate branch on 3 October, and about the way my subsequent enquiry was handled.

When I used the appliance for the first time, the motor stopped after only a few seconds and would not restart, even after I had followed every step in the troubleshooting section of the manual. I also noticed a strong smell of burning plastic, which made me concerned that the product might be unsafe.

The following day, I telephoned the store to report the fault. However, after being kept on hold for over twenty minutes, I was told by a member of staff that nothing could be done without a manager's approval and that someone would call me back. Despite this assurance, I have not been contacted since.

I would therefore be grateful if you could arrange for a full refund to be paid to my card, and for the faulty machine to be collected from my home at your earliest convenience.

I look forward to hearing from you.

Yours faithfully,
Minh Tran`,
    notes: [
      'Mở thư nêu rõ mục đích ngay câu đầu (purpose clear) — tiêu chí Task Achievement của GT.',
      'Mỗi bullet point một đoạn riêng, có chi tiết cụ thể (ngày, chi nhánh, thời gian chờ).',
      '"Dear Sir or Madam" → kết thư "Yours faithfully"; nếu biết tên ("Dear Mr Smith") → "Yours sincerely".',
      'Giọng văn trang trọng nhất quán: không viết tắt, dùng cấu trúc lịch sự (I would be grateful if…).',
    ],
  },
  {
    id: 'w1-gt-semi',
    title: 'Semi-formal letter — Request to your manager',
    prompt: 'You would like to attend a training course which takes place during working hours.\n\nWrite a letter to your manager. In your letter:\n• give details of the course\n• explain how the course would help you in your job\n• suggest how your work could be covered while you are away\n\nWrite at least 150 words. You do NOT need to write any addresses.\n\nBegin your letter as follows: Dear …,',
    tone: 'semi-formal',
  },
  {
    id: 'w1-gt-informal',
    title: 'Informal letter — Inviting a friend',
    prompt: 'A friend from another country is planning to visit your city for the first time next month.\n\nWrite a letter to your friend. In your letter:\n• suggest the best time of year/day for the visit and say why\n• recommend some places to see\n• offer to help with something during the visit\n\nWrite at least 150 words. You do NOT need to write any addresses.\n\nBegin your letter as follows: Dear …,',
    tone: 'informal',
  },
];

export const task2 = [
  {
    id: 'w2-free-uni',
    type: 'Opinion (agree / disagree)',
    topic: 'Education',
    prompt: 'Some people believe that university education should be free for all students, regardless of their background.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
    model: `In many countries, the cost of higher education has risen sharply, prompting calls for university tuition to be provided free of charge to everyone. While I accept that no capable student should be excluded from university for financial reasons, I disagree that tuition should be free for all, as this would be neither fair nor sustainable.

The strongest argument for universal free tuition is that it widens access. When students from low-income families face the prospect of large debts, many decide not to apply, and society loses talent that could have contributed to the economy. Free tuition removes this barrier and signals that education is a public good rather than a private privilege.

However, making university free for everyone is an inefficient way to achieve this goal. Since graduates typically earn considerably more over their lifetimes than non-graduates, requiring taxpayers — many of whom never attended university — to fund the full cost amounts to a transfer from less affluent citizens to future high earners. Moreover, wealthy families who could easily afford fees would receive the same subsidy as those in genuine need, diverting money from schools, healthcare and vocational training.

A more equitable approach would be to target support where it is needed. Generous grants for students from disadvantaged backgrounds, combined with loans that are repaid only once a graduate's income exceeds a certain threshold, would protect access without placing the entire burden on the public purse. Systems of this kind already operate in several countries and have not prevented participation from rising.

In conclusion, although financial background should never determine who can study at university, I believe that free tuition for all is the wrong solution. Means-tested grants and income-contingent loans offer a fairer and more sustainable balance between individual and public responsibility.`,
    notes: [
      'Quan điểm rõ ràng ngay mở bài ("I disagree that…") và nhất quán đến kết luận — yêu cầu của Task Response band 7+.',
      'Đoạn 2 thừa nhận lập luận đối lập (concession) rồi đoạn 3 phản biện → lập luận chặt chẽ.',
      'Mỗi đoạn thân bài có một ý trung tâm (central topic) + giải thích + hệ quả.',
      'Từ vựng chủ đề chính xác: widen access, public good, means-tested grants, income-contingent loans, public purse.',
      'Cấu trúc phức: mệnh đề quan hệ không xác định, câu điều kiện, phân từ ("combined with…").',
    ],
  },
  {
    id: 'w2-languages',
    type: 'Discussion (discuss both views + opinion)',
    topic: 'Education',
    prompt: 'Some people think that children should begin learning a foreign language at primary school, while others believe they should wait until secondary school.\n\nDiscuss both these views and give your own opinion.\n\nWrite at least 250 words.',
  },
  {
    id: 'w2-remote',
    type: 'Advantages / disadvantages (outweigh)',
    topic: 'Work',
    prompt: 'More and more people are working from home rather than travelling to an office.\n\nDo the advantages of this development outweigh the disadvantages?\n\nWrite at least 250 words.',
    model: `Since the early 2020s, a growing proportion of employees have been working remotely for at least part of the week. In my view, the benefits of this shift, for both workers and society, outweigh its drawbacks, provided that it is managed carefully.

The most obvious advantage is the time and money saved by eliminating the daily commute. An employee who previously spent an hour travelling in each direction gains around ten hours a week, which can be devoted to family, exercise or rest. Remote work also reduces traffic congestion and transport emissions, and it allows companies to recruit talented people who live far from major cities, which in turn spreads economic activity more evenly across a country.

Admittedly, working from home has genuine disadvantages. Without face-to-face contact, junior staff may find it harder to learn from experienced colleagues, and informal conversations that often generate new ideas become less frequent. Some people also struggle to separate their working life from their home life, with the result that they work longer hours and feel isolated.

Nevertheless, these problems are largely manageable. Many organisations have adopted hybrid arrangements in which teams meet in person on fixed days for collaboration and training, while focused individual work is done at home. Clear policies on working hours can also help employees to switch off. By contrast, the advantages — greater flexibility, lower costs and reduced environmental impact — are difficult to achieve in any other way.

In conclusion, although remote working can weaken workplace relationships and blur the boundary between home and work, I believe its advantages are greater, especially when it is combined with regular time in the office.`,
    notes: [
      'Đề "Do the advantages outweigh…" yêu cầu so sánh cân nặng và kết luận rõ — không chỉ liệt kê ưu/nhược.',
      'Đoạn 4 giải thích VÌ SAO ưu điểm vượt trội (nhược điểm có thể khắc phục) → trả lời trực tiếp câu hỏi.',
      'Cohesive devices đa dạng nhưng không máy móc: Admittedly, Nevertheless, By contrast, which in turn, with the result that.',
    ],
  },
  {
    id: 'w2-traffic',
    type: 'Problem / solution (causes + measures)',
    topic: 'Cities & transport',
    prompt: 'In many cities around the world, traffic congestion is becoming an increasingly serious problem.\n\nWhat are the main causes of this problem, and what measures could be taken to address it?\n\nWrite at least 250 words.',
  },
  {
    id: 'w2-news',
    type: 'Two-part question',
    topic: 'Media & technology',
    prompt: 'Many people now get their news from social media rather than from newspapers or television.\n\nWhy is this happening? Is this a positive or negative development?\n\nWrite at least 250 words.',
  },
  {
    id: 'w2-transport',
    type: 'Opinion (agree / disagree)',
    topic: 'Government spending',
    prompt: 'Governments should spend more money on improving public transport than on building new roads.\n\nTo what extent do you agree or disagree?\n\nWrite at least 250 words.',
  },
  {
    id: 'w2-ai',
    type: 'Discussion (discuss both views + opinion)',
    topic: 'Technology',
    prompt: 'Some people believe that artificial intelligence tools will improve the quality of education, while others think they will make students less able to think for themselves.\n\nDiscuss both these views and give your own opinion.\n\nWrite at least 250 words.',
  },
];

export const writingLanguageBank = [
  {
    title: 'Task 1 — Mô tả xu hướng',
    items: [
      'rise / increase / climb / grow (to/by) — fall / decrease / decline / drop',
      'rise sharply / dramatically / steadily / gradually / slightly',
      'a sharp rise in… / a gradual decline in… / a period of stability',
      'peak at / reach a high of / hit a low of / bottom out at',
      'remain stable / level off / plateau / fluctuate around',
      'overtake / surpass / exceed / account for / make up',
    ],
  },
  {
    title: 'Task 1 — So sánh & ước lượng',
    items: [
      'twice as high as / three times as many as / half the number of',
      'compared with / in comparison with / whereas / while',
      'just under / just over / approximately / roughly / almost',
      'the highest / the lowest / the second largest proportion of',
      'by 10 percentage points (so sánh hai tỷ lệ %) ≠ by 10% (tăng tương đối)',
    ],
  },
  {
    title: 'Task 1 — Process / Map',
    items: [
      'Process: dùng câu bị động thì hiện tại (The bottles are collected…), trình tự: first, next, once…, after this, finally',
      'Overview process: số giai đoạn, điểm bắt đầu – kết thúc, chu trình tuần hoàn hay tuyến tính',
      'Map: was replaced by / was converted into / was demolished / was extended / to the north of',
    ],
  },
  {
    title: 'Task 2 — Mở bài & quan điểm',
    items: [
      'Paraphrase đề + thesis statement: This essay will argue that… / I firmly believe that…',
      'Partly agree: While I accept that…, I would argue that…',
      'Discussion: Although there are valid arguments on both sides, I believe…',
    ],
  },
  {
    title: 'Task 2 — Phát triển ý',
    items: [
      'Topic sentence → explanation → example → consequence/link back',
      'This is largely because… / As a result,… / This means that…',
      'Concession: Admittedly,… / It is true that… However,…',
      'Hedging: tend to, are likely to, may, in many cases, to some extent',
    ],
  },
];
