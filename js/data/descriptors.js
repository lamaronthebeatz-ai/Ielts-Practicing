// Condensed paraphrase of the public IELTS band descriptors (revised public versions,
// May 2023). Wording is summarised for study purposes; the official documents on
// ielts.org remain the authoritative reference.

export const writingCriteria = {
  TA: {
    name: 'Task Achievement (Task 1)',
    bands: {
      9: 'Đáp ứng đầy đủ và phù hợp mọi yêu cầu của đề; mọi đặc điểm chính được trình bày khéo léo.',
      8: 'Bao quát mọi yêu cầu đầy đủ, phù hợp; các đặc điểm chính được chọn lọc khéo léo, trình bày và minh họa rõ ràng.',
      7: 'Bao quát yêu cầu; (Academic) có overview rõ ràng về xu hướng/khác biệt/giai đoạn chính; (GT) mục đích thư rõ, giọng văn nhất quán, phù hợp; các đặc điểm chính được làm nổi bật nhưng có thể mở rộng hơn.',
      6: 'Tập trung vào yêu cầu; có overview với thông tin được chọn lọc phù hợp; đặc điểm chính được nêu đủ nhưng có chi tiết thừa/không chính xác; (GT) giọng văn có thể chưa nhất quán.',
      5: 'Đáp ứng đề nhìn chung; kể chi tiết máy móc, KHÔNG có overview rõ ràng; có thể thiếu số liệu minh họa hoặc sai; đặc điểm chính chưa được bao quát đủ.',
      4: 'Cố gắng đáp ứng nhưng không bao quát hết đặc điểm chính; nhầm lẫn đặc điểm chính với chi tiết; hình thức có thể không phù hợp.',
    },
  },
  TR: {
    name: 'Task Response (Task 2)',
    bands: {
      9: 'Trả lời đầy đủ mọi phần của đề; quan điểm được phát triển trọn vẹn với ý tưởng liên quan, mở rộng và được chứng minh đầy đủ.',
      8: 'Trả lời đủ mọi phần; bài phát triển tốt với ý tưởng liên quan, mở rộng và có dẫn chứng; chỉ thỉnh thoảng thiếu sót nhỏ.',
      7: 'Trả lời mọi phần của đề; quan điểm rõ ràng xuyên suốt; ý chính được mở rộng và có dẫn chứng nhưng có thể khái quát hóa quá mức hoặc thiếu tập trung.',
      6: 'Trả lời mọi phần nhưng có phần chưa đầy đủ; có quan điểm liên quan dù kết luận có thể chưa rõ/lặp lại; một số ý chính phát triển chưa đủ hoặc chưa rõ.',
      5: 'Chỉ trả lời một phần đề; quan điểm có nhưng phát triển chưa rõ ràng; ý chính hạn chế, chưa đủ phát triển; có chi tiết không liên quan.',
      4: 'Trả lời tối thiểu hoặc lạc đề; quan điểm không rõ; ý chính khó nhận ra, lặp lại, không liên quan hoặc không có dẫn chứng.',
    },
  },
  CC: {
    name: 'Coherence & Cohesion',
    bands: {
      9: 'Liên kết mạch lạc đến mức không gây chú ý; chia đoạn được xử lý khéo léo.',
      8: 'Sắp xếp thông tin và ý tưởng logic; quản lý tốt mọi khía cạnh liên kết; chia đoạn đầy đủ, hợp lý.',
      7: 'Tổ chức thông tin logic, có sự tiến triển rõ ràng xuyên suốt; dùng đa dạng từ nối phù hợp dù có lúc thiếu/thừa; mỗi đoạn có ý trung tâm rõ ràng (Task 2).',
      6: 'Sắp xếp mạch lạc, có tiến triển chung rõ ràng; dùng từ nối hiệu quả nhưng liên kết trong/giữa câu có thể lỗi hoặc máy móc; quy chiếu (referencing) chưa luôn rõ; chia đoạn có lúc chưa logic.',
      5: 'Có tổ chức nhưng thiếu tiến triển tổng thể; từ nối chưa đủ, sai hoặc lạm dụng; lặp lại do thiếu quy chiếu; chia đoạn có thể chưa phù hợp.',
      4: 'Thông tin không được sắp xếp mạch lạc, không có tiến triển rõ; từ nối cơ bản dùng sai hoặc lặp lại; có thể không chia đoạn.',
    },
  },
  LR: {
    name: 'Lexical Resource',
    bands: {
      9: 'Vốn từ rộng, kiểm soát rất tự nhiên và tinh tế; chỉ có lỗi nhỏ hiếm hoi (slips).',
      8: 'Vốn từ rộng, dùng trôi chảy và linh hoạt để diễn đạt chính xác; dùng khéo từ ít phổ biến; thỉnh thoảng sai lựa chọn từ/collocation; lỗi chính tả, cấu tạo từ hiếm.',
      7: 'Đủ vốn từ để linh hoạt và chính xác; dùng từ ít phổ biến với ý thức về văn phong và collocation; thỉnh thoảng sai lựa chọn từ, chính tả, cấu tạo từ.',
      6: 'Vốn từ đủ cho đề bài; cố dùng từ ít phổ biến nhưng có chỗ thiếu chính xác; có lỗi chính tả/cấu tạo từ nhưng không cản trở giao tiếp.',
      5: 'Vốn từ hạn chế, vừa đủ tối thiểu; lỗi chính tả/cấu tạo từ đáng chú ý, có thể gây khó cho người đọc.',
      4: 'Chỉ dùng từ cơ bản, lặp lại hoặc không phù hợp; kiểm soát hạn chế cấu tạo từ và chính tả; lỗi có thể gây khó hiểu.',
    },
  },
  GRA: {
    name: 'Grammatical Range & Accuracy',
    bands: {
      9: 'Dùng đa dạng cấu trúc với sự linh hoạt và chính xác hoàn toàn; chỉ có lỗi nhỏ hiếm hoi.',
      8: 'Dùng đa dạng cấu trúc; phần lớn câu không lỗi; chỉ rất thỉnh thoảng có lỗi hoặc dùng chưa phù hợp.',
      7: 'Dùng nhiều cấu trúc phức tạp; câu không lỗi xuất hiện thường xuyên; kiểm soát tốt ngữ pháp và dấu câu dù còn vài lỗi.',
      6: 'Kết hợp câu đơn và câu phức; có lỗi ngữ pháp, dấu câu nhưng hiếm khi làm giảm khả năng truyền đạt.',
      5: 'Phạm vi cấu trúc hạn chế; có cố dùng câu phức nhưng kém chính xác hơn câu đơn; lỗi thường xuyên, dấu câu sai; có thể gây khó cho người đọc.',
      4: 'Phạm vi rất hạn chế, hiếm mệnh đề phụ; lỗi chiếm ưu thế; dấu câu thường sai.',
    },
  },
};

