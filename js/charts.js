// Minimal accessible SVG charts (no dependencies).
import { esc } from './ui.js';

export const PALETTE = ['#1d6fa5', '#e07b24', '#2f9e6b', '#9b59b6', '#c0392b'];

function axes({ W, H, P, yMax, steps, unit, x }) {
  let s = '<g class="grid">';
  for (let i = 0; i <= steps; i++) {
    const v = (yMax / steps) * i;
    const y = H - P.b - ((H - P.t - P.b) * v) / yMax;
    s += `<line x1="${P.l}" x2="${W - P.r}" y1="${y}" y2="${y}"/><text x="${P.l - 8}" y="${y + 4}" text-anchor="end">${+v.toFixed(1)}</text>`;
  }
  s += '</g>';
  s += `<text x="${P.l}" y="${P.t - 8}">${esc(unit)}</text>`;
  const step = (W - P.l - P.r) / x.length;
  x.forEach((lab, i) => {
    s += `<text x="${P.l + step * i + step / 2}" y="${H - P.b + 18}" text-anchor="middle">${esc(lab)}</text>`;
  });
  return s;
}

function legend(series) {
  return `<div class="legend">${series.map((s, i) => `<span><i style="background:${PALETTE[i % PALETTE.length]}"></i>${esc(s.name)}</span>`).join('')}</div>`;
}

function srTable(chart) {
  return `<table class="data" style="position:absolute;left:-9999px"><caption>Data</caption><tr><th></th>${chart.x.map((x) => `<th>${esc(x)}</th>`).join('')}</tr>${chart.series
    .map((s) => `<tr><th>${esc(s.name)}</th>${s.data.map((d) => `<td>${d}</td>`).join('')}</tr>`)
    .join('')}</table>`;
}

export function lineChart(chart, title = '') {
  const W = 640, H = 340, P = { l: 48, r: 16, t: 28, b: 34 };
  const { yMax, x } = chart;
  const step = (W - P.l - P.r) / x.length;
  const px = (i) => P.l + step * i + step / 2;
  const py = (v) => H - P.b - ((H - P.t - P.b) * v) / yMax;
  let s = axes({ W, H, P, yMax, steps: 5, unit: chart.unit, x });
  chart.series.forEach((ser, k) => {
    const c = PALETTE[k % PALETTE.length];
    s += `<polyline fill="none" stroke="${c}" stroke-width="3" points="${ser.data.map((v, i) => `${px(i)},${py(v)}`).join(' ')}"/>`;
    ser.data.forEach((v, i) => {
      s += `<circle cx="${px(i)}" cy="${py(v)}" r="4.5" fill="${c}"><title>${esc(ser.name)} ${esc(x[i])}: ${v}${esc(chart.unit === '%' ? '%' : '')}</title></circle>`;
    });
  });
  return `<figure class="chart" style="margin:0;position:relative"><svg class="svgchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">${s}</svg>${legend(chart.series)}${srTable(chart)}</figure>`;
}

export function barChart(chart, title = '') {
  const W = 640, H = 340, P = { l: 48, r: 16, t: 28, b: 34 };
  const { yMax, x, series } = chart;
  const step = (W - P.l - P.r) / x.length;
  const bw = (step * 0.8) / series.length;
  const py = (v) => H - P.b - ((H - P.t - P.b) * v) / yMax;
  let s = axes({ W, H, P, yMax, steps: yMax > 20 ? 5 : 4, unit: chart.unit, x });
  series.forEach((ser, k) => {
    const c = PALETTE[k % PALETTE.length];
    ser.data.forEach((v, i) => {
      const x0 = P.l + step * i + step * 0.1 + bw * k;
      s += `<rect x="${x0}" y="${py(v)}" width="${bw - 2}" height="${H - P.b - py(v)}" fill="${c}" rx="2"><title>${esc(ser.name)} ${esc(x[i])}: ${v}</title></rect>`;
    });
  });
  return `<figure class="chart" style="margin:0;position:relative"><svg class="svgchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">${s}</svg>${legend(series)}${srTable(chart)}</figure>`;
}

/** Progress over time: points = [{ date, band }] per series. */
export function progressChart(seriesMap) {
  const names = Object.keys(seriesMap).filter((k) => seriesMap[k].length);
  if (!names.length) return '<p class="muted">Chưa có dữ liệu. Hãy làm một bài thi để bắt đầu theo dõi tiến độ.</p>';
  const all = names.flatMap((n) => seriesMap[n]);
  const t0 = Math.min(...all.map((p) => +new Date(p.date)));
  const t1 = Math.max(...all.map((p) => +new Date(p.date)));
  const W = 640, H = 260, P = { l: 36, r: 16, t: 16, b: 28 };
  const px = (t) => (t1 === t0 ? (W + P.l - P.r) / 2 : P.l + ((W - P.l - P.r) * (t - t0)) / (t1 - t0));
  const py = (b) => H - P.b - ((H - P.t - P.b) * b) / 9;
  let s = '<g class="grid">';
  for (let b = 0; b <= 9; b += 1.5) s += `<line x1="${P.l}" x2="${W - P.r}" y1="${py(b)}" y2="${py(b)}"/><text x="${P.l - 6}" y="${py(b) + 4}" text-anchor="end">${b}</text>`;
  s += '</g>';
  const fmt = (t) => new Date(t).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  s += `<text x="${P.l}" y="${H - 6}">${fmt(t0)}</text><text x="${W - P.r}" y="${H - 6}" text-anchor="end">${fmt(t1)}</text>`;
  names.forEach((n, k) => {
    const c = PALETTE[k % PALETTE.length];
    const pts = seriesMap[n].map((p) => [px(+new Date(p.date)), py(p.band), p.band]);
    if (pts.length > 1) s += `<polyline fill="none" stroke="${c}" stroke-width="2.5" points="${pts.map((p) => p.slice(0, 2).join(',')).join(' ')}"/>`;
    pts.forEach(([x, y, b]) => {
      s += `<circle cx="${x}" cy="${y}" r="4" fill="${c}"><title>${esc(n)}: ${b}</title></circle>`;
    });
  });
  return `<svg class="svgchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Band score progress">${s}</svg>${legend(names.map((n) => ({ name: n })))}`;
}
