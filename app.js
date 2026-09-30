const DATA="data/";
const COLORS={Red:{c:"#d71f2a",d:"#9f141c",fg:"#fff"},Green:{c:"#149a5b",d:"#0c6b3d",fg:"#fff"},Blue:{c:"#1a7fc2",d:"#10578a",fg:"#fff"},Purple:{c:"#82338f",d:"#5a2064",fg:"#fff"},Black:{c:"#232325",d:"#0d0d0e",fg:"#fff"},Yellow:{c:"#f3cf13",d:"#c29f00",fg:"#1a1a1a"}};
const col=n=>COLORS[n]||{c:"#555",d:"#333",fg:"#fff"};
const ls={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cache=ls.get("cache",null),byId={};
const $=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};

async function getJSON(url){
const r=await fetch(url,{cache:"no-cache"});
if(!r.ok)throw new Error(url+" (HTTP "+r.status+")");
return r.json()}

function index(){byId={};(cache?cache.cards:[]).forEach(c=>{if(!byId[c.id])byId[c.id]=c})}
function say(t){$("status").textContent=t}
function stamp(){return cache?cache.cards.length+" cards · updated "+new Date(cache.at).toLocaleString():"No card data yet"}

async function sync(force){
try{
say("Checking for updates…");
const meta=await getJSON(DATA+"meta.json");
if(!force&&cache&&cache.gen===meta.generated_at){say("Up to date · "+stamp());return}
say("Downloading cards…");
const cards=await getJSON(DATA+"cards.json");
if(!Array.isArray(cards)||!cards.length)throw new Error("cards.json is empty");
cache={gen:meta.generated_at,at:Date.now(),cards};ls.set("cache",cache);index();
say("Updated · "+stamp());
}catch(e){say(cache?"Offline, using saved data · "+stamp():"Could not load card data: "+e.message)}
index();search()}

function strip(c,fn){
const d=el("div","strip"),cs=c.colors.length?c.colors:["Black"];
const a=col(cs[0]),b=col(cs[1]||cs[0]),lt=a.fg==="#fff";
d.style.setProperty("--c1",a.c);d.style.setProperty("--c2",b.c);d.style.setProperty("--cd",a.d);d.style.setProperty("--fg",a.fg);
d.style.setProperty("--ts",lt?"0 1px 2px rgba(0,0,0,.6)":"none");d.style.setProperty("--pill",lt?"rgba(0,0,0,.4)":"rgba(0,0,0,.12)");
d.append(el("div","cost",c.type==="Leader"?"–":(c.cost??"–")));
const n=el("div","name",c.name);n.append(el("span","idtag",c.id));d.append(n);
if(c.type==="Character"||c.type==="Leader"){
if(c.type==="Leader")d.append(el("div","tag","LIFE "+c.cost));
if(c.counter)d.append(el("div","counter","+"+c.counter));
d.append(el("div","power",c.power??""));
}else d.append(el("div","tag",(c.type||"").toUpperCase()));
d.onclick=fn;return d}

function search(){
const q=$("q").value.trim().toLowerCase(),box=$("results");box.innerHTML="";
if(!q||!cache)return;
(cache.cards.filter(c=>c.name.toLowerCase().includes(q)||c.id.toLowerCase().includes(q)).slice(0,40)).forEach(c=>box.append(strip(c,()=>{hand.push(c);saveHand()})))}

$("q").oninput=search;
$("upd").onclick=()=>sync(true);

