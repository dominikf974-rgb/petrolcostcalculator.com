(function(){
  function norm(u){
    u = (u || '').toLowerCase().trim();
    if(!u) return '';
    try{ if(u.startsWith('http')) u = new URL(u).pathname; }catch(e){}
    if(!u.startsWith('/')) u = '/' + u;
    if(u === '/index.html') u = '/';
    if(u.length > 1 && u.endsWith('/')) u = u.slice(0,-1);
    return u;
  }

  function applyActive(){
    const nav = document.getElementById('site-nav');
    if(!nav) return false;

    const links = Array.from(nav.querySelectorAll('.tablink'));
    if(!links.length) return false;

    const path = norm(location.pathname);

    links.forEach(a => a.removeAttribute('aria-current'));

    let match = links.find(a => norm(a.getAttribute('href')) === path);

    if(!match && (path === '/' || path === '')) {
      match = links.find(a => norm(a.getAttribute('href')) === '/');
    }

    if(!match){
      match = links.find(a => {
        const h = norm(a.getAttribute('href'));
        if(h === '/') return false;
        return path.endsWith(h) || h.endsWith(path);
      });
    }

    if(match) match.setAttribute('aria-current','page');
    return true;
  }

  // sofort versuchen
  if (applyActive()) return;

  // warten bis Header nachgeladen ist
  const obs = new MutationObserver(() => {
    if (applyActive()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList:true, subtree:true });

  // Fallbacks
  setTimeout(applyActive, 600);
  setTimeout(applyActive, 1500);
})();
