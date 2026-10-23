'use strict';
// Presentation only: no gameplay state, save or scoring writes.
window.PageMotion = (() => {
  const html = document.documentElement;
  const button = document.getElementById('motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = true, last = null;
  const running = new Set();
  try { enabled = localStorage.getItem('ipcheck-motion') !== 'off'; } catch {}
  const allowed = () => enabled && !preference.matches && !document.hidden;
  function sync() {
    const on = enabled && !preference.matches;
    html.classList.toggle('motion-off', !on);
    html.classList.toggle('motion-paused', document.hidden);
    if (!allowed()) { running.forEach(a => a.cancel()); running.clear(); }
    button.textContent = I18n.lang === 'en' ? (on ? '◌ Motion on' : '◌ Motion off') : (on ? '◌ 动效开' : '◌ 动效关');
    button.setAttribute('aria-pressed', String(on));
    button.title = preference.matches ? (I18n.lang === 'en' ? 'Reduced motion follows your system setting' : '已跟随系统的减少动态效果设置') : '';
  }
  function animate(node, frames, duration = 360, delay = 0) {
    if (!node?.animate || !allowed()) return;
    const a = node.animate(frames, {duration, delay, easing:'cubic-bezier(.2,.7,.2,1)'});
    running.add(a);
    a.finished.catch(() => {}).finally(() => running.delete(a));
  }
  const rise = [{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}];
  function huntRendered(now) {
    // The game replaces its DOM each render. Animate only changed content.
    running.forEach(a => a.cancel()); running.clear();
    const fresh = !last || now.key !== last.key;
    if (fresh) {
      document.querySelectorAll('.hunt-character,.hunt-conversation,.hunt-notebook').forEach((el,i) => animate(el,rise,500,i*65));
    } else {
      const bubbles = document.querySelectorAll('.hunt-chat-log .hunt-bubble');
      if (now.count > last.count || (last.busy && !now.busy) || (now.challenge && !last.challenge)) animate(bubbles[bubbles.length-1],rise);
      if (now.selected !== last.selected) document.querySelectorAll('.hunt-pin.selected').forEach(el => animate(el,[{transform:'translateX(7px)',opacity:.65},{transform:'translateX(0)',opacity:1}],260));
      if (now.score !== last.score) animate(document.querySelector('.hunt-scoreboard>div:nth-child(2) b'),[{transform:'translateY(-5px)',color:'#b77c3a'},{transform:'translateY(0)',color:'inherit'}],420);
    }
    last = now;
  }
  function archiveRendered(arrive) {
    if (!arrive || document.body.classList.contains('hunt-active')) return;
    document.querySelectorAll('.passport,.receipt').forEach((el,i) => animate(el,rise,450,i*90));
  }
  button.addEventListener('click', () => { enabled = !enabled; try { localStorage.setItem('ipcheck-motion', enabled ? 'on' : 'off'); } catch {} sync(); });
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener?.('change', sync);
  new MutationObserver(sync).observe(html,{attributes:true,attributeFilter:['lang']});
  sync();
  return {huntRendered, archiveRendered};
})();
