// StatPlay — module: AUTO-RUN ON SCROLL

export function initAutorun(){
  const panels=document.querySelectorAll('[data-autorun]');
  const seen=new WeakSet();
  function visibleEnough(el){
    const r=el.getBoundingClientRect();
    const vh=window.innerHeight||document.documentElement.clientHeight||0;
    if(r.height<=0) return false;
    const overlap=Math.min(r.bottom,vh)-Math.max(r.top,0);
    return overlap>0 && overlap/r.height>=0.35;
  }
  function fire(target){
    if(seen.has(target)) return;
    const id=target.getAttribute('data-autorun');
    const btn=document.getElementById(id);
    if(btn){seen.add(target);btn.click();}
  }
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) fire(e.target); });
  },{threshold:0.35});
  panels.forEach(p=>io.observe(p));

  // A lazily-loaded widget may finish initialising *after* its [data-autorun]
  // panel was already 35%-visible — the IO's click then hit a button with no
  // listener and the panel was (incorrectly) marked seen. When a widget signals
  // readiness, clear that stale flag for its panels and re-run them if visible.
  document.addEventListener('statplay:widget-ready',ev=>{
    const sentinel=ev && ev.detail && ev.detail.sentinel;
    const root=sentinel ? document.getElementById(sentinel) : null;
    const section=root ? (root.closest('section') || root) : document;
    section.querySelectorAll('[data-autorun]').forEach(p=>{
      // Any prior `seen` entry here is from a no-op click (the widget hadn't
      // attached its listener yet) — safe to retry.
      seen.delete(p);
      if(visibleEnough(p)) fire(p);
    });
  });
}