const OV=location.hash==="#overlay";
let hand=ls.get("hand",[]),opts=Object.assign({ids:true,stats:true,bg:"transparent",w:340},ls.get("opts",{}));
const bc=window.BroadcastChannel?new BroadcastChannel("ophand"):null;
function saveHand(){ls.set("hand",hand);ls.set("opts",opts);if(bc)bc.postMessage({hand,opts});drawHand()}
if(bc)bc.onmessage=e=>{hand=e.data.hand;opts=e.data.opts;drawHand()};
addEventListener("storage",()=>{if(OV){hand=ls.get("hand",[]);opts=Object.assign(opts,ls.get("opts",{}));drawHand()}});
function drawHand(){
const box=$("hand");box.innerHTML="";
box.className="hand"+(opts.ids?"":" noid")+(opts.stats?"":" nostats")+(!OV?" checker":"");
box.style.setProperty("--w",opts.w+"px");
hand.forEach((c,i)=>box.append(strip(c,OV?null:()=>{hand.splice(i,1);saveHand()})));
$("hcount").textContent=hand.length+" cards";
if(OV)document.body.style.background=opts.bg;
if(!OV){$("oid").checked=opts.ids;$("ost").checked=opts.stats;$("ow").value=opts.w;$("obg").value=opts.bg}}
$("oid").onchange=()=>{opts.ids=$("oid").checked;saveHand()};
$("ost").onchange=()=>{opts.stats=$("ost").checked;saveHand()};
$("ow").onchange=()=>{opts.w=Math.min(700,Math.max(200,+$("ow").value||340));saveHand()};
$("obg").onchange=()=>{opts.bg=$("obg").value;saveHand()};
$("clr").onclick=()=>{hand=[];saveHand()};
$("win").onclick=()=>window.open(location.href.split("#")[0]+"#overlay","ophand","width="+(opts.w+40)+",height=520");
$("png").onclick=()=>{
if(!hand.length)return;
const S=2,W=opts.w,H=36,G=6,F="system-ui,-apple-system,Segoe UI,sans-serif";
const cv=document.createElement("canvas");cv.width=W*S;cv.height=(hand.length*(H+G)-G)*S;
const x=cv.getContext("2d");x.scale(S,S);x.textBaseline="middle";
hand.forEach((c,i)=>{
const y=i*(H+G),m=y+H/2+1,cs=c.colors.length?c.colors:["Black"];
x.shadowBlur=0;
const g=x.createLinearGradient(0,0,W,0);const a=col(cs[0]);g.addColorStop(0,a.c);g.addColorStop(1,col(cs[1]||cs[0]).c);
x.beginPath();x.roundRect(1,y+1,W-2,H-2,9);x.fillStyle=g;x.fill();x.lineWidth=2;x.strokeStyle="rgba(255,255,255,.45)";x.stroke();
x.beginPath();x.arc(20,y+H/2,11,0,7);x.fillStyle=a.d;x.fill();x.lineWidth=2;x.strokeStyle=a.fg;x.stroke();
x.fillStyle=a.fg;x.textAlign="center";x.font="800 14px "+F;x.fillText(c.type==="Leader"?"\u2013":(c.cost??"\u2013"),20,m);
x.fillStyle=a.fg;x.shadowColor="rgba(0,0,0,.6)";x.shadowBlur=a.fg==="#fff"?2:0;
let rx=W-10;x.textAlign="right";
if(opts.stats){
if(c.type==="Character"||c.type==="Leader"){x.font="800 15px "+F;x.fillText(c.power??"",rx,m);rx-=54;
if(c.type==="Leader"){x.font="800 10px "+F;x.fillText("LIFE "+c.cost,rx,m);rx-=56}
if(c.counter){x.font="800 11px "+F;x.fillText("+"+c.counter,rx,m);rx-=46}}
else{x.font="800 10px "+F;x.fillText((c.type||"").toUpperCase(),rx,m);rx-=64}}
x.textAlign="left";x.font="700 15px "+F;
let t=c.name;const max=rx-44;while(x.measureText(t).width>max&&t.length>1)t=t.slice(0,-1);if(t!==c.name)t=t.trimEnd()+"\u2026";
x.fillText(t,38,m);
if(opts.ids){const w=x.measureText(t).width;x.font="700 10px "+F;if(38+w+8+x.measureText(c.id).width<rx)x.fillText(c.id,46+w,m)}
});
cv.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="hand.png";a.click()})};
if(OV){document.body.classList.add("ov");drawHand()}else{index();drawHand();sync(false)}
(()=>{const h=location.hostname,a=document.getElementById("src");
if(a&&h.endsWith(".github.io")){const r=location.pathname.split("/")[1];a.href="https://github.com/"+h.split(".")[0]+(r?"/"+r:"")}})();
