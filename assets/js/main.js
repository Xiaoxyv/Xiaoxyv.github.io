// 轻量交互：当前年份、平滑滚动、口令解锁入口
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  });
});
// 打印：先把所有曲目展开，再交给浏览器
document.getElementById('print-all')?.addEventListener('click', () => {
  document.querySelectorAll('#songs details').forEach((d) => { d.open = true; });
  window.print();
});

const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());
