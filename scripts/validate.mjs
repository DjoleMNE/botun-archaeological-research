
import fs from "node:fs";
import assert from "node:assert/strict";
const pages=["index.html","mapa.html","istrazivanje.html","metod.html","o-projektu.html","404.html"];
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