export const speakingCriteria = {
  FC: {
    name: 'Fluency & Coherence',
    bands: {
      9: 'Nói trôi chảy, hiếm khi lặp lại/tự sửa; ngập ngừng chỉ do suy nghĩ nội dung; mạch lạc, phát triển chủ đề đầy đủ.',
      8: 'Trôi chảy, chỉ thỉnh thoảng lặp lại/tự sửa; ngập ngừng thường do nội dung, hiếm khi do tìm từ; phát triển chủ đề mạch lạc.',
      7: 'Nói dài không tốn nhiều công sức, không mất mạch lạc; đôi khi ngập ngừng do ngôn ngữ, có lặp lại/tự sửa; dùng từ nối và discourse markers khá linh hoạt.',
      6: 'Sẵn sàng nói dài nhưng đôi khi mất mạch lạc vì lặp lại, tự sửa hoặc ngập ngừng; dùng nhiều từ nối nhưng không phải lúc nào cũng phù hợp.',
      5: 'Thường duy trì được dòng nói nhưng phải lặp lại, tự sửa và/hoặc nói chậm; lạm dụng một số từ nối; nói câu đơn trôi chảy nhưng ý phức tạp gặp khó.',
      4: 'Không thể trả lời mà không ngừng đáng kể; nói chậm, lặp lại và tự sửa thường xuyên; nối câu bằng từ nối đơn giản lặp lại; mạch lạc bị gián đoạn.',
    },
  },
  LR: {
    name: 'Lexical Resource',
    bands: {
      9: 'Dùng từ vựng linh hoạt, chính xác ở mọi chủ đề; dùng thành ngữ tự nhiên và chính xác.',
      8: 'Vốn từ rộng, dùng sẵn sàng và linh hoạt để diễn đạt chính xác; dùng khéo từ ít phổ biến và thành ngữ, đôi chỗ chưa chuẩn; paraphrase hiệu quả.',
      7: 'Dùng từ linh hoạt cho nhiều chủ đề; có từ ít phổ biến, thành ngữ, có ý thức về văn phong và collocation dù đôi khi chưa phù hợp; paraphrase hiệu quả.',
      6: 'Vốn từ đủ rộng để nói dài và làm rõ ý dù có chỗ chưa phù hợp; nhìn chung paraphrase thành công.',
      5: 'Xoay xở được chủ đề quen và lạ nhưng từ vựng kém linh hoạt; paraphrase lúc được lúc không.',
      4: 'Nói được về chủ đề quen thuộc nhưng chỉ truyền đạt ý cơ bản với chủ đề lạ; sai lựa chọn từ thường xuyên; hiếm khi paraphrase.',
    },
  },
  GRA: {
    name: 'Grammatical Range & Accuracy',
    bands: {
      9: 'Dùng đầy đủ các cấu trúc một cách tự nhiên, phù hợp; chính xác nhất quán, chỉ có lỗi nhỏ như người bản xứ.',
      8: 'Dùng đa dạng cấu trúc linh hoạt; phần lớn câu không lỗi; thỉnh thoảng có lỗi không hệ thống.',
      7: 'Dùng nhiều cấu trúc phức tạp khá linh hoạt; thường xuyên có câu không lỗi dù vẫn còn một số lỗi.',
      6: 'Kết hợp cấu trúc đơn và phức nhưng kém linh hoạt; có thể sai thường xuyên ở câu phức nhưng hiếm khi gây khó hiểu.',
      5: 'Dùng câu cơ bản khá chính xác; cấu trúc phức hạn chế, thường có lỗi và có thể gây khó hiểu.',
      4: 'Dùng câu cơ bản, một số câu đơn đúng; hiếm cấu trúc phụ thuộc; lỗi thường xuyên và có thể gây hiểu lầm.',
    },
  },
  P: {
    name: 'Pronunciation',
    bands: {
      9: 'Dùng đầy đủ các đặc điểm phát âm chính xác, tinh tế; duy trì linh hoạt; dễ hiểu hoàn toàn.',
      8: 'Dùng đa dạng đặc điểm phát âm, duy trì linh hoạt với vài sai sót nhỏ; dễ hiểu xuyên suốt; giọng bản ngữ ảnh hưởng tối thiểu.',
      7: 'Có tất cả đặc điểm tích cực của band 6 và một số (không phải tất cả) của band 8.',
      6: 'Dùng nhiều đặc điểm phát âm nhưng kiểm soát chưa đều; nhìn chung dễ hiểu, dù phát âm sai từ/âm đôi khi làm giảm độ rõ.',
      5: 'Có tất cả đặc điểm tích cực của band 4 và một số (không phải tất cả) của band 6.',
      4: 'Phạm vi đặc điểm phát âm hạn chế; lỗi thường xuyên; phát âm sai thường xuyên gây khó cho người nghe.',
    },
  },
};
