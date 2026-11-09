import { html } from '../ui.js';
import { skills, scoringRules, testOptions, FORMAT_UPDATED } from '../data/format.js';
import { writingCriteria, speakingCriteria } from '../data/descriptors.js';
import { CONVERSION } from '../scoring.js';
import { readingStrategies } from '../data/reading.js';
import { listeningStrategies } from '../data/listening.js';

function descriptorTable(criteria) {
  const keys = Object.keys(criteria);
  return html`<div class="table-wrap"><table class="data">
    <thead><tr><th>Band</th>${keys.map((k) => html`<th>${criteria[k].name}</th>`)}</tr></thead>
    <tbody>${[9, 8, 7, 6, 5, 4].map((b) => html`<tr><th>${b}</th>${keys.map((k) => html`<td>${criteria[k].bands[b]}</td>`)}</tr>`)}</tbody>
  </table></div>`;
}

function convTable(rows) {
  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const [min, band] = rows[i];
    const max = i === 0 ? 40 : rows[i - 1][0] - 1;
    if (band < 2.5) break;
    out.push([min === max ? `${min}` : `${min}–${max}`, band]);
  }
  return html`<table class="data"><thead><tr><th>Số câu đúng</th><th>Band</th></tr></thead><tbody>${out.map(([r, b]) => html`<tr><td>${r}</td><td>${b.toFixed(1)}</td></tr>`)}</tbody></table>`;
}

export function render(el) {
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Cấu trúc đề thi & cách chấm điểm</h1><p>Thông tin theo định dạng hiện hành (cập nhật ${FORMAT_UPDATED}). Luôn đối chiếu với trang chính thức ielts.org và trung tâm thi của bạn.</p></div></div>

    <div class="grid g2">
      ${skills.map((s) => html`<div class="card">
        <h3>${s.name}</h3>
        <p class="row small"><span class="tag primary">${s.time}</span><span class="tag">${s.questions}</span></p>
        <p class="small muted">${s.same}</p>
        <ul class="ticks">${s.parts.map((p) => html`<li>${p}</li>`)}</ul>
        <details><summary>Lưu ý</summary><ul class="ticks">${s.notes.map((p) => html`<li>${p}</li>`)}</ul></details>
      </div>`)}
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>Cách tính điểm Overall</h3>
      <ul class="ticks">${scoringRules.map((r) => html`<li>${r}</li>`)}</ul>
      <p><a class="btn sm" href="#/tools">Mở công cụ tính band →</a></p>
    </div>

    <div class="card">
      <h3>Bảng quy đổi điểm Listening & Reading (tham khảo)</h3>
      <p class="small muted">Các mốc chính thức được công bố: Listening và Academic Reading — 16 câu ≈ band 5, 23 ≈ 6, 30 ≈ 7, 35 ≈ 8; General Training Reading — 15 ≈ 4, 23 ≈ 5, 30 ≈ 6, 34 ≈ 7, 38 ≈ 8. Bảng đầy đủ có thể chênh lệch nhẹ giữa các đề vì được hiệu chỉnh theo độ khó.</p>
      <div class="grid g3">
        <div><h4>Listening</h4>${convTable(CONVERSION.listening)}</div>
        <div><h4>Academic Reading</h4>${convTable(CONVERSION.academicReading)}</div>
        <div><h4>General Training Reading</h4>${convTable(CONVERSION.generalReading)}</div>
      </div>
    </div>

    <div class="card">
      <h3>Các loại bài thi & quy định</h3>
      <div class="table-wrap"><table class="data"><tbody>${testOptions.map((o) => html`<tr><th style="width:30%">${o.name}</th><td>${o.desc}</td></tr>`)}</tbody></table></div>
    </div>

    <div class="card">
      <h3>Band descriptors — Writing</h3>
      <p class="small muted">Tóm tắt từ bản công khai (sửa đổi tháng 5/2023). Mỗi tiêu chí chiếm 25% điểm của từng Task; Task 2 có trọng số gấp đôi Task 1.</p>
      ${descriptorTable(writingCriteria)}
    </div>
    <div class="card">
      <h3>Band descriptors — Speaking</h3>
      ${descriptorTable(speakingCriteria)}
    </div>

    <div class="grid g2" style="margin-top:1rem">
      <div class="card"><h3>Chiến lược Reading</h3>
        ${readingStrategies.map((s) => html`<details><summary>${s.type}</summary><ul class="ticks">${s.tips.map((t) => html`<li>${t}</li>`)}</ul></details>`)}
      </div>
      <div class="card"><h3>Chiến lược Listening</h3><ul class="ticks">${listeningStrategies.map((t) => html`<li>${t}</li>`)}</ul></div>
    </div>
  `);
}
