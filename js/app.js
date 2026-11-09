import { store } from './store.js';
import { $, $$, html, leaveWarning, setLeaveGuard, toast } from './ui.js';
import { stopSpeaking } from './tts.js';

const routes = [
  [/^\/?$/, 'home', () => import('./views/home.js')],
  [/^\/guide$/, 'guide', () => import('./views/guide.js')],
  [/^\/listening$/, 'listening', () => import('./views/listening.js')],
  [/^\/listening\/([\w-]+)$/, 'listening', () => import('./views/listening.js')],
  [/^\/reading$/, 'reading', () => import('./views/reading.js')],
  [/^\/reading\/([\w-]+)$/, 'reading', () => import('./views/reading.js')],
  [/^\/writing$/, 'writing', () => import('./views/writing.js')],
  [/^\/writing\/([\w-]+)$/, 'writing', () => import('./views/writing.js')],
  [/^\/speaking$/, 'speaking', () => import('./views/speaking.js')],
  [/^\/speaking\/([\w-]+)$/, 'speaking', () => import('./views/speaking.js')],
  [/^\/vocab$/, 'vocab', () => import('./views/vocab.js')],
  [/^\/vocab\/(review)$/, 'vocab', () => import('./views/vocab.js')],
  [/^\/progress$/, 'progress', () => import('./views/progress.js')],
  [/^\/tools$/, 'tools', () => import('./views/tools.js')],
  [/^\/settings$/, 'settings', () => import('./views/settings.js')],
  [/^\/more$/, 'more', () => import('./views/more.js')],
];

const main = $('#main');
let cleanup = null;
let currentHash = location.hash;
let suppress = false;

function applyTheme() {
  const t = store.get().settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

async function route() {
  if (suppress) {
    suppress = false;
    return;
  }
  const warn = leaveWarning();
  if (warn && location.hash !== currentHash) {
    if (!confirm(warn)) {
      suppress = true;
      location.hash = currentHash;
      return;
    }
  }
  setLeaveGuard(null);
  currentHash = location.hash;
  const path = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  const match = routes.find(([re]) => re.test(path));
  try {
    cleanup?.();
  } catch (e) {
    console.error(e);
  }
  cleanup = null;
  stopSpeaking();

  if (!match) {
    main.innerHTML = String(html`<div class="card"><h2>Không tìm thấy trang</h2><p><a href="#/">Về trang tổng quan</a></p></div>`);
    return;
  }
  const [re, nav, loader] = match;
  const params = path.match(re).slice(1);
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === nav || (nav !== 'home' && a.dataset.nav === 'more' && ['vocab', 'progress', 'guide', 'tools', 'settings', 'more'].includes(nav))));
  try {
    const mod = await loader();
    // A fresh container per route so event listeners attached by a view die with it.
    const view = document.createElement('div');
    view.className = 'view';
    main.replaceChildren(view);
    cleanup = (await mod.render(view, ...params)) || null;
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } catch (e) {
    console.error(e);
    main.innerHTML = String(html`<div class="alert bad"><strong>Đã xảy ra lỗi khi tải trang.</strong><br>${e.message}</div>`);
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('beforeunload', (e) => {
  if (leaveWarning()) {
    e.preventDefault();
    e.returnValue = '';
  }
});
store.subscribe(applyTheme);
applyTheme();
route();

// Service worker: offline support + update prompt
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      const prompt = (worker) => {
        if (document.querySelector('.update-bar')) return;
        const bar = document.createElement('div');
        bar.className = 'alert info update-bar row';
        bar.innerHTML = '<span>Đã có phiên bản mới.</span><span class="spacer"></span><button class="btn sm primary">Cập nhật</button>';
        bar.querySelector('button').onclick = () => worker.postMessage('skipWaiting');
        document.body.appendChild(bar);
      };
      if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) prompt(w);
        });
      });
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        location.reload();
      });
    } catch (e) {
      console.warn('SW registration failed', e);
    }
  });
}

window.addEventListener('offline', () => toast('Bạn đang offline — ứng dụng vẫn hoạt động bình thường.'));
