
import fs from "node:fs";
import assert from "node:assert/strict";
const pages=["index.html","mapa.html","istrazivanje.html","metod.html","o-projektu.html","kap-crveni-mulj.html","404.html"];
for(const name of pages){
 const s=fs.readFileSync(name,"utf8");
 assert(s.includes('lang="cnr-Latn"'),name+": wrong language");
 for(const phrase of ["isključivo AI agenti","Đorđa Vukčevića","nije provjerio niti potvrdio nijedan čovjek","preliminarno"]){assert(s.includes(phrase),name+": missing disclaimer phrase "+phrase);}
 assert(s.includes('class="site-notice"'),name+": missing visible disclaimer");
 assert(s.includes('class="footer-warning"'),name+": missing footer disclaimer");
 assert(!s.includes("language-toggle"),name+": bilingual toggle must not exist");
}
const data=JSON.parse(fs.readFileSync("data/research.json","utf8"));
assert(data.datasets.length>=6,"dataset list too short");
assert(!JSON.stringify(data).includes('"note_en"'),"no English notes in public data");
assert(data.datasets.find(d=>d.id==="gedi").note.includes("98.448"),"GEDI data mismatch");
assert(data.datasets.find(d=>d.id==="icesat2").note.includes("27.535"),"ICESat-2 data mismatch");
for(const d of data.datasets){assert(/^https:\/\//.test(d.source_url),"missing secure provider link");assert(d.note.length>50,"explanation too short");}
const g=JSON.parse(fs.readFileSync("data/study-area.geojson","utf8"));
const radii=g.features.filter(f=>f.properties&&f.properties.radius_m).map(f=>f.properties.radius_m).sort((a,b)=>a-b);
assert.deepStrictEqual(radii,[3000,5000,10000],"study rings must remain 3/5/10 km");

const homepage=fs.readFileSync("index.html","utf8");
for(const phrase of ['id="research-map"','Nijedno novo arheološko otkriće nije potvrđeno.','98.448','31.327','27.535','14.032','Planirani istraživački obuhvat']){
  assert(homepage.includes(phrase)|| (phrase==="Planirani istraživački obuhvat" && homepage.includes("planirane granice")), "Homepage missing prominent evidence or map context: "+phrase);
}
assert(homepage.includes("leaflet.js"),"Interactive homepage map must load map library");
assert(homepage.includes("ne prikazuju") || homepage.includes("ne prikazuju površinu") || homepage.includes("ne služe za poređenje"),"Explain what graphics do not measure");
const updates=data.updates||[];
assert(updates.length>=2,"Research log must include most recent public-safe update");
console.log("Provjera završena: sve javne stranice sadrže obavještenje, a javni podaci i granice odgovaraju osnovnim pravilima.");

const CSS=fs.readFileSync("assets/style.css","utf8");
assert(CSS.includes(".mobile-navigation"),"mobile navigation styling missing");
assert(CSS.includes("max-width:780px"),"mobile breakpoint missing");
assert(!fs.existsSync("dnevnik.html"),"Dnevnik page must be removed");
for(const name of pages){
 const markup=fs.readFileSync(name,"utf8");
 assert(markup.includes('class="mobile-navigation"'),name+": missing phone menu");
 assert(markup.includes('aria-label="Navigacija za telefon"'),name+": missing accessible phone nav");
 assert(!markup.includes('href="dnevnik.html"'),name+": orphaned diary link");
}

const landscapePages=["index.html","istrazivanje.html"];
for(const name of landscapePages){
 const s=fs.readFileSync(name,"utf8");
 assert(s.includes("nasadem_relief_me.svg"),name+": no NASADEM figure");
 assert(s.includes("sentinel_godisnja_doba_me.svg"),name+": no Sentinel-2 figure");
 assert(s.includes('id="pravi-predio"'),name+": missing landscape section");
 assert(s.includes("bez ljudske provjere"),name+": missing human-verification caveat near figures");
}
for(const file of ["assets/figures/nasadem_relief_me.svg","assets/figures/sentinel_godisnja_doba_me.svg"]){
 assert(fs.statSync(file).size>100000,file+": missing original scientific figure");
}
assert(!fs.existsSync("dnevnik.html"),"Removed diary page must stay removed");

const kap=fs.readFileSync("kap-crveni-mulj.html","utf8");
for(const term of ["420.000 m²","7–8 miliona tona","Bazen A","Bazen B","nije provjerio niti potvrdio nijedan čovjek"])assert(kap.includes(term),"Missing KAP label: "+term);
for(const name of pages){const html=fs.readFileSync(name,"utf8");assert((html.match(/href="kap-crveni-mulj.html"/g)||[]).length>=2,name+": KAP navigation links missing");}
assert(JSON.parse(fs.readFileSync("data/kap-crveni-mulj.json","utf8")).facts.basins===2,"Basin data invalid");

const sourceCatalogue=JSON.parse(fs.readFileSync("data/izvori.json","utf8"));
assert(sourceCatalogue.entries.length>=13,"Public source catalogue incomplete");
for(const status of ["active","documentary_active","new_research","specification_only","candidate"]){
 assert(sourceCatalogue.entries.some(e=>e.status===status),"Missing source status "+status);
}
const currentKap=fs.readFileSync("kap-crveni-mulj.html","utf8");
assert(currentKap.includes("kap_okolina_sentinel_me.svg"),"KAP-specific image missing from page");
assert(currentKap.includes("2021.")&&currentKap.includes("Agencije za zaštitu životne sredine"),"Official EPA boundary evidence missing");
assert(currentKap.includes("nijesu ucrtane potvrđene granice"),"KAP boundary limitation missing");
assert(fs.statSync("assets/figures/kap_okolina_sentinel_me.svg").size>1000000,"KAP actual image missing");
const aboutSources=fs.readFileSync("o-projektu.html","utf8");
for(const txt of ["Podaci koje smo već koristili","Zvanični dokumenti i javni izvještaji","Dodatni izvori koje tek možemo istražiti"]) {
 assert(aboutSources.includes(txt),"Missing source status disclosure: "+txt);
}
const kapStructure=currentKap.indexOf('id="kap-satelit"');
assert(kapStructure>0&&kapStructure<currentKap.indexOf('id="kap-fakti"'),"KAP actual images must come before background text");

for (const page of pages) {
 const s=fs.readFileSync(page,"utf8");
 for (const selector of ['<nav class="site-nav" aria-label="Glavna navigacija">','<nav aria-label="Navigacija za telefon">']) {
  const start=s.indexOf(selector),end=s.indexOf("</nav>",start);
  assert(start>=0&&end>start,page+": missing navigation");
  const links=[...s.slice(start+selector.length,end).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[^<]+<\/a>/g)].map(m=>m[1]);
  assert(links.length>=5,page+": unexpected link count");
  assert(links.at(-1)==="mapa.html",page+": Mapa must be the rightmost/last navigation link");
 }
}

/* Public releases from research R-013 and R-014: publication and source-state checks */
const timelineSvg="assets/figures/kap_jesenji_niz_me.svg";
for(const filename of ["kap_2021_2026_me.svg","kap_proljece_jesen_2026_me.svg","kap_jesenji_niz_me.svg","worldcover_2021_me.svg","povrsinska_voda_1984_2024_me.svg"]){
 const s=fs.readFileSync("assets/figures/"+filename,"utf8");
 assert(s.includes("<svg")&&s.includes("</svg>"),filename+": real figure invalid");
 assert(!s.includes("<script"),filename+": script in SVG");
}
const kapUpdated=fs.readFileSync("kap-crveni-mulj.html","utf8");
for(const f of ["kap_2021_2026_me.svg","kap_proljece_jesen_2026_me.svg","kap_jesenji_niz_me.svg"])assert(kapUpdated.includes(f),"Missing KAP image "+f);
assert(kapUpdated.includes("2022.")&&kapUpdated.includes("nijesu ucrtane")===false?kapUpdated.includes("ne prikazujemo kao potvrđene granice"):true,"KAP limitations missing");
assert(!kapUpdated.includes("basin_outlines_provisional.geojson"),"Private geometry accidentally exposed");
const studyNew=fs.readFileSync("istrazivanje.html","utf8");
for(const f of ["worldcover_2021_me.svg","povrsinska_voda_1984_2024_me.svg"])assert(studyNew.includes(f),"Missing regional map "+f);
const newSources=JSON.parse(fs.readFileSync("data/izvori.json","utf8"));
for(const nm of ["ESA WorldCover","JRC Global Surface Water"]){
 const e=newSources.entries.find(x=>x.name===nm);
 assert(e&&e.status==="active",nm+": acquired layer status out-of-date");
}
assert(newSources.entries.some(x=>x.name.includes("Podgorica")), "Previously documented municipal sources lost");
assert(newSources.entries.some(x=>x.name==="Copernicus Sentinel-1"&&x.status==="candidate"),"Unacquired radar incorrectly promoted");
