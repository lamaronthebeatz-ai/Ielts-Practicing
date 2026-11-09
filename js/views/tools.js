import { html, $, bandClass, fmtBand } from '../ui.js';
import { overallBand, rawToBand } from '../scoring.js';
import { store } from '../store.js';

const HALF = Array.from({ length: 19 }, (_, i) => i / 2).reverse();

export function render(el) {
  const gt = store.get().profile.module === 'general';
  el.innerHTML = String(html`
    <div class="page-head"><div><h1>Công cụ tính band</h1><p>Quy đổi điểm thô và tính Overall theo quy tắc làm tròn chính thức.</p></div></div>
    <div class="grid g2">
      <div class="card">
        <h3>Quy đổi số câu đúng → band</h3>
        <div class="grid g2">
          <label class="field">Listening (0–40)<input type="number" id="rawL" min="0" max="40" value="30"></label>
          <label class="field">Reading (0–40)<input type="number" id="rawR" min="0" max="40" value="30"></label>
        </div>
        <label class="field" style="margin-top:.6rem">Loại Reading
          <select id="rmod"><option value="academicReading">Academic</option><option value="generalReading" ${gt ? 'selected' : ''}>General Training</option></select>
        </label>
        <div class="row" style="margin-top:.8rem">Listening: <span class="band" id="bL"></span> Reading: <span class="band" id="bR"></span>
          <button class="btn sm" id="useLR">Dùng cho Overall ↓</button></div>
      </div>
      <div class="card">
        <h3>Overall band</h3>
        <div class="grid g4">
          ${['L', 'R', 'W', 'S'].map((k) => html`<label class="field">${{ L: 'Listening', R: 'Reading', W: 'Writing', S: 'Speaking' }[k]}<select id="o${k}">${HALF.map((b) => html`<option value="${b}" ${b === 6.5 ? 'selected' : ''}>${b.toFixed(1)}</option>`)}</select></label>`)}
        </div>
        <p style="margin-top:1rem">Trung bình: <strong id="avg"></strong> → Overall: <span class="big-band" id="ov"></span></p>
        <p class="small muted" id="why"></p>
      </div>
    </div>
  `);

  const calcRaw = () => {
    const l = rawToBand(Number($('#rawL').value), 'listening');
    const r = rawToBand(Number($('#rawR').value), $('#rmod').value);
    $('#bL').textContent = fmtBand(l);
    $('#bL').className = `band ${bandClass(l)}`;
    $('#bR').textContent = fmtBand(r);
    $('#bR').className = `band ${bandClass(r)}`;
    return { l, r };
  };
  const calcOverall = () => {
    const v = ['L', 'R', 'W', 'S'].map((k) => Number($(`#o${k}`).value));
    const avg = v.reduce((a, b) => a + b, 0) / 4;
    const o = overallBand(...v);
    $('#avg').textContent = avg.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    $('#ov').textContent = fmtBand(o);
    $('#ov').className = `big-band ${bandClass(o)}`;
    const dir = o > avg ? 'làm tròn LÊN' : o < avg ? 'làm tròn XUỐNG' : 'giữ nguyên';
    $('#why').textContent = `${avg} → ${dir} thành ${o.toFixed(1)} (nửa band gần nhất; mốc .25 và .75 được làm tròn lên).`;
  };
  el.addEventListener('input', () => {
    calcRaw();
    calcOverall();
  });
  $('#useLR').onclick = () => {
    const { l, r } = calcRaw();
    $('#oL').value = String(l);
    $('#oR').value = String(r);
    calcOverall();
  };
  calcRaw();
  calcOverall();
}
