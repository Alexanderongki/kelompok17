const fc=v=>(v*100).toFixed(2);
const $=s=>document.querySelector(s),H=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* Wilayah Desa Sidodadi, Kec. Teluk Pandan (Selatan, Barat, Utara, Timur) */
const SIDODADI=L.latLngBounds([-5.565233,105.215371],[-5.539337,105.261708]);

const map=L.map('map',{zoomControl:false,attributionControl:false,maxZoom:22,zoomSnap:.25});
map.fitBounds(SIDODADI);                       // langsung terzoom ke Sidodadi saat dibuka
const bases={grid:null,sat:L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:22,maxNativeZoom:18,zIndex:1})};
let cur=null,pts=DATA_SIDODADI.map(p=>({...p}));
const gG=L.layerGroup().addTo(map),gI=L.layerGroup().addTo(map);

$('#base').onchange=e=>{if(cur)map.removeLayer(cur);cur=bases[e.target.value];if(cur)cur.addTo(map)};
$('#zi').onclick=()=>map.zoomIn();$('#zo').onclick=()=>map.zoomOut();$('#zf').onclick=fit;
map.on('mousemove',e=>$('#cur').textContent=`Lat ${e.latlng.lat.toFixed(6)} · Lon ${e.latlng.lng.toFixed(6)} · Z ${map.getZoom()}`);
function fit(){map.invalidateSize();map.fitBounds(SIDODADI)}
function lim(){return .0003*(+$('#scale').value)}

function draw(){gG.clearLayers();gI.clearLayers();const L1=lim();
pts.forEach(p=>{const m=L.circleMarker([p.lat,p.lon],{radius:8,weight:3,color:p.t=='ICP'&&p.e>L1?'#ff5d6c':'#fff',fillColor:p.t=='GCP'?'#fbbf24':'#4ade80',fillOpacity:.95});
m.bindTooltip(p.id,{permanent:$('#tL').checked,direction:'top',offset:[0,-8]});m.on('click',ev=>{L.DomEvent.stopPropagation(ev);show(p)});m.addTo(p.t=='GCP'?gG:gI)});
const set=pts.filter(p=>p.t=='ICP'),n=set.length,f=v=>v.toFixed(3);
$('#sG').textContent=pts.length-n;$('#sI').textContent=n;
if(n){const r=Math.sqrt(set.reduce((a,p)=>a+p.e*p.e,0)/n),hx=set.every(p=>p.dx!==null),rx=hx?Math.sqrt(set.reduce((a,p)=>a+p.dx*p.dx,0)/n):null,ry=hx?Math.sqrt(set.reduce((a,p)=>a+p.dy*p.dy,0)/n):null,ce=1.5175*r;
$('#sX').textContent=hx?fc(rx):'–';$('#sY').textContent=hx?fc(ry):'–';$('#sR').textContent=fc(r);$('#sC').textContent=fc(ce);
const k=ce<=L1?1:ce<=1.5*L1?2:ce<=2*L1?3:0;$('#sK').textContent=k?'K'+k:'GAGAL';$('#sK').style.color=k?'':'var(--bad)';
const mx=Math.max(...set.map(p=>p.e));$('#bars').innerHTML=set.map(p=>`<div class="bar"><span style="width:52px">${H(p.id)}</span><i class="${p.e>L1?'no':''}" style="width:${p.e/mx*100}px"></i>${(p.e*100).toFixed(2)} cm</div>`).join('')+`<div class="hint">toleransi K1 = ${f(L1)} m</div>`}
else{['sX','sY','sR','sC','sK'].forEach(i=>$('#'+i).textContent='–');$('#bars').textContent='–'}
gG.eachLayer(l=>l.bringToFront());gI.eachLayer(l=>l.bringToFront());verdict()}

function verdict(){const s=pts.filter(p=>p.t=='ICP'),b=$('#verdict');
if(!s.length){b.className='verdict';b.innerHTML='Data titik pemeriksaan tidak tersedia.';return}
const r=Math.sqrt(s.reduce((a,p)=>a+p.e*p.e,0)/s.length),ce=1.5175*r,L1=lim(),k=ce<=L1?1:ce<=1.5*L1?2:ce<=2*L1?3:0,cm=(ce*100).toFixed(1);
b.className='verdict '+(k?'good':'bad');
b.innerHTML=k?`✅ <b>Peta memenuhi standar ketelitian Kelas ${k}.</b> Sekitar 90% titik uji meleset tidak lebih dari <b>${cm} cm</b> dari posisi aslinya di lapangan.`:`⚠️ <b>Peta belum memenuhi standar ketelitian.</b> Sekitar 90% titik uji meleset hingga <b>${cm} cm</b>, melebihi batas yang diizinkan untuk skala ini.`}

