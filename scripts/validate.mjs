import fs from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
const pages=["index.html","laserski-podaci.html","istrazivanje.html","kap-crveni-mulj.html","kolektor-botun.html","mapa.html","metod.html","o-projektu.html","404.html"];
for(const p of pages){const s=fs.readFileSync(p,"utf8");assert(s.includes('lang="cnr-Latn"'),p+": language");for(const term of ["isključivo AI agenti","Đorđa Vukčevića","Rezultate nije provjerio niti potvrdio nijedan čovjek","preliminarno"]){assert(s.includes(term),p+": disclaimer "+term);}assert(s.includes('class="site-notice"')&&s.includes('class="footer-warning"'),p+": notices");assert(!s.includes('href="dnevnik.html"'),p+": removed page");for(const nav of [...s.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)]){const links=[...nav[1].matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(x=>x[1]);assert(links.at(-1)==="mapa.html",p+": map last");assert(links.length===7,p+": nav count");}assert((s.match(/<nav\b/g)||[]).length===2,p+": desktop and mobile nav");}
assert(!fs.existsSync("dnevnik.html"),"removed diary");
const home=fs.readFileSync("index.html","utf8");
assert(home.includes("Kako Botun izgleda iz svemira?"),"home satellite near top");
assert(home.indexOf("Kako Botun izgleda iz svemira?")<home.indexOf("Šta za sada znamo?"),"home section order");
assert(home.indexOf('id="najvaznije"')>home.indexOf('id="teme"'),"home statistics at bottom");
for(const s of ["98.448","31.327","27.535","14.032","Nijedno novo arheološko otkriće nije potvrđeno."]){assert(home.includes(s),"home missing "+s);}
for(const [page,names] of Object.entries({"istrazivanje.html":["gedi_mjerenja_me.svg","icesat2_mjerenja_me.svg","osjetljivost_pregleda_me.svg","zelenilo_pet_jeseni_me.svg"],"kap-crveni-mulj.html":["kap_jesenji_niz_me.svg","kap_2021_2026_me.svg","kap_proljece_jesen_2026_me.svg"],"kolektor-botun.html":["collector_context_2021_2025_2026_me.svg"],"index.html":["gedi_mjerenja_me.svg","nasadem_relief_me.svg","sentinel_godisnja_doba_me.svg"]})){const s=fs.readFileSync(page,"utf8");for(const x of names){assert(s.includes(x),page+": missing real source visual "+x);assert(fs.statSync("assets/figures/"+x).size>5000,page+": missing image "+x);}}
const r=JSON.parse(fs.readFileSync("data/research.json","utf8"));const zones=JSON.parse(fs.readFileSync("data/pregled-po-zonama.json","utf8"));const c=JSON.parse(fs.readFileSync("data/kolektor-botun.json","utf8"));const cat=JSON.parse(fs.readFileSync("data/izvori.json","utf8"));
assert(r.updates.length===27&&r.datasets.length===8,"research records preserved");
assert(zones.zone_data.length===3&&zones.zone_data.reduce((a,x)=>a+x.gedi,0)===98448&&zones.zone_data.reduce((a,x)=>a+x.icesat,0)===27535,"zone totals");
assert(zones.historic.records.length===6,"historical register");
assert(c.sources.length===9&&c.human_verified===false,"collector source records");
assert(cat.entries.length>=16,"source catalogue preserved");
const map=fs.readFileSync("mapa.html","utf8");
assert(map.includes('id="research-map"')&&map.includes('data-ring="3000"')&&map.includes('data-ring="10000"'),"map functionality retained");
const geo=JSON.parse(fs.readFileSync("data/study-area.geojson","utf8"));
assert.deepEqual(geo.features.filter(f=>f.properties?.radius_m).map(f=>f.properties.radius_m).sort((a,b)=>a-b),[3000,5000,10000],"ring boundaries");
const css=fs.readFileSync("assets/style.css","utf8"),js=fs.readFileSync("assets/app.js","utf8");
assert(css.includes("max-width:650px")&&css.includes(".image-modal"),"responsive design and image viewer");
assert(js.includes("analysis-notes")&&js.includes("data-viewer")&&js.includes("research-map"),"interactive features");
for(const p of pages){const s=fs.readFileSync(p,"utf8");assert(!/results\/(phase4_|collector_followup|kap_validation_followup)/.test(s),p+": private exploratory paths should not leak");}
console.log("Provjera gotova: devet stranica, čista navigacija, stvarni prikazi, javni izvori i ograničenja su sačuvani.");
for(const f of ["gedi_mjerenja_po_zonama_me.svg","icesat2_mjerenja_po_zonama_me.svg"]){const s=fs.readFileSync("assets/figures/"+f,"utf8");assert(s.includes("<svg")&&s.includes("Početni filter")&&s.includes("Brojevi nijesu"),"Source-derived laser chart missing "+f);assert(fs.readFileSync("istrazivanje.html","utf8").includes(f),"Laser chart not visible "+f);}

