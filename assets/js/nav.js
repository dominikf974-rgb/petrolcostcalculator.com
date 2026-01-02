<script>
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(!header || !btn || !nav) return;

  const close = () => {
    header.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Menü öffnen');
  };

  const open = () => {
    header.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Menü schließen');
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    header.classList.contains('is-open') ? close() : open();
  });

  // Klick außerhalb schließt
  document.addEventListener('click', (e) => {
    if(!header.classList.contains('is-open')) return;
    if(header.contains(e.target)) return;
    close();
  });

  // ESC schließt
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') close();
  });

  // Beim Wechsel auf Desktop: Menü zu (damit nix “hängen bleibt”)
  window.addEventListener('resize', () => {
    if(window.innerWidth > 720) close();
  });
});
</script>
