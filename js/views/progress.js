import { html, raw, bandClass, fmtBand, fmtDate, fmtTime } from '../ui.js';
import { store, latestBands, streak } from '../store.js';
import { progressChart } from '../charts.js';

const LABEL = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking', 'listening-practice': 'Listening (luyện phần)', 'speaking-practice': 'Speaking (luyện phần)' };

export function render(el) {
  const draw = () => {
    const s = store.get();
    const attempts = [...s.attempts].sort((a, b) => b.date.localeCompare(a.date));
    const series = {};
    for (const k of ['listening', 'reading', 'writing', 'speaking']) {
      series[LABEL[k]] = s.attempts.filter((a) => a.skill === k && a.band != null).sort((a, b) => a.date.localeCompare(b.date)).map((a) => ({ date: a.date, band: a.band }));
    }
    const bands = latestBands();
    const days = Object.keys(s.activity).length;
    el.innerHTML = String(html`
      <div class="page-head"><div><h1>Tiến độ</h1><p>Toàn bộ dữ liệu được lưu trên thiết bị này. Sao lưu trong Cài đặt.</p></div></div>
      <div class="grid g4">
        ${['listening', 'reading', 'writing', 'speaking'].map((k) => html`<div class="card stat"><span class="l">${LABEL[k]} hiện tại</span><span class="v"><span class="band ${bandClass(bands[k])}">${fmtBand(bands[k])}</span></span></div>`)}
      </div>
      <div class="grid g2" style="margin-top:1rem">
        <div class="card"><h3>Band theo thời gian</h3>${raw(progressChart(series))}</div>
        <div class="card"><h3>Thói quen học</h3>
          <div class="metric"><span>Chuỗi ngày liên tiếp</span><strong>${streak()}</strong></div>
          <div class="metric"><span>Tổng số ngày có học</span><strong>${days}</strong></div>
          <div class="metric"><span>Tổng số bài đã làm</span><strong>${s.attempts.length}</strong></div>
          <div class="metric"><span>Thẻ từ vựng đã học</span><strong>${Object.keys(s.srs).length}</strong></div>
          ${heatmap(s.activity)}
        </div>
      </div>
      <div class="card" style="margin-top:1rem">
        <h3>Lịch sử bài làm</h3>
        ${attempts.length
          ? html`<div class="table-wrap"><table class="data"><thead><tr><th>Thời gian</th><th>Kỹ năng</th><th>Bài</th><th>Kết quả</th><th>Band</th><th></th></tr></thead><tbody>
            ${attempts.map((a) => html`<tr>
              <td>${fmtDate(a.date)}</td><td>${LABEL[a.skill] || a.skill}</td><td>${a.title}</td>
              <td>${a.raw != null ? `${a.raw}/${a.total}` : ''}${a.detail?.seconds ? ` · ${fmtTime(a.detail.seconds)}` : ''}${a.detail?.criteria ? ` · ${a.detail.criteria.join('/')}` : ''}</td>
              <td><span class="band ${bandClass(a.band)}">${fmtBand(a.band)}</span></td>
              <td><button class="btn sm ghost" data-del="${a.id}" aria-label="Xóa">🗑</button></td></tr>`)}
          </tbody></table></div>`
          : html`<p class="muted">Chưa có bài làm nào.</p>`}
      </div>`);
  };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-del]');
    if (b && confirm('Xóa kết quả này?')) {
      store.removeAttempt(b.dataset.del);
      draw();
    }
  });
  draw();
}

function heatmap(activity) {
  const cells = [];
  const d = new Date();
  d.setDate(d.getDate() - 7 * 12 + 1);
  for (let i = 0; i < 84; i++) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const v = activity[k] || 0;
    cells.push(`<rect x="${Math.floor(i / 7) * 14}" y="${(i % 7) * 14}" width="12" height="12" rx="2" fill="${v ? (v > 4 ? 'var(--ok)' : 'var(--primary-2)') : 'var(--surface-2)'}" opacity="${v ? Math.min(1, 0.4 + v * 0.15) : 1}"><title>${k}: ${v}</title></rect>`);
    d.setDate(d.getDate() + 1);
  }
  return raw(`<p class="small muted" style="margin:.8rem 0 .3rem">12 tuần gần nhất</p><svg viewBox="0 0 168 98" style="width:100%;max-width:420px" role="img" aria-label="Lịch hoạt động">${cells.join('')}</svg>`);
}