/* Scientific handoff R019: source-exact laser data, 3D viewer, official scan */
for(const [filename,n] of [["gedi_points.json",2067],["atl08_points.json",1339]]){const x=JSON.parse(fs.readFileSync("assets/laser-3d/"+filename,"utf8"));assert(x.points.length===n,filename+": wrong native count");assert(x.columns.includes("native_id"),filename+": native ID missing");}
const m3=JSON.parse(fs.readFileSync("assets/laser-3d/manifest.json","utf8"));assert(m3.human_verified===false&&m3.integration.allow_cross_mission_overlay===false,"3D layers not safely separated");
assert(fs.statSync("assets/laser-3d/pregled_3d_me.html").size>700000,"3D viewer missing");
const st3=fs.readFileSync("istrazivanje.html","utf8");assert(st3.includes('id="laser-3d"')&&st3.includes("gedi_3d_me.svg")&&st3.includes("atl08_profil_me.svg"),"Laser 3D or static fallback missing");
const pmt=fs.readFileSync("kolektor-botun.html","utf8");
assert(pmt.includes('id="gradjevinska-dozvola"')&&pmt.includes("wapi.gov.me/download/8e3cca0e"),"Official construction permit document missing");
assert(pmt.includes("30. oktobar 2025.")&&pmt.includes("3. februar 2026."),"Permit/correction dates missing");
assert(!pmt.includes("potpisani PDF još nije pregledan"),"Stale permit acquisition claim");


const laserPage=fs.readFileSync("laserski-podaci.html","utf8");
for(const term of ['id="view"','id="measurement-table"','id="download-selection"','nijesu neobrađeni signali instrumenta','Ovo nije cijelo područje'])assert(laserPage.includes(term),"Laser page missing "+term);
assert(!pmt.includes("njen PDF još nije pregledan"),"Stale permit card");
assert(!pmt.includes('class="data-fold permit-preview"'),"Failed permit iframe should use direct source link");
const times=[...pmt.matchAll(/<time>(.*?)<\/time>/g)].map(x=>x[1]);
assert.deepEqual(times,["2022.","2024–2025.","30. oktobar 2025.","14. januar 2026.","3. februar 2026.","2. oktobar 2026."],"Collector chronology");
for(const p of pages){const s=fs.readFileSync(p,"utf8");assert(s.includes("NASA-u, Copernicus i USGS"),p+": public-source disclaimer");assert(s.includes("Sajt ažuriran: 13. novembar 2026."),p+": update date");assert((s.match(/href="laserski-podaci.html"/g)||[]).length>=2,p+": laser page navigation");}
assert(!JSON.stringify(r).includes('"note_en"'),"English research fields must not reach UI export");
console.log("Laser stranica, porijeklo podataka, navigacija i ispravke provjereni.");

for(const layer of m3.layers){
 const bytes=fs.readFileSync("assets/laser-3d/"+layer.file);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),layer.file_sha256,"Native point bytes changed");
 const data=JSON.parse(bytes);const col=k=>data.columns.indexOf(k);
 assert(data.points.every(row=>typeof row[col("native_id")]==="string"),"Native IDs must remain strings");
 assert(data.points.every(row=>Number.isFinite(row[col("height_m")])&&Number.isFinite(row[col("longitude")])&&Number.isFinite(row[col("latitude")])),"Finite measurement coordinates/heights");
 data.passes.forEach((p,i)=>assert.equal(data.points.filter(row=>row[col("pass_index")]===i).length,p.rows,"Pass counts and original indices"));
}
console.log("Izvorni bajtovi, oznake i pripadnost prolazima očuvani.");
