// Original Academic Reading mock test (3 passages, 40 questions, 60 minutes).
// Every answer carries an explanation that quotes/locates the evidence in the text,
// so learners can verify the logic — especially the TRUE / FALSE / NOT GIVEN distinction.

export const readingTests = [
  {
    id: 'ac-r-01',
    module: 'academic',
    title: 'Academic Reading — Mock Test 1',
    minutes: 60,
    passages: [
      {
        id: 'p1',
        title: 'Farming Upwards: The Promise and Problems of Vertical Agriculture',
        paragraphs: [
          'The idea of growing crops in stacked layers inside buildings is often traced to Dickson Despommier, a professor of public health at Columbia University, who in 1999 set his students the challenge of feeding the population of Manhattan using rooftop gardens. When their calculations showed that rooftops could supply only a small fraction of the food required, Despommier proposed going further: growing food on every floor of purpose-built towers. The concept attracted widespread media attention, although it was not entirely new — architects and science-fiction writers had imagined multi-storey farms for much of the twentieth century.',
          'Modern vertical farms rarely resemble the gleaming skyscrapers of early illustrations. Most occupy converted warehouses or shipping containers, where plants grow on shelves stacked up to ten metres high. Instead of soil, the majority use hydroponics, in which roots are suspended in a solution of water and dissolved nutrients. A smaller number rely on aeroponics, a technique in which the roots hang in the air and are sprayed with a fine nutrient mist; it was studied by NASA in the 1990s as a way of growing food in space. Sunlight is replaced entirely by light-emitting diodes (LEDs), which can be tuned to the particular wavelengths that plants absorb most efficiently, mainly in the red and blue parts of the spectrum.',
          'Supporters point to several advantages. Because the growing environment is sealed, crops are protected from drought, frost and flooding, and harvests can continue all year round. Pests are far less common indoors, so pesticides are seldom needed. Water use is strikingly low: since the water in a closed hydroponic system is captured and recirculated rather than lost to evaporation and run-off, many operators claim to use up to 95 per cent less water than conventional fields. Locating farms close to — or inside — cities also shortens supply chains, meaning that delicate produce can reach consumers within hours of being picked.',
          'Yet the economics have proved stubborn. The most significant cost is electricity: replacing the sun with artificial light demands enormous amounts of power, as does the air conditioning needed to remove the heat the lamps produce. Where that electricity is generated from fossil fuels, the carbon footprint of a vertically farmed lettuce can exceed that of one grown in a field and transported a considerable distance. Labour is another heavy expense, despite the growing use of robotics, and the initial cost of building a facility is far higher than that of buying farmland. In 2023 and 2024 several of the sector\'s best-funded companies either filed for bankruptcy or closed their farms, prompting commentators to question whether the model could ever be profitable.',
          'Part of the problem lies in the narrow range of crops that suit indoor cultivation. Leafy greens such as lettuce, basil and spinach grow quickly, are compact, and are almost entirely edible, which makes them the obvious choice. Staple crops are a different matter. Wheat, rice and maize need far more light energy per calorie produced, and much of each plant — stems, roots and husks — is inedible. One widely cited estimate suggests that growing a single loaf\'s worth of wheat indoors would require electricity costing many times the price of the loaf itself. For the foreseeable future, then, vertical farms are unlikely to replace conventional agriculture as the source of the world\'s calories.',
          'Nevertheless, few researchers believe the technology is a dead end. Falling LED prices and improvements in their efficiency have steadily reduced lighting costs, and some farms now negotiate access to cheap renewable electricity at times of low demand. Others have found commercial niches in producing high-value crops such as strawberries, herbs and seedlings for transplanting into conventional fields. In regions with extreme climates or little arable land — parts of the Middle East and Singapore, for example — the case for indoor farming is strongest, since the alternative is often to import fresh food over long distances. The most likely future, many analysts conclude, is not one in which vertical farms replace fields, but one in which the two systems complement each other.',
        ],
        groups: [
          {
            range: [1, 7],
            type: 'tfng',
            instruction: 'Do the following statements agree with the information given in Reading Passage 1? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.',
            questions: [
              { n: 1, prompt: 'Despommier\'s students concluded that rooftop gardens could feed most of Manhattan\'s population.', answer: 'FALSE', explain: 'Đoạn 1: "their calculations showed that rooftops could supply only a small fraction of the food required" — trái ngược với "most".' },
              { n: 2, prompt: 'The concept of vertical farming received a great deal of attention from the media.', answer: 'TRUE', explain: 'Đoạn 1: "The concept attracted widespread media attention" = received a great deal of attention.' },
              { n: 3, prompt: 'NASA built the first commercial aeroponic farm.', answer: 'NOT GIVEN', explain: 'Đoạn 2 chỉ nói aeroponics "was studied by NASA in the 1990s as a way of growing food in space". Không có thông tin NASA xây trang trại thương mại nào → không thể khẳng định hay phủ định.' },
              { n: 4, prompt: 'The LEDs used in vertical farms can be adjusted to produce specific wavelengths of light.', answer: 'TRUE', explain: 'Đoạn 2: LEDs "can be tuned to the particular wavelengths that plants absorb most efficiently" (tuned = adjusted).' },
              { n: 5, prompt: 'Vertical farms in hot countries need more air conditioning than those in cool countries.', answer: 'NOT GIVEN', explain: 'Đoạn 4 nhắc đến air conditioning để loại bỏ nhiệt do đèn tạo ra, nhưng không so sánh giữa các vùng khí hậu.' },
              { n: 6, prompt: 'Vertically farmed vegetables always have a smaller carbon footprint than vegetables grown in fields.', answer: 'FALSE', explain: 'Đoạn 4: khi điện từ nhiên liệu hóa thạch, carbon footprint "can exceed that of one grown in a field" — mâu thuẫn với "always ... smaller".' },
              { n: 7, prompt: 'The introduction of robots has not removed the high cost of labour in vertical farms.', answer: 'TRUE', explain: 'Đoạn 4: "Labour is another heavy expense, despite the growing use of robotics" — dù có robot, chi phí nhân công vẫn cao.' },
            ],
          },
          {
            range: [8, 13],
            type: 'gap',
            instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
            heading: 'Vertical farming',
            questions: [
              { n: 8, prompt: 'Advantages: crops are protected from drought, frost and ________.', answer: ['flooding'], limit: { words: 1, number: false }, explain: 'Đoạn 3: "crops are protected from drought, frost and flooding".' },
              { n: 9, prompt: 'Pesticides are seldom needed because ________ are much rarer indoors.', answer: ['pests'], limit: { words: 1, number: false }, explain: 'Đoạn 3: "Pests are far less common indoors, so pesticides are seldom needed".' },
              { n: 10, prompt: 'Water is recirculated instead of being lost through evaporation and ________.', answer: ['run-off', 'runoff'], limit: { words: 1, number: false }, explain: 'Đoạn 3: "rather than lost to evaporation and run-off". Từ có gạch nối được tính là MỘT từ.' },
              { n: 11, prompt: 'Disadvantages: the greatest single expense is ________.', answer: ['electricity'], limit: { words: 1, number: false }, explain: 'Đoạn 4: "The most significant cost is electricity" (most significant = greatest).' },
              { n: 12, prompt: 'A large part of staple crops such as wheat is ________.', answer: ['inedible'], limit: { words: 1, number: false }, explain: 'Đoạn 5: "much of each plant — stems, roots and husks — is inedible".' },
              { n: 13, prompt: 'Future: profitable niches include strawberries, herbs and ________.', answer: ['seedlings'], limit: { words: 1, number: false }, explain: 'Đoạn 6: "high-value crops such as strawberries, herbs and seedlings".' },
            ],
          },
        ],
      },
      {
        id: 'p2',
        title: 'Sleep On It: How the Brain Consolidates Memory',
        labelled: true,
        paragraphs: [
          'For most of the twentieth century, sleep was regarded as a largely passive state in which the brain simply rested. One of the earliest hints that it might matter for memory came in 1924, when John Jenkins and Karl Dallenbach at Cornell University asked two participants to learn lists of nonsense syllables and then tested their recall after intervals spent either asleep or awake. Recall was consistently better after sleep. Jenkins and Dallenbach, however, explained the result in terms of protection: a sleeping person encounters fewer new experiences that might interfere with, and overwrite, what has just been learnt. Sleep, in this view, was a shelter rather than a workshop.',
          'That interpretation began to be challenged by animal research in the 1990s. In 1994, Matthew Wilson and Bruce McNaughton recorded the activity of "place cells" in the hippocampus of rats — neurons that fire when an animal is in a particular location. Patterns of activity observed while the rats explored a track reappeared during the slow-wave sleep that followed, and in a similar order, as if the brain were replaying the day\'s experience. Later studies found that such replay often runs considerably faster than the original experience.',
          'It also became clear that sleep is not a uniform state. Across a night, the brain passes through cycles of roughly 90 minutes, alternating between non-rapid-eye-movement (non-REM) sleep, which includes deep slow-wave sleep, and rapid-eye-movement (REM) sleep. Slow-wave sleep dominates the first half of the night, while REM sleep becomes more frequent towards morning. Researchers have proposed that the stages serve different kinds of memory: slow-wave sleep appears particularly important for facts and events, while REM sleep has been linked to skills and emotional memories — although the evidence for the role of REM sleep remains contested.',
          'The timing of sleep may be as important as its quantity. In a study published in 2000, Robert Stickgold and colleagues at Harvard trained participants on a visual discrimination task. Those who slept normally on the night after training improved their performance without further practice. Participants who were kept awake that first night, however, showed no improvement, even after they had been allowed two full nights of recovery sleep. Missing the first night, it seemed, meant missing an opportunity that could not later be recovered.',
          'If memories are reactivated during sleep, can the process be deliberately influenced? A 2007 experiment led by Björn Rasch and Jan Born suggested so. Participants learnt the locations of pairs of cards while the scent of roses was released into the room. When the same scent was presented again during their slow-wave sleep, their recall of the card locations the next day was better than that of a control group. Presenting the scent during REM sleep, or while participants were awake, had no such effect. The technique, now known as targeted memory reactivation, has since been tested with sounds as well as smells.',
          'Sleep appears to matter not only after learning but before it. Research led by Matthew Walker found that participants deprived of a night\'s sleep were substantially worse at forming new memories the following day — in one study their performance was around 40 per cent lower than that of rested participants — and brain scans showed reduced activity in the hippocampus during learning. A well-rested brain, the researchers argue, is better prepared to take in new information.',
          'These findings have obvious implications for education, not least for students who stay awake all night before an examination. Yet many sleep researchers urge caution in applying them. A large number of studies have involved only small numbers of participants, and the tasks used in laboratories — memorising word pairs or card positions — are often simplified versions of real-world learning. What can be said with some confidence is that sleep is an active contributor to memory, not merely a pause in which nothing happens.',
        ],
        groups: [
          {
            range: [14, 19],
            type: 'match',
            instruction: 'Reading Passage 2 has seven paragraphs, A–G. Choose the correct heading for paragraphs A–F from the list of headings below.',
            options: [
              ['i', 'An early finding interpreted as passive protection'],
              ['ii', 'Evidence that the sleeping brain replays recent experience'],
              ['iii', 'Why animals need more sleep than humans'],
              ['iv', 'Different stages of sleep and their possible roles'],
              ['v', 'The importance of sleeping soon after training'],
              ['vi', 'Using a sensory cue to strengthen memories during sleep'],
              ['vii', 'How lack of sleep affects the ability to take in new information'],
              ['viii', 'Dreams as a reflection of daily concerns'],
              ['ix', 'The commercial potential of sleep technology'],
            ],
            questions: [
              { n: 14, prompt: 'Paragraph A', answer: 'i', explain: 'Đoạn A: kết quả 1924 (ngủ giúp nhớ tốt hơn) nhưng được giải thích là "protection… a shelter rather than a workshop" → bảo vệ thụ động.' },
              { n: 15, prompt: 'Paragraph B', answer: 'ii', explain: 'Đoạn B: hoạt động place cells "reappeared during the slow-wave sleep… as if the brain were replaying the day\'s experience".' },
              { n: 16, prompt: 'Paragraph C', answer: 'iv', explain: 'Đoạn C: các chu kỳ non-REM/REM và giả thuyết mỗi giai đoạn phục vụ loại trí nhớ khác nhau.' },
              { n: 17, prompt: 'Paragraph D', answer: 'v', explain: 'Đoạn D: "The timing of sleep may be as important as its quantity" — bỏ lỡ đêm đầu tiên sau luyện tập thì không cải thiện.' },
              { n: 18, prompt: 'Paragraph E', answer: 'vi', explain: 'Đoạn E: mùi hoa hồng (sensory cue) đưa vào lúc slow-wave sleep → nhớ tốt hơn (targeted memory reactivation).' },
              { n: 19, prompt: 'Paragraph F', answer: 'vii', explain: 'Đoạn F: thiếu ngủ trước khi học làm khả năng tạo trí nhớ mới giảm ~40%. Bẫy: heading v nói về ngủ SAU khi học.' },
            ],
          },
          {
            range: [20, 23],
            type: 'match',
            instruction: 'Look at the following findings (Questions 20–23) and the list of researchers below. Match each finding with the correct researcher(s), A–E. NB You may use any letter more than once.',
            options: [
              ['A', 'Jenkins and Dallenbach'],
              ['B', 'Wilson and McNaughton'],
              ['C', 'Stickgold and colleagues'],
              ['D', 'Rasch, Born and colleagues'],
              ['E', 'Walker and colleagues'],
            ],
            questions: [
              { n: 20, prompt: 'Improvement on a task depended on whether participants slept on the first night after practice.', answer: 'C', explain: 'Đoạn D (Stickgold): nhóm bị thức đêm đầu "showed no improvement, even after… two full nights of recovery sleep".' },
              { n: 21, prompt: 'A smell presented during a particular stage of sleep improved later recall.', answer: 'D', explain: 'Đoạn E (Rasch & Born): mùi hoa hồng trong slow-wave sleep cải thiện khả năng nhớ; trong REM thì không.' },
              { n: 22, prompt: 'Brain activity recorded while exploring was repeated during sleep.', answer: 'B', explain: 'Đoạn B (Wilson & McNaughton): mẫu hoạt động khi chuột khám phá đường chạy "reappeared during the slow-wave sleep".' },
              { n: 23, prompt: 'Lack of sleep reduced people\'s capacity to form new memories.', answer: 'E', explain: 'Đoạn F (Walker): người bị thiếu ngủ "substantially worse at forming new memories".' },
            ],
          },
          {
            range: [24, 26],
            type: 'match',
            instruction: 'Complete the summary using the list of words, A–H, below.',
            heading: 'Applying the research',
            options: [
              ['A', 'caution'], ['B', 'large'], ['C', 'small'], ['D', 'real-world'],
              ['E', 'enthusiasm'], ['F', 'short'], ['G', 'laboratory'], ['H', 'emotional'],
            ],
            questions: [
              { n: 24, prompt: 'Although the findings are relevant to education, many researchers recommend ________ in applying them.', answer: 'A', explain: 'Đoạn G: "many sleep researchers urge caution in applying them".' },
              { n: 25, prompt: 'This is partly because many studies have included only ________ numbers of participants.', answer: 'C', explain: 'Đoạn G: "involved only small numbers of participants". Bẫy: "A large number of studies" nói về số nghiên cứu, không phải số người tham gia.' },
              { n: 26, prompt: 'In addition, experimental tasks are often simpler than ________ learning.', answer: 'D', explain: 'Đoạn G: tasks "are often simplified versions of real-world learning".' },
            ],
          },
        ],
      },
      {
        id: 'p3',
        title: 'Cracking Linear B',
        paragraphs: [
          'In 1900 the British archaeologist Arthur Evans began excavating at Knossos on Crete and soon uncovered thousands of clay tablets inscribed in an unknown script. He identified two related systems of writing, which he named Linear A and Linear B. Evans was convinced that the civilisation he had found — he called it "Minoan", after the legendary King Minos — was culturally distinct from mainland Greece, and that its language could not be Greek. His authority was such that this assumption went largely unchallenged for decades. Evans was also slow to publish the tablets, which meant that few other scholars had access to the material needed to attempt a decipherment.',
          'The situation began to change in 1939, when the American archaeologist Carl Blegen discovered several hundred similar tablets at Pylos on the Greek mainland. Their presence there was awkward for Evans\'s theory: if Linear B was the script of a non-Greek people on Crete, why was it being used in a palace in Greece? Because of the Second World War, however, the Pylos tablets were not published until 1951.',
          'The task facing would-be decipherers was formidable. Ancient scripts are most easily deciphered when a bilingual inscription exists, as the Rosetta Stone famously provided for Egyptian hieroglyphs. No such text was available for Linear B, and both the script and the language it recorded were unknown. Nevertheless, the script itself offered clues. It contained around 87 frequently used signs: too many for an alphabet, which typically has between 20 and 30 letters, but far too few for a system in which each sign stands for a whole word. Scholars therefore concluded that each sign probably represented a syllable. Alongside these signs appeared pictorial symbols for goods such as horses, chariots and wine, together with numerals, suggesting that the tablets were mostly administrative records.',
          'Crucial groundwork was laid in the 1940s by Alice Kober, a classicist at Brooklyn College in New York. Rather than guessing which language lay behind the script, Kober analysed its internal structure. She noticed sets of words that shared a stem but had different endings — later known as "Kober\'s triplets" — which showed that the language was inflected, changing the forms of words according to their grammatical role. This in turn implied that certain signs must share a consonant while differing in their vowel. Kober recorded her observations by hand on many thousands of index cards. She died in 1950, at the age of 43, before the decipherment was complete. It is hard to avoid the conclusion that her contribution has been undervalued, partly because she published relatively little and partly because she did not live to see the breakthrough.',
          'That breakthrough was made by Michael Ventris, an architect by profession, who had been fascinated by the script since hearing Evans lecture in 1936, when Ventris was a fourteen-year-old schoolboy. Building on Kober\'s method, Ventris constructed a "grid" in which signs thought to share a consonant were placed in the same row and those thought to share a vowel in the same column. For years he believed that the language was most likely related to Etruscan. In 1952, however, he tried assigning sound values to signs in words he suspected were the names of Cretan places, such as Knossos and Amnisos. When he did so, other words on the tablets began to resemble an archaic form of Greek — a result that surprised Ventris himself.',
          'Ventris announced his findings in a BBC radio broadcast in July 1952. He then began to work with John Chadwick, a Cambridge philologist with expertise in early Greek dialects, and in 1953 the two published a joint article setting out the decipherment. Confirmation soon followed. Blegen, reading a newly cleaned tablet from Pylos with Ventris\'s sound values, found words describing three-legged cooking pots placed beside pictures of exactly such vessels. This "Tripod Tablet" persuaded many doubters, although a minority of scholars resisted the decipherment for years. Ventris did not live to see it universally accepted: he was killed in a road accident in 1956, aged 34.',
          'The decipherment showed that Greek was being written several centuries before the time of Homer, and that Greek-speaking Mycenaeans controlled Knossos when the tablets were produced. To some, the contents of the tablets were a disappointment: they contain no literature, no history and no letters — only lists, inventories and records of payments. It would be a mistake, however, to dismiss them as dull. In their records of rations, workers and religious offerings, they provide a picture of a palace economy that no literary source could offer. Linear A, meanwhile, remains undeciphered. When Ventris\'s sound values are applied to it, the resulting words do not correspond to Greek or to any other known language.',
        ],
        groups: [
          {
            range: [27, 31],
            type: 'mcq',
            instruction: 'Choose the correct letter, A, B, C or D.',
            questions: [
              { n: 27, prompt: 'According to the first paragraph, one reason progress on Linear B was slow is that', options: [['A', 'the tablets were too badly damaged to read.'], ['B', 'Evans did not make the texts widely available.'], ['C', 'Evans was unable to distinguish Linear A from Linear B.'], ['D', 'few scholars were interested in ancient Crete.']], answer: 'B', explain: 'Đoạn 1: "Evans was also slow to publish the tablets, which meant that few other scholars had access to the material". C sai vì Evans đã phân biệt và đặt tên hai hệ chữ.' },
              { n: 28, prompt: 'The discovery of tablets at Pylos was significant because it', options: [['A', 'provided a bilingual text.'], ['B', 'proved that Linear B was older than Linear A.'], ['C', 'raised doubts about Evans\'s view of the language of the script.'], ['D', 'allowed Ventris to begin his work immediately.']], answer: 'C', explain: 'Đoạn 2: "Their presence there was awkward for Evans\'s theory". D sai vì tài liệu Pylos chưa được công bố đến 1951.' },
              { n: 29, prompt: 'The number of different signs in Linear B suggested that', options: [['A', 'the script was an alphabet.'], ['B', 'each sign represented a syllable.'], ['C', 'the script consisted mainly of pictures.'], ['D', 'the tablets recorded more than one language.']], answer: 'B', explain: 'Đoạn 3: ~87 ký hiệu — quá nhiều cho bảng chữ cái, quá ít cho chữ biểu từ → "each sign probably represented a syllable".' },
              { n: 30, prompt: 'What did "Kober\'s triplets" demonstrate?', options: [['A', 'Words in the language changed their endings according to grammar.'], ['B', 'The sound values of several signs.'], ['C', 'The language of the tablets was Greek.'], ['D', 'The names of several Cretan towns.']], answer: 'A', explain: 'Đoạn 4: triplets "showed that the language was inflected, changing the forms of words according to their grammatical role". Kober không gán giá trị âm (B) và không đoán ngôn ngữ (C).' },
              { n: 31, prompt: 'What led directly to Ventris\'s breakthrough?', options: [['A', 'advice from John Chadwick'], ['B', 'a comparison with the Etruscan language'], ['C', 'testing sound values on words he believed were place names'], ['D', 'the discovery of the Tripod Tablet']], answer: 'C', explain: 'Đoạn 5: gán giá trị âm cho các từ nghi là địa danh (Knossos, Amnisos) → các từ khác giống tiếng Hy Lạp cổ. A và D xảy ra SAU đột phá.' },
            ],
          },
          {
            range: [32, 36],
            type: 'ynng',
            instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3? Choose YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.',
            questions: [
              { n: 32, prompt: 'Alice Kober has not received the recognition that her work deserves.', answer: 'YES', explain: 'Đoạn 4: "It is hard to avoid the conclusion that her contribution has been undervalued" — quan điểm của tác giả.' },
              { n: 33, prompt: 'Kober would have deciphered Linear B herself if she had lived longer.', answer: 'NOT GIVEN', explain: 'Tác giả chỉ nói bà mất trước khi đột phá xảy ra; không đưa ra nhận định giả định về việc bà có thể tự giải mã.' },
              { n: 34, prompt: 'Ventris had expected the language of Linear B to be Greek.', answer: 'NO', explain: 'Đoạn 5: Ventris tin ngôn ngữ liên quan đến Etruscan, và kết quả Hy Lạp "surprised Ventris himself".' },
              { n: 35, prompt: 'The Tripod Tablet provided strong support for Ventris\'s decipherment.', answer: 'YES', explain: 'Đoạn 6: "Confirmation soon followed… This \'Tripod Tablet\' persuaded many doubters".' },
              { n: 36, prompt: 'The Linear B tablets are of little value because they contain no literature.', answer: 'NO', explain: 'Đoạn 7: "It would be a mistake, however, to dismiss them as dull… they provide a picture of a palace economy that no literary source could offer".' },
            ],
          },
          {
            range: [37, 40],
            type: 'match',
            instruction: 'Complete each sentence with the correct ending, A–G, below.',
            options: [
              ['A', 'they contained pictorial signs representing goods.'],
              ['B', 'the language it records does not appear to be Greek.'],
              ['C', 'the tablets were found in a palace on the mainland.'],
              ['D', 'group together signs likely to share sounds.'],
              ['E', 'it showed that Greek was written long before the time of Homer.'],
              ['F', 'it was based on a bilingual inscription.'],
              ['G', 'Evans had published all of the tablets.'],
            ],
            questions: [
              { n: 37, prompt: 'Linear A cannot be read using Ventris\'s sound values because', answer: 'B', explain: 'Đoạn 7: các từ thu được "do not correspond to Greek or to any other known language".' },
              { n: 38, prompt: 'Scholars believed the tablets were mainly administrative records because', answer: 'A', explain: 'Đoạn 3: "pictorial symbols for goods such as horses, chariots and wine, together with numerals, suggesting that the tablets were mostly administrative records".' },
              { n: 39, prompt: 'Ventris arranged signs in the rows and columns of a grid in order to', answer: 'D', explain: 'Đoạn 5: cùng hàng = chung phụ âm, cùng cột = chung nguyên âm → nhóm các ký hiệu có khả năng chung âm.' },
              { n: 40, prompt: 'The decipherment changed understanding of early Greek history because', answer: 'E', explain: 'Đoạn 7: "Greek was being written several centuries before the time of Homer".' },
            ],
          },
        ],
      },
    ],
  },
];

// Strategy notes per question type (Vietnamese UI, English terms kept as used in the exam).
export const readingStrategies = [
  { type: 'TRUE / FALSE / NOT GIVEN', tips: [
    'TRUE: thông tin trong bài khớp (thường được paraphrase). FALSE: bài nói điều NGƯỢC LẠI. NOT GIVEN: bài không đề cập hoặc không đủ để kết luận.',
    'Chú ý từ tuyệt đối/hạn định: always, only, all, most, never, first — chúng thường là điểm quyết định giữa TRUE và FALSE/NOT GIVEN.',
    'Không dùng kiến thức bên ngoài. Câu đúng ngoài thực tế nhưng bài không nói → NOT GIVEN.',
    'Câu hỏi theo thứ tự xuất hiện trong bài.',
  ] },
  { type: 'YES / NO / NOT GIVEN', tips: [
    'Đánh giá QUAN ĐIỂM/NHẬN ĐỊNH của tác giả (claims/views), không phải dữ kiện thuần túy.',
    'Tìm các dấu hiệu thái độ: it is hard to avoid the conclusion, it would be a mistake, arguably, undoubtedly…',
  ] },
  { type: 'Matching Headings', tips: [
    'Heading tóm tắt Ý CHÍNH của cả đoạn, không phải một chi tiết.',
    'Đọc câu đầu + câu cuối đoạn trước; cẩn thận heading chứa từ khóa trùng với chi tiết phụ (bẫy).',
    'Làm phần này trước các câu hỏi chi tiết khác của passage giúp nắm cấu trúc bài.',
  ] },
  { type: 'Matching Features / Sentence Endings', tips: [
    'Features: có thể dùng một chữ cái nhiều lần (đọc kỹ NB). Scan tên riêng trước.',
    'Sentence endings: ghép phải đúng cả NGỮ PHÁP lẫn NỘI DUNG; câu hỏi theo thứ tự bài.',
  ] },
  { type: 'Summary / Note / Sentence Completion', tips: [
    'Tuân thủ tuyệt đối giới hạn từ: "ONE WORD ONLY", "NO MORE THAN TWO WORDS AND/OR A NUMBER". Vượt giới hạn = sai.',
    'Từ phải lấy NGUYÊN VĂN từ bài (trừ dạng có word box). Sai chính tả = sai. Từ có gạch nối tính là một từ.',
    'Đoán loại từ cần điền (danh từ số ít/nhiều, tính từ, động từ) trước khi tìm.',
  ] },
  { type: 'Multiple Choice', tips: [
    'Gạch chân từ khóa trong câu hỏi, tìm vị trí, rồi loại trừ từng phương án có bằng chứng.',
    'Phương án chứa từ y hệt bài đọc chưa chắc đúng — thường là bẫy. Đáp án đúng thường được paraphrase.',
  ] },
];
