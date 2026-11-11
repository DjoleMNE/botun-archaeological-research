(function(){
"use strict";
const STATUS={planned:"Planirano",in_progress:"Istraživanje u toku",verified:"Podaci obrađeni",blocked:"Pristup nije ostvaren",unavailable:"Nedostupno"};
const $=s=>document.querySelector(s);
const tag=(name,cls,text)=>{const x=document.createElement(name);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;};
const fmtDate=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||"");if(!m)return s||"";const months=["","januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"];return Number(m[3])+". "+months[Number(m[2])]+" "+m[1]+".";};
const details=$("#izvjestaji");
if(details){let loaded=false;details.addEventListener("toggle",async()=>{
if(!details.open||loaded)return;loaded=true;
try{const res=await fetch("data/research.json",{cache:"no-store"});if(!res.ok)throw new Error("Podaci trenutno nijesu dostupni");const data=await res.json();
const ds=$("#dataset-list"),updates=$("#updates-list");if(!ds||!updates)return;ds.replaceChildren();updates.replaceChildren();
(data.datasets||[]).forEach(d=>{const card=tag("article","dataset-card");const status=tag("span","status-tag",STATUS[d.status]||"Provjera u toku");const h=tag("h4","",d.name);const p=tag("p","",d.note);card.append(status,h,p);if(d.source_url&&/^https:\/\//.test(d.source_url)){const a=tag("a","","Otvori izvor ↗");a.href=d.source_url;a.target="_blank";a.rel="noopener noreferrer";card.append(a);}ds.append(card);});
(data.updates||[]).slice().reverse().forEach(d=>{const card=tag("article","updates-card");card.append(tag("time","",fmtDate(d.date)),tag("strong","",d.title),tag("p","",d.description));updates.append(card);});
}catch(e){const p=tag("p","", "Pregled podataka trenutno nije dostupan. Ranije objavljeni rezultati ostaju na stranici.");$("#dataset-list")?.replaceChildren(p);$("#updates-list")?.replaceChildren(tag("p","","Pokušajte kasnije."));}
});}
const input=$("#analysis-notes"),save=$("#notes-save"),noteStatus=$("#notes-status");
if(input&&save){try{input.value=localStorage.getItem("botun-licne-biljeske-v1")||"";}catch(e){}
save.addEventListener("click",()=>{try{localStorage.setItem("botun-licne-biljeske-v1",input.value.slice(0,2000));noteStatus.textContent="Sačuvano samo na ovom uređaju."; }catch(e){noteStatus.textContent="Čuvanje nije dostupno u ovom pregledaču.";}});}
const mapDiv=$("#research-map");
if(mapDiv){if(typeof L==="undefined"){mapDiv.textContent="Mapa se nije učitala. Provjeri internet vezu.";return;}
const map=L.map(mapDiv,{scrollWheelZoom:false,zoomControl:false}).setView([42.385,19.20],11);
L.control.zoom({zoomInTitle:"Uvećaj mapu",zoomOutTitle:"Umanji mapu"}).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> saradnici'}).addTo(map);
L.circleMarker([42.385,19.20],{radius:6,weight:2,color:"#fff",fillColor:"#a4472d",fillOpacity:1}).bindPopup("<strong>Botun — orijentacioni centar</strong><br>Približna polazna tačka, nije arheološki nalaz.").addTo(map);
const colors={3000:"#a7513b",5000:"#cf923f",10000:"#2d7761"},layers={};
fetch("data/study-area.geojson").then(r=>{if(!r.ok)throw Error();return r.json()}).then(g=>{
(g.features||[]).forEach(f=>{if(f.geometry?.type!=="Polygon"||!f.properties?.radius_m)return;const n=f.properties.radius_m;
const lay=L.geoJSON(f,{style:{color:colors[n]||"#2d7761",weight:2,opacity:.9,fillOpacity:.045,dashArray:n===10000?"8 5":undefined}});
lay.bindPopup("<strong>Istraživački obuhvat: "+n/1000+" km</strong><br>Ovo nije granica detaljnog laserskog snimanja.");lay.addTo(map);layers[n]=lay;});
if(layers[10000])map.fitBounds(layers[10000].getBounds(),{padding:[20,20]});
}).catch(()=>{mapDiv.insertAdjacentElement("afterend",tag("p","map-error","Granice istraživanja trenutno nijesu dostupne."));});
document.querySelectorAll("[data-ring]").forEach(c=>c.addEventListener("change",()=>{const l=layers[Number(c.dataset.ring)];if(!l)return;if(c.checked)map.addLayer(l);else map.removeLayer(l);}));
}
const viewerLinks=[...document.querySelectorAll("a[data-viewer]")];
if(viewerLinks.length&&typeof HTMLDialogElement!=="undefined"){
const dialog=tag("dialog","image-modal");dialog.innerHTML='<div class="modal-toolbar"><strong id="viewer-title">Pregled slike</strong><button type="button" id="viewer-minus" aria-label="Umanji">−</button><button type="button" id="viewer-plus" aria-label="Uvećaj">+</button><button type="button" id="viewer-reset" aria-label="Vrati cijelu sliku">1×</button><button type="button" id="viewer-prev" aria-label="Prethodna slika">‹</button><button type="button" id="viewer-next" aria-label="Sljedeća slika">›</button><button type="button" id="viewer-close" aria-label="Zatvori prikaz">×</button></div><div class="modal-canvas" id="viewer-stage"><img id="viewer-img" alt=""></div><div class="modal-footer"><span>Koristi + / − za zumiranje, prevlačenje za pomjeranje.</span><a id="viewer-original" href="#" target="_blank" rel="noopener noreferrer">Otvori izvorni prikaz ↗</a></div>';
document.body.append(dialog);
const stage=dialog.querySelector("#viewer-stage"),img=dialog.querySelector("#viewer-img"),title=dialog.querySelector("#viewer-title"),original=dialog.querySelector("#viewer-original");
const unique=viewerLinks.filter((a,i,arr)=>arr.findIndex(b=>b.getAttribute("href")===a.getAttribute("href"))===i);
let at=0,scale=1,dx=0,dy=0,drag=null;
const apply=()=>{img.style.transform="translate("+dx+"px,"+dy+"px) scale("+scale+")";};
const show=i=>{at=(i+unique.length)%unique.length;const a=unique[at];title.textContent=a.dataset.title||a.getAttribute("aria-label")||"Stvarna slika";img.src=a.href;img.alt=title.textContent;original.href=a.href;scale=1;dx=0;dy=0;apply();};
viewerLinks.forEach(a=>a.addEventListener("click",e=>{e.preventDefault();const i=unique.findIndex(x=>x.getAttribute("href")===a.getAttribute("href"));show(Math.max(0,i));dialog.showModal();}));
const zoom=f=>{scale=Math.max(1,Math.min(5,Math.round(scale*f*100)/100));if(scale===1){dx=0;dy=0;}apply();};
dialog.querySelector("#viewer-plus").onclick=()=>zoom(1.4);
dialog.querySelector("#viewer-minus").onclick=()=>zoom(1/1.4);
dialog.querySelector("#viewer-reset").onclick=()=>{scale=1;dx=dy=0;apply();};
dialog.querySelector("#viewer-next").onclick=()=>show(at+1);
dialog.querySelector("#viewer-prev").onclick=()=>show(at-1);
dialog.querySelector("#viewer-close").onclick=()=>dialog.close();
stage.addEventListener("pointerdown",e=>{if(scale<=1)return;drag={x:e.clientX,y:e.clientY,dx,dy,id:e.pointerId};stage.setPointerCapture(e.pointerId);});
stage.addEventListener("pointermove",e=>{if(!drag||e.pointerId!==drag.id)return;dx=drag.dx+e.clientX-drag.x;dy=drag.dy+e.clientY-drag.y;apply();});
for(const type of ["pointerup","pointercancel"])stage.addEventListener(type,()=>drag=null);
dialog.addEventListener("keydown",e=>{if(e.key==="ArrowRight")show(at+1);if(e.key==="ArrowLeft")show(at-1);if(e.key==="+")zoom(1.4);if(e.key==="-")zoom(1/1.4);});
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
}
})();