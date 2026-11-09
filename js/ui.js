// Small DOM helpers: safe HTML templating, toasts, timers.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

class Raw {
  constructor(s) {
    this.s = s;
  }
  toString() {
    return this.s;
  }
}
export const raw = (s) => new Raw(String(s));

/** Tagged template: interpolations are escaped unless wrapped in raw() or are arrays of raw. */
export function html(strings, ...vals) {
  let out = strings[0];
  vals.forEach((v, i) => {
    out += fmt(v) + strings[i + 1];
  });
  return raw(out);
}
function fmt(v) {
  if (v == null || v === false) return '';
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(fmt).join('');
  return esc(v);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Multi-line plain text → paragraphs. */
export const paras = (text) => raw(String(text).split(/\n\s*\n/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join(''));

export function toast(msg, kind = 'info', ms = 3200) {
  let host = $('#toasts');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toasts';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => el.classList.add('out'), ms);
  setTimeout(() => el.remove(), ms + 400);
}

export const fmtTime = (sec) => {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Countdown timer that survives tab throttling by measuring wall-clock time. */
export class Countdown {
  constructor(seconds, { onTick, onEnd } = {}) {
    this.remaining = seconds;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this.running = false;
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.endAt = Date.now() + this.remaining * 1000;
    this.tick();
    this.iv = setInterval(() => this.tick(), 250);
  }
  tick() {
    this.remaining = Math.max(0, (this.endAt - Date.now()) / 1000);
    this.onTick?.(this.remaining);
    if (this.remaining <= 0) {
      this.stop();
      this.onEnd?.();
    }
  }
  pause() {
    if (!this.running) return;
    this.tick();
    this.stop();
  }
  stop() {
    this.running = false;
    clearInterval(this.iv);
  }
}

export class Stopwatch {
  constructor(onTick) {
    this.onTick = onTick;
    this.elapsed = 0;
  }
  start() {
    this.t0 = Date.now() - this.elapsed * 1000;
    this.iv = setInterval(() => {
      this.elapsed = (Date.now() - this.t0) / 1000;
      this.onTick?.(this.elapsed);
    }, 250);
  }
  stop() {
    clearInterval(this.iv);
    if (this.t0) this.elapsed = (Date.now() - this.t0) / 1000;
  }
}

export function bandClass(b) {
  if (b == null) return 'band-none';
  if (b >= 7) return 'band-high';
  if (b >= 5.5) return 'band-mid';
  return 'band-low';
}

export const fmtBand = (b) => (b == null ? '–' : Number(b).toFixed(1));

export function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function download(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 0);
}

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Route guard: views can register a function that returns a warning string while a test is running. */
let guard = null;
export const setLeaveGuard = (fn) => {
  guard = fn;
};
export const leaveWarning = () => (guard ? guard() : null);
