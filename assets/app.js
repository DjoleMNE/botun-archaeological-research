
(function(){
  "use strict";
  var STATUS={planned:"Planirano",in_progress:"Istraživanje u toku",verified:"Podaci obrađeni",blocked:"Čeka se pristup",unavailable:"Nedostupno"};
  function el(tag, cls, txt){var x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x;}
  function safeDate(iso){var p=iso.split("-");return p.length===3?Number(p[2])+". "+({1:"januara",2:"februara",3:"marta",4:"aprila",5:"maja",6:"juna",7:"jula",8:"avgusta",9:"septembra",10:"oktobra",11:"novembra",12:"decembra"}[Number(p[1])]||p[1])+" "+p[0]+".":iso;}
  function renderData(data){
    var ds=document.getElementById("dataset-list");
    if(ds){ds.replaceChildren();(data.datasets||[]).forEach(function(d){
      var card=el("article","dataset-card");card.id=d.id;
      var status=el("span","status-tag "+(d.status||"planned"),STATUS[d.status]||"Provjera u toku");card.appendChild(status);
      card.appendChild(el("h2","",d.name));
      card.appendChild(el("p","",d.note));
      if(d.source_url&&/^https:\/\//.test(d.source_url)){var a=el("a","", "Pogledaj izvor podataka ↗");a.href=d.source_url;a.target="_blank";a.rel="noopener noreferrer";card.appendChild(a);}
      ds.appendChild(card);
    });}

  }
  if(document.getElementById("dataset-list")){
    fetch("data/research.json",{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("network");return r.json();}).then(renderData).catch(function(){
      ["dataset-list"].forEach(function(id){var root=document.getElementById(id);if(root){root.replaceChildren(el("p","", "Pregled podataka trenutno nije dostupan. Pokušajte kasnije. Ova greška ne mijenja status istraživanja."));}});
    });
  }
  var mapDiv=document.getElementById("research-map");
  if(mapDiv){
    if(typeof L==="undefined"){mapDiv.textContent="Mapa trenutno nije dostupna. Za učitavanje je potrebna internet veza.";return;}
    mapDiv.replaceChildren();
    var map=L.map(mapDiv,{scrollWheelZoom:false,zoomControl:false}).setView([42.385,19.20],11);
    L.control.zoom({zoomInTitle:"Uvećaj mapu",zoomOutTitle:"Umanji mapu",zoomInText:"+",zoomOutText:"−"}).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> saradnici'
    }).addTo(map);
    L.circleMarker([42.385,19.20],{radius:6,weight:2,color:"#fff",fillColor:"#a4472d",fillOpacity:1}).bindPopup("<strong>Botun — centar istraživanja</strong><br>Približna referentna tačka, ne arheološki lokalitet.").addTo(map);
    var colors={3000:"#a7513b",5000:"#cf923f",10000:"#2d7761"}, layers={};
    function displayRing(feature){
      var radius=feature.properties&&feature.properties.radius_m;
      if(!radius)return;
      var ring=L.geoJSON(feature,{style:{color:colors[radius]||"#2d7761",weight:2,opacity:.85,fillOpacity:.045,dashArray:radius===10000?"8 5":undefined}});
      ring.bindPopup("<strong>Planirani istraživački obuhvat: "+(radius/1000)+" km</strong><br>Nije dokaz potpunog laserskog snimanja.");
      ring.addTo(map);layers[radius]=ring;
    }
    fetch("data/study-area.geojson").then(function(r){if(!r.ok)throw new Error("network");return r.json();}).then(function(geo){
      (geo.features||[]).forEach(function(f){if(f.geometry&&f.geometry.type==="Polygon")displayRing(f);});
      if(layers[10000])map.fitBounds(layers[10000].getBounds(),{padding:[20,20]});
    }).catch(function(){var p=el("p","map-error","Granice istraživanja trenutno nijesu dostupne.");mapDiv.parentNode.insertBefore(p,mapDiv.nextSibling);});
    document.querySelectorAll("[data-ring]").forEach(function(c){c.addEventListener("change",function(){var layer=layers[Number(c.dataset.ring)];if(!layer)return;if(c.checked)map.addLayer(layer);else map.removeLayer(layer);});});
  }
})();
