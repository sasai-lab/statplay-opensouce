// StatPlay — module: URL PARAM RESTORE — reads ?id1=v1&id2=v2 and applies saved slider state

export function initUrlParams(){
  const params=new URLSearchParams(location.search);
  if([...params.keys()].length===0) return;
  // Apply values, then fire events to trigger each module's draw/clear logic.
  const pending=[];
  params.forEach((v,k)=>{
    const el=document.getElementById(k);
    if(!el) return;
    if(el.tagName==='SELECT'){
      el.value=v;
      pending.push([el,'change']);
    } else if(el.tagName==='INPUT'){
      el.value=v;
      pending.push([el,'input']);
    }
  });
  if(pending.length===0) return;
  function dispatchPending(){
    pending.forEach(([el,type])=>{
      try{el.dispatchEvent(new Event(type,{bubbles:true}));}catch(_){}
    });
  }
  // Dispatch once shortly after init so eager modules pick it up...
  setTimeout(dispatchPending,150);
  // ...and again whenever a lazily-loaded widget finishes initialising, so a
  // deep-link into a widget that hadn't loaded yet still restores its state.
  document.addEventListener('statplay:widget-ready',dispatchPending);
}