function show(p){const L1=lim(),c=(p.e*100).toFixed(1),q=p.e<=L1/2?['good','Sangat akurat']:p.e<=L1?['ok2','Akurat (memenuhi batas)']:['bad','Melebihi batas'];
$('#ib').innerHTML=`<h3>${H(p.id)} <span class="tag">${p.t=='GCP'?'Titik Kontrol':'Titik Uji'}</span></h3>
<div class="big ${q[0]}">${c} cm<small>selisih posisi di peta vs lapangan</small></div><div class="pill ${q[0]}">${q[1]}</div>
<table><tr><td>Bujur (Lon)</td><td>${p.lon.toFixed(7)}°</td></tr><tr><td>Lintang (Lat)</td><td>${p.lat.toFixed(7)}°</td></tr>
<tr><td>Geser Timur–Barat</td><td>${p.dx===null?'–':(p.dx*100).toFixed(1)+' cm'}</td></tr><tr><td>Geser Utara–Selatan</td><td>${p.dy===null?'–':(p.dy*100).toFixed(1)+' cm'}</td></tr>
<tr><td>Batas Kelas 1</td><td>${(L1*100).toFixed(1)} cm</td></tr></table>`;$('#info').style.display='block'}
function showAttr(f){const r=Object.entries(f.properties||{}).map(([k,v])=>`<tr><td>${H(k)}</td><td>${H(String(v))}</td></tr>`).join('');$('#ib').innerHTML=`<h3>Atribut</h3><table>${r||'<tr><td>(kosong)</td></tr>'}</table>`;$('#info').style.display='block'}
$('#x').onclick=()=>$('#info').style.display='none';
map.on('click',()=>{});
$('#scale').onchange=draw;$('#tL').onchange=draw;
$('#tG').onchange=e=>e.target.checked?gG.addTo(map):map.removeLayer(gG);
$('#tI').onchange=e=>e.target.checked?gI.addTo(map):map.removeLayer(gI);
$('#base').value='sat';$('#base').onchange({target:$('#base')});

/* ===== Ortofoto: tile XYZ dari folder ortho/ (tanpa upload) ===== */
const orthoL=L.tileLayer(`ortho/{z}/{x}/{y}.${ORTHO.format}`,{minZoom:ORTHO.minZoom,maxZoom:22,maxNativeZoom:ORTHO.maxZoom,zIndex:5,opacity:1,
errorTileUrl:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}).addTo(map);
let tOk=0,tErr=0;const om=$('#orthoMsg');
const orthoStat=()=>{om.textContent=tOk?`✔ Ortofoto dimuat dari folder ortho/ (zoom ${ORTHO.minZoom}–${ORTHO.maxZoom}).`:(tErr>=3?'Belum ada tile ortofoto di folder ortho/ (lihat ortho/BACA-SAYA.txt).':'Memeriksa folder ortho/ …')};
orthoL.on('tileload',()=>{tOk++;orthoStat()});orthoL.on('tileerror',()=>{tErr++;orthoStat()});
$('#orthoOp').oninput=e=>orthoL.setOpacity(e.target.value/100);
$('#tO').onchange=e=>e.target.checked?orthoL.addTo(map):map.removeLayer(orthoL);

/* ===== Tutupan lahan (data/tutupan.js): tampil/sembunyi + transparansi per layer ===== */
var lcG=L.layerGroup().addTo(map),lcL={};
const lcSet=(d,v)=>lcL[d.id].setStyle(d.tipe=='line'?{opacity:v}:{opacity:Math.min(1,v+.15),fillOpacity:v*.9});
TUTUPAN.forEach(d=>{const ln=d.tipe=='line',v0=ln?1:.55;
const l=L.geoJSON(d.geojson,{style:()=>ln?{color:d.warna,weight:2.5,opacity:1}:{color:d.warna,weight:1,fillColor:d.warna,fillOpacity:v0*.9,opacity:v0+.15},
onEachFeature:(f,y)=>y.on('click',ev=>{L.DomEvent.stopPropagation(ev);showAttr({properties:{Kelas:d.nama,...f.properties}})})}).addTo(lcG);lcL[d.id]=l;
const r=document.createElement('div');r.className='lcr';
r.innerHTML=`<label class="chk"><input type="checkbox" checked><span class="dot" style="background:${d.warna};${d.warna=='#ffffff'?'border:1px solid #888':''}"></span>${d.nama}<small>${d.info}</small></label><input type="range" min="0" max="100" value="${v0*100}" title="Transparansi ${d.nama}">`;
r.querySelector('input[type=checkbox]').onchange=e=>e.target.checked?lcG.addLayer(l):lcG.removeLayer(l);
r.querySelector('input[type=range]').oninput=e=>lcSet(d,e.target.value/100);$('#lcList').appendChild(r)});
$('#lcOp').oninput=e=>{document.querySelectorAll('#lcList input[type=range]').forEach(s=>s.value=e.target.value);TUTUPAN.forEach(d=>lcSet(d,e.target.value/100))};

draw();
window.addEventListener('load',()=>{map.invalidateSize();map.fitBounds(SIDODADI)});
