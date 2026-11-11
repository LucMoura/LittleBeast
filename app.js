const $ = (id) => document.getElementById(id);
const defaults = {day:1,hunger:78,energy:86,happiness:72,affinity:10,lastTick:Date.now(),lastVisit:Date.now(),sleeping:false};
let state = {...defaults,...JSON.parse(localStorage.getItem("little-beast-save")||"{}")};
let pose = "idle";
const lines = {
  feed:["NOM NOM NOM! Isso é meu!","*engole sem mastigar*","Você sabe como me conquistar... comida!"],
  play:["HAHA! TENTE ME PEGAR!","*sai correndo em círculos*","MAIS! MAIS! MAIS!"],
  pet:["Hmph... pode continuar.","*fecha os olhos e ronrona baixinho*","Não conta pra ninguém que eu gosto disso."],
  talk:["Grrr? Estou ouvindo. Talvez.","Hoje eu pensei em dominar a cozinha.","Você tem cara de quem trouxe lanche."],
  sleep:["*se enrola e começa a roncar*","Cinco minutinhos... zZz","Se tiver comida, me acorda."]
};
function save(){state.lastVisit=Date.now();localStorage.setItem("little-beast-save",JSON.stringify(state))}
function clamp(v){return Math.max(0,Math.min(100,Math.round(v)))}
function mood(){if(state.sleeping)return "Sonolento";if(state.hunger<20)return "Faminto";if(state.energy<20)return "Exausto";if(state.happiness>80)return "Elétrico";if(state.happiness<30)return "Emburrado";return "Travesso"}
function say(text){$("dialogue").textContent="“"+text+"”";$("room-caption").textContent=text;$("mood-bubble").textContent=state.sleeping?"Z z z":(state.happiness>75?"Hehehe!":"Grr!")}

function drawPet(){
 const c=$("pet"),x=c.getContext("2d");x.clearRect(0,0,96,96);
 const px=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
 const dark="#321b16",brown="#713b27",mid="#96512f",light="#c47a43",cream="#e8b77b",yellow="#f5d36f";
 // ears, feet, body and shaggy silhouette
 px(15,25,15,18,dark);px(17,22,11,18,brown);px(66,22,15,20,dark);px(68,25,11,15,brown);
 px(19,65,20,13,dark);px(22,67,15,9,mid);px(58,65,20,13,dark);px(61,67,15,9,mid);
 [[27,18,42,55],[20,26,56,42],[16,38,64,28],[24,15,12,16],[40,10,12,12],[58,14,13,15],[70,32,10,18],[12,49,12,13]].forEach(([a,b,w,h])=>px(a,b,w,h,brown));
 px(25,24,46,38,mid);px(28,54,40,13,cream);px(35,60,27,7,cream);
 // brow tufts
 px(24,19,13,8,dark);px(36,13,10,9,dark);px(55,18,15,8,dark);
 // eyes and brows
 px(28,31,16,12,yellow);px(53,31,16,12,yellow);px(34,33,5,9,dark);px(58,33,5,9,dark);
 px(26,28,19,4,dark);px(52,28,19,4,dark);
 // muzzle and nose
 px(37,43,23,14,cream);px(41,41,17,8,light);px(42,41,14,6,dark);
 // mouth, teeth, tongue
 px(39,51,20,10,dark);px(40,51,5,5,"#fff0d4");px(54,51,5,5,"#fff0d4");
 if(pose==="happy"){px(44,58,12,5,"#c64f54")} else if(pose==="angry"){px(43,58,13,3,dark)}
 // little arms
 px(11,49,10,15,dark);px(14,51,9,12,mid);px(75,49,10,15,dark);px(73,51,9,12,mid);
 if(state.sleeping){px(24,23,17,4,dark);px(53,23,17,4,dark)}
}
function render(){
 ["hunger","energy","happiness","affinity"].forEach(k=>{$(k).style.width=state[k]+"%";$(k+"-value").textContent=state[k]+"%"});
 $("mood").textContent=mood();$("day-label").textContent="Dia "+state.day;
 $("clock").textContent=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
 $("sky").style.background=new Date().getHours()>=18||new Date().getHours()<6?"linear-gradient(#171b39,#55405e)":"linear-gradient(#5d83a1,#e5aa76)";
 $("sky").querySelector(".celestial").style.background=new Date().getHours()>=18||new Date().getHours()<6?"#f4d18a":"#f6d36e";
 drawPet();
}
function tick(){
 const now=Date.now(),elapsed=Math.min(3600*6,Math.max(0,now-state.lastTick)),units=elapsed/60000;
 if(units>0){state.hunger=clamp(state.hunger-units*.35);state.energy=clamp(state.energy+(state.sleeping?units*.9:-units*.16));state.happiness=clamp(state.happiness-units*.12);state.lastTick=now;}
 render();save();
}
function act(a){
 if(state.sleeping&&a!=="sleep"){state.sleeping=false;say("EI! Eu estava dormindo!");}
 if(a==="feed"){state.hunger=clamp(state.hunger+24);state.happiness=clamp(state.happiness+5);pose="happy";}
 if(a==="play"){if(state.energy<15){say("Sem energia! Preciso dormir.");return;}state.energy=clamp(state.energy-16);state.happiness=clamp(state.happiness+20);state.hunger=clamp(state.hunger-7);state.affinity=clamp(state.affinity+2);pose="happy";}
 if(a==="pet"){state.happiness=clamp(state.happiness+10);state.affinity=clamp(state.affinity+4);pose="happy";}
 if(a==="talk"){state.affinity=clamp(state.affinity+3);state.happiness=clamp(state.happiness+3);pose="idle";}
 if(a==="sleep"){state.sleeping=!state.sleeping;pose="idle";}
 const arr=lines[a];say(arr[Math.floor(Math.random()*arr.length)]);render();save();
}
document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>act(b.dataset.action)));
const away=Math.max(0,Date.now()-(state.lastVisit||Date.now()));
if(away>8*3600000){state.hunger=clamp(state.hunger-Math.min(35,away/3600000*2));state.happiness=clamp(state.happiness-10);say("Até que enfim! Achei que tinha sido abandonado!");}
state.lastTick=Date.now();render();save();setInterval(tick,30000);
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
