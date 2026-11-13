/* Native R019 public observations. Display only: no surface, interpolation or classification. */
(async function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('view'), ctx = canvas.getContext('2d');
  const base = 'assets/laser-3d/';
  const fmt = (value, digits = 2) => value === null || value === undefined ? 'Nema podatka' : Number(value).toLocaleString('sr-Latn-ME', {maximumFractionDigits: digits});
  const countNoun = n => n % 10 === 1 && n % 100 !== 11 ? 'zapis' : 'zapisa';
  const date = value => value.slice(0, 10).split('-').reverse().join('.') + '.';
  let manifest, datasets;
  try {
    const files = await Promise.all(['manifest.json', 'gedi_points.json', 'atl08_points.json'].map(async name => {
      const response = await fetch(base + name);
      if (!response.ok) throw Error('Data unavailable');
      return response.json();
    }));
    manifest = files[0]; datasets = {gedi: files[1], atl08: files[2]};
    for (const layer of manifest.layers) {
      const dataset = datasets[layer.id];
      if (dataset.points.length !== layer.rows || !dataset.columns.includes('native_id')) throw Error('Unexpected dataset');
    }
  } catch (error) {
    $('count').textContent = 'Podaci se nijesu učitali.';
    $('hint').textContent = 'Pokušaj ponovo ili otvori statični prikaz i podatke preko veza ispod.';
    return;
  }
  let layer, data, rows, columns, selected = null, projected = [], page = 0;
  let yaw = -.65, pitch = .48, zoom = 1, ex = 1, width = 800, height = 510, zmid = 0, span = 1, hmin = 0, hmax = 1;
  const at = (row, key) => row[columns.indexOf(key)];
  function project(x, y, z) {
    const a = x * Math.cos(yaw) - y * Math.sin(yaw), b = x * Math.sin(yaw) + y * Math.cos(yaw), v = (z - zmid) * ex;
    const scale = Math.min(width * .78, height * .72) / span * zoom;
    return [width / 2 + a * scale, height * .55 - (b * Math.sin(pitch) + v * Math.cos(pitch)) * scale, b * Math.cos(pitch) - v * Math.sin(pitch)];
  }
  function axis(a, b, label) {
    const p = project(...a), q = project(...b);
    ctx.strokeStyle = '#9eb1b3'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    ctx.fillStyle = '#38565a'; ctx.font = '12px system-ui';
    ctx.fillText(label, Math.max(8, Math.min(width - ctx.measureText(label).width - 8, q[0] + 4)), Math.max(15, Math.min(height - 8, q[1] - 5)));
  }
  function render() {
    if (!ctx || !rows) return;
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
    const a = -span * .42, b = span * .42;
    axis([a,a,hmin], [b,a,hmin], 'Istok (m)'); axis([a,a,hmin], [a,b,hmin], 'Sjever (m)'); axis([a,a,hmin], [a,a,hmax], 'NASA visina (m)');
    projected = rows.map(row => ({p: project(at(row,'east_m'), at(row,'north_m'), at(row,'height_m')), row})).sort((a,b) => a.p[2] - b.p[2]);
    for (const q of projected) {
      ctx.fillStyle = `hsl(${230 - 200 * (at(q.row,'height_m') - hmin) / Math.max(1,hmax - hmin)},72%,43%)`;
      ctx.beginPath(); ctx.arc(q.p[0],q.p[1],2,0,Math.PI*2); ctx.fill();
    }
    if (selected) {
      const p = project(at(selected,'east_m'),at(selected,'north_m'),at(selected,'height_m'));
      ctx.strokeStyle = '#152b23'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p[0],p[1],7,0,Math.PI*2); ctx.stroke();
    }
    $('count').textContent = layer.name_me + ' · ' + fmt(rows.length,0) + ' stvarnih zapisa';
    $('scale').textContent = ex === 1 ? 'Visina ×1 — stvarna razmjera' : 'Visina ×' + ex + ' — namjerno uvećana';
  }
  function showSelected(row) {
    selected = row;
    const values = [['Izvor', layer.name_me], ['Datum (UTC)', at(row,'time_utc')], ['NASA visina', fmt(at(row,'height_m'),3)+' m'], ['Geografska dužina', fmt(at(row,'longitude'),7)+'°'], ['Geografska širina', fmt(at(row,'latitude'),7)+'°'], ['Oznaka zapisa', at(row,'native_id')], ['Prolaz', data.passes[at(row,'pass_index')].key], ['Početna provjera', 'Prolazi']];
    if (layer.id === 'gedi') values.push(['Osjetljivost', fmt(at(row,'sensitivity'),3)+' (nije sigurnost otkrića)']);
    else values.push(['NASA neizvjesnost', fmt(at(row,'h_te_uncertainty'),3)+' m'], ['Povrataka označenih kao tlo', fmt(at(row,'n_te_photons'),0)]);
    const dl = document.createElement('dl');
    for (const [key,value] of values) {const dt=document.createElement('dt'), dd=document.createElement('dd');dt.textContent=key;dd.textContent=String(value);dl.append(dt,dd);}
    $('point').replaceChildren(dl);
    $('hint').textContent = 'Odabran zapis '+at(row,'native_id')+'. NASA visina '+fmt(at(row,'height_m'),3)+' m. To nije potvrda arheološkog ostatka.';
    document.querySelectorAll('.laser-row-pick').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.id === at(row,'native_id'))));
    render();
  }
  function table() {
    const tbody = $('measurement-rows'); tbody.replaceChildren();
    rows.slice(page*20,page*20+20).forEach((row, i) => {
      const tr=document.createElement('tr'), first=document.createElement('td'), button=document.createElement('button');
      button.type='button';button.className='laser-row-pick';button.textContent='Odaberi';button.dataset.id=at(row,'native_id');button.setAttribute('aria-label','Odaberi zapis '+at(row,'native_id'));button.setAttribute('aria-pressed',String(row===selected));button.addEventListener('click',()=>showSelected(row));first.append(button);tr.append(first);
      for (const value of [at(row,'time_utc'),fmt(at(row,'height_m'),3),fmt(at(row,'longitude'),7),fmt(at(row,'latitude'),7),at(row,'native_id')]) {const td=document.createElement('td');td.textContent=value;tr.append(td);}
      tbody.append(tr);
    });
    $('table-status').textContent = rows.length ? 'Zapisi '+(page*20+1)+'–'+Math.min(rows.length,page*20+20)+' od '+fmt(rows.length,0) : 'Nema zapisa';
    $('table-prev').disabled=page===0; $('table-next').disabled=(page+1)*20>=rows.length;
  }
  function filter() {
    rows = $('pass').value === 'all' ? data.points : data.points.filter(row => at(row,'pass_index') === Number($('pass').value));
    selected=null;page=0;$('point').textContent='Klikni na tačku ili odaberi red u tabeli.';
    $('hint').textContent = 'Prikazano '+fmt(rows.length,0)+' zapisa. Praznine nijesu popunjene.';
    table();render();
  }
  function selectLayer() {
    layer=manifest.layers.find(x=>x.id===$('mission').value); data=datasets[layer.id]; columns=data.columns;
    [hmin,hmax]=layer.height_range_m;zmid=(hmin+hmax)/2;
    const xs=data.points.map(row=>at(row,'east_m')), ys=data.points.map(row=>at(row,'north_m'));
    span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));
    $('pass').replaceChildren(new Option('Svi sačuvani datumi','all'));
    data.passes.map((p,index)=>({p,index})).sort((a,b)=>b.p.date_start_utc.localeCompare(a.p.date_start_utc)||a.index-b.index).forEach(({p,index})=>$('pass').add(new Option(date(p.date_start_utc)+' · '+p.rows+' '+countNoun(p.rows)+' · prolaz '+(index+1),String(index))));
    $('meaning').textContent=layer.height_meaning_me;
    $('dates').textContent='Period: '+date(layer.acquisition_start_utc)+' — '+date(layer.acquisition_end_utc)+'. Početnu provjeru prolazi '+fmt(layer.rows,0)+' od '+fmt(layer.raw_records_in_example,0)+' sačuvanih zapisa u ovom primjeru.';
    $('quality').textContent=layer.quality_me;
    const source=document.createElement('a');source.href=layer.source_url;source.textContent=layer.name_me+' · '+layer.product;source.target='_blank';source.rel='noopener noreferrer';$('source').replaceChildren(source,document.createTextNode(' — '+layer.attribution_me));
    $('download').href=base+layer.file;$('low').textContent=fmt(hmin,1)+' m';$('high').textContent=fmt(hmax,1)+' m';filter();
  }
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(!ctx)return;canvas.setPointerCapture(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;yaw+=(e.clientX-drag.x)*.008;pitch=Math.max(-1.45,Math.min(1.45,pitch+(e.clientY-drag.y)*.006));drag.x=e.clientX;drag.y=e.clientY;render();});
  canvas.addEventListener('pointerup',e=>{if(drag&&drag.id===e.pointerId&&!drag.moved){const r=canvas.getBoundingClientRect();let nearest=null,best=18**2;for(const q of projected){const d=(q.p[0]-(e.clientX-r.left))**2+(q.p[1]-(e.clientY-r.top))**2;if(d<best){nearest=q.row;best=d;}}if(nearest)showSelected(nearest);else $('hint').textContent='Na ovom mjestu nema dovoljno bliske prikazane tačke.';}drag=null;});
  canvas.addEventListener('pointercancel',()=>drag=null);
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.35,Math.min(8,zoom*Math.exp(-e.deltaY*.001)));render();},{passive:false});
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')yaw-=.15;if(e.key==='ArrowRight')yaw+=.15;if(e.key==='ArrowUp')pitch=Math.min(1.45,pitch+.1);if(e.key==='ArrowDown')pitch=Math.max(-1.45,pitch-.1);if(e.key==='+')zoom=Math.min(8,zoom*1.2);if(e.key==='-')zoom=Math.max(.35,zoom/1.2);render();}});
  const action=(id,fn)=>$(id).addEventListener('click',()=>{fn();render();});
  action('left',()=>yaw-=Math.PI/6);action('right',()=>yaw+=Math.PI/6);action('plus',()=>zoom=Math.min(8,zoom*1.25));action('minus',()=>zoom=Math.max(.35,zoom/1.25));action('top',()=>pitch=Math.PI/2);action('side',()=>pitch=0);action('reset',()=>{yaw=-.65;pitch=.48;zoom=1;ex=1;$('exaggeration').value='1';});
  $('table-prev').addEventListener('click',()=>{if(page>0){page--;table();}});$('table-next').addEventListener('click',()=>{if((page+1)*20<rows.length){page++;table();}});
  $('download-selection').addEventListener('click',()=>{
    const payload={...data,points:rows,selection:{pass_index:$('pass').value==='all'?null:Number($('pass').value),rows:rows.length,source_file:layer.file,source_file_sha256:layer.file_sha256}};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='botun_'+layer.id+'_'+($('pass').value==='all'?'svi':('prolaz_'+$('pass').value))+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('mission').addEventListener('change',selectLayer);$('pass').addEventListener('change',filter);$('exaggeration').addEventListener('change',()=>{ex=Number($('exaggeration').value);render();});
  $('laser-controls').disabled=false;$('download-selection').disabled=false;
  selectLayer();new ResizeObserver(render).observe(canvas);
  if(!ctx){$('hint').textContent='3D prikaz nije dostupan u ovom pregledaču. Sva mjerenja možeš pregledati u tabeli i preuzeti.';$('measurement-table').open=true;}
})();
