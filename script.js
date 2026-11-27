const anime = [
 {id:1,title:"Attack on Titan",year:2013,type:"TV",episodes:87,rating:9.1,popularity:99,status:"Completed",genres:["Action","Drama","Fantasy"],symbol:"進",palette:"linear-gradient(145deg,#25384a,#7a4c45 55%,#171525)",description:"Humanity fights for survival behind enormous walls as the truth about the Titans slowly comes to light."},
 {id:2,title:"Demon Slayer",year:2019,type:"TV",episodes:55,rating:8.7,popularity:98,status:"Ongoing",genres:["Action","Fantasy"],symbol:"滅",palette:"linear-gradient(145deg,#1c5860,#b34d55 55%,#171525)",description:"A kind-hearted boy joins the Demon Slayer Corps after a demon attack changes his family forever."},
 {id:3,title:"One Piece",year:1999,type:"TV",episodes:1100,rating:9.0,popularity:100,status:"Ongoing",genres:["Action","Adventure","Comedy"],symbol:"海",palette:"linear-gradient(145deg,#174d72,#d38a46 55%,#241a39)",description:"A young pirate and his crew sail across a vast world in search of the legendary One Piece treasure."},
 {id:4,title:"Jujutsu Kaisen",year:2020,type:"TV",episodes:47,rating:8.6,popularity:97,status:"Ongoing",genres:["Action","Supernatural"],symbol:"呪",palette:"linear-gradient(145deg,#34245f,#9b477c 55%,#10101d)",description:"A student enters the dangerous world of cursed energy after swallowing a powerful cursed object."},
 {id:5,title:"Your Name",year:2016,type:"Movie",episodes:1,rating:8.8,popularity:91,status:"Completed",genres:["Drama","Romance","Supernatural"],symbol:"君",palette:"linear-gradient(145deg,#3c6c9b,#d18a9b 55%,#252047)",description:"Two teenagers mysteriously begin switching bodies and search for the connection between their lives."},
 {id:6,title:"Spy x Family",year:2022,type:"TV",episodes:37,rating:8.5,popularity:94,status:"Ongoing",genres:["Action","Comedy","Slice of Life"],symbol:"家",palette:"linear-gradient(145deg,#315b4c,#b9a36d 55%,#1c2030)",description:"A spy, an assassin and a telepath form an unusual family while each hides their true identity."},
 {id:7,title:"Haikyuu!!",year:2014,type:"TV",episodes:85,rating:8.8,popularity:90,status:"Completed",genres:["Sports","Comedy","Drama"],symbol:"飛",palette:"linear-gradient(145deg,#d07835,#315c7d 55%,#18182c)",description:"A determined volleyball player works to prove that height is no barrier to becoming a great athlete."},
 {id:8,title:"Death Note",year:2006,type:"TV",episodes:37,rating:8.9,popularity:96,status:"Completed",genres:["Mystery","Drama","Supernatural"],symbol:"死",palette:"linear-gradient(145deg,#252536,#9d293f 55%,#0d0d16)",description:"A gifted student discovers a notebook that can kill anyone whose name is written in it."},
 {id:9,title:"Fullmetal Alchemist: Brotherhood",year:2009,type:"TV",episodes:64,rating:9.2,popularity:93,status:"Completed",genres:["Action","Adventure","Fantasy"],symbol:"錬",palette:"linear-gradient(145deg,#7a5437,#a8a09a 55%,#272238)",description:"Two brothers search for the Philosopher's Stone after a forbidden alchemy experiment costs them dearly."},
 {id:10,title:"Steins;Gate",year:2011,type:"TV",episodes:24,rating:9.0,popularity:88,status:"Completed",genres:["Sci-Fi","Drama","Thriller"],symbol:"時",palette:"linear-gradient(145deg,#285a64,#8067a7 55%,#171525)",description:"A group of friends discover a way to send messages to the past, with unexpected consequences."},
 {id:11,title:"My Hero Academia",year:2016,type:"TV",episodes:159,rating:8.2,popularity:89,status:"Completed",genres:["Action","Adventure"],symbol:"力",palette:"linear-gradient(145deg,#3b704f,#3973a5 55%,#18182b)",description:"In a world where superpowers are common, a powerless boy dreams of becoming the greatest hero."},
 {id:12,title:"Violet Evergarden",year:2018,type:"TV",episodes:13,rating:8.7,popularity:82,status:"Completed",genres:["Drama","Slice of Life"],symbol:"花",palette:"linear-gradient(145deg,#526b8d,#c58b9f 55%,#26233d)",description:"A former soldier learns about emotions and the meaning of love while writing letters for others."},
 {id:13,title:"Re:Zero",year:2016,type:"TV",episodes:50,rating:8.1,popularity:86,status:"Ongoing",genres:["Fantasy","Drama","Mystery"],symbol:"零",palette:"linear-gradient(145deg,#59427c,#8b5e89 55%,#171525)",description:"Transported to another world, Subaru discovers that death sends him back to an earlier point in time."},
 {id:14,title:"Frieren: Beyond Journey's End",year:2023,type:"TV",episodes:28,rating:9.3,popularity:95,status:"Completed",genres:["Adventure","Fantasy","Drama"],symbol:"旅",palette:"linear-gradient(145deg,#4d6e77,#9c9c8b 55%,#24243b)",description:"An elven mage reflects on time, friendship and the meaning of life after her heroic journey ends."},
 {id:15,title:"Tokyo Ghoul",year:2014,type:"TV",episodes:48,rating:7.8,popularity:84,status:"Completed",genres:["Horror","Action","Supernatural"],symbol:"喰",palette:"linear-gradient(145deg,#25202f,#a13b4d 55%,#10101b)",description:"A college student is pulled into the hidden world of flesh-eating ghouls after a life-changing encounter."},
 {id:16,title:"Kaguya-sama: Love Is War",year:2019,type:"TV",episodes:37,rating:8.4,popularity:80,status:"Completed",genres:["Romance","Comedy"],symbol:"恋",palette:"linear-gradient(145deg,#9b405c,#51417c 55%,#171525)",description:"Two brilliant student council members try to make the other confess their feelings first."},
 {id:17,title:"Dr. Stone",year:2019,type:"TV",episodes:57,rating:8.1,popularity:79,status:"Ongoing",genres:["Sci-Fi","Adventure","Comedy"],symbol:"石",palette:"linear-gradient(145deg,#477d74,#c18a48 55%,#171525)",description:"After humanity is mysteriously petrified, a science-loving teenager sets out to rebuild civilisation."},
 {id:18,title:"Erased",year:2016,type:"TV",episodes:12,rating:8.5,popularity:77,status:"Completed",genres:["Mystery","Drama","Thriller"],symbol:"戻",palette:"linear-gradient(145deg,#456c83,#a65e63 55%,#171525)",description:"A young man is sent back to his childhood to prevent a series of tragic events."},
 {id:19,title:"Blue Lock",year:2022,type:"TV",episodes:38,rating:8.2,popularity:83,status:"Ongoing",genres:["Sports","Drama"],symbol:"青",palette:"linear-gradient(145deg,#164a80,#684eb1 55%,#10101d)",description:"Strikers compete in an intense training programme designed to create Japan's ultimate forward."},
 {id:20,title:"Made in Abyss",year:2017,type:"TV",episodes:25,rating:8.4,popularity:73,status:"Ongoing",genres:["Adventure","Fantasy","Horror"],symbol:"深",palette:"linear-gradient(145deg,#557d72,#b68b58 55%,#24203b)",description:"A young girl descends into a mysterious chasm filled with strange creatures and ancient secrets."},
 {id:21,title:"The Promised Neverland",year:2019,type:"TV",episodes:23,rating:8.3,popularity:76,status:"Completed",genres:["Horror","Mystery","Thriller"],symbol:"約",palette:"linear-gradient(145deg,#547a52,#b8a56e 55%,#202038)",description:"Children at a seemingly perfect orphanage uncover a terrifying secret about their home."},
 {id:22,title:"Weathering With You",year:2019,type:"Movie",episodes:1,rating:8.2,popularity:75,status:"Completed",genres:["Romance","Fantasy","Drama"],symbol:"天",palette:"linear-gradient(145deg,#3676a1,#d6a26b 55%,#252047)",description:"A runaway teenager meets a girl who seems able to control the weather in a rainy Tokyo."},
 {id:23,title:"Mob Psycho 100",year:2016,type:"TV",episodes:37,rating:8.6,popularity:81,status:"Completed",genres:["Action","Comedy","Supernatural"],symbol:"霊",palette:"linear-gradient(145deg,#7860a5,#4d9b9a 55%,#171525)",description:"A quiet middle-schooler with extraordinary psychic powers tries to live an ordinary life."},
 {id:24,title:"The Apothecary Diaries",year:2023,type:"TV",episodes:48,rating:8.8,popularity:87,status:"Ongoing",genres:["Mystery","Drama"],symbol:"薬",palette:"linear-gradient(145deg,#6c7950,#b77c65 55%,#24203b)",description:"A sharp-minded young apothecary solves mysteries and medical puzzles inside the imperial palace."}
];

const genres=["Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Slice of Life","Sports","Supernatural"];
const genreIcons={"Action":"⚔","Adventure":"⌁","Comedy":"☻","Drama":"◈","Fantasy":"✧","Horror":"☾","Mystery":"⌕","Romance":"♡","Sci-Fi":"⌬","Slice of Life":"☼","Sports":"◎","Supernatural":"✦"};

let activeGenre="All",query="",sortMode="popular",activeDetail=null;
let saved=JSON.parse(localStorage.getItem("aniverse-watchlist")||"[]");
const $=s=>document.querySelector(s);

function saveList(){
 localStorage.setItem("aniverse-watchlist",JSON.stringify(saved));
 $("#list-count").textContent=saved.length;
}

function renderGenres(){
 $("#genre-grid").innerHTML=genres.map(g=>`
 <button class="genre-card ${activeGenre===g?"selected":""}" data-genre="${g}">
 <span class="genre-icon">${genreIcons[g]}</span>
 <strong>${g}</strong>
 <small>${anime.filter(a=>a.genres.includes(g)).length} titles to explore</small>
 </button>`).join("");

 $("#filter-chips").innerHTML=["All",...genres].map(g=>`
 <button class="chip ${activeGenre===g?"active":""}" data-genre="${g}">${g}</button>
 `).join("");
}

function filtered(){
 let list=anime.filter(a=>
 (activeGenre==="All"||a.genres.includes(activeGenre))&&
 (`${a.title} ${a.genres.join(" ")}`.toLowerCase().includes(query))
 );

 if(sortMode==="rating")list.sort((a,b)=>b.rating-a.rating);
 else if(sortMode==="az")list.sort((a,b)=>a.title.localeCompare(b.title));
 else list.sort((a,b)=>b.popularity-a.popularity);

 return list;
}

function card(a){
 return `<article class="anime-card" data-open="${a.id}">
 <div class="poster" style="--poster:${a.palette}" data-symbol="${a.symbol}">
 <span class="poster-top">${a.type} · ${a.year}</span>
 <button class="save-btn ${saved.includes(a.id)?"saved":""}" data-save="${a.id}">
 ${saved.includes(a.id)?"♥":"＋"}
 </button>
 <div>
 <div class="poster-title">${a.title}</div>
 <div class="poster-sub">ANIVERSE COLLECTION</div>
 </div>
 </div>
 <div class="card-info">
 <div class="card-title-row">
 <div class="card-title">${a.title}</div>
 <div class="rating">★ ${a.rating}</div>
 </div>
 <div class="card-meta">${a.year} · ${a.episodes} ${a.type==="Movie"?"movie":"episodes"}</div>
 <div class="tag-list">${a.genres.slice(0,3).map(g=>`<span class="mini-tag">${g}</span>`).join("")}</div>
 </div>
 </article>`;
}

function render(){
 renderGenres();
 let list=filtered();
 $("#anime-grid").innerHTML=list.map(card).join("");
 $("#results-count").textContent=`Showing ${list.length} of ${anime.length} titles`;
 $("#empty-state").hidden=!!list.length;
 renderWatchlist();
}

function renderWatchlist(){
 let list=anime.filter(a=>saved.includes(a.id));
 $("#watch-grid").innerHTML=list.map(card).join("");
 $("#watch-empty").hidden=!!list.length;
 $("#watch-grid").style.display=list.length?"grid":"none";
 $("#list-count").textContent=saved.length;
}

function toggleSave(id){
 saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
 saveList();
 render();
 if(activeDetail===id)openDetail(id);
}

function openDetail(id){
 let a=anime.find(x=>x.id===id);
 if(!a)return;
 activeDetail=id;
 $("#detail-cover").style.setProperty("--poster",a.palette);
 $("#detail-cover").textContent=a.symbol;
 $("#detail-title").textContent=a.title;
 $("#detail-meta").textContent=`${a.year} · ${a.type} · ${a.episodes} ${a.type==="Movie"?"movie":"episodes"} · ★ ${a.rating} · ${a.status}`;
 $("#detail-description").textContent=a.description;
 $("#detail-genres").innerHTML=a.genres.map(g=>`<span class="mini-tag">${g}</span>`).join("");
 let b=$("#detail-save");
 b.textContent=saved.includes(id)?"♥ Saved to your list":"＋ Add to watchlist";
 b.disabled=saved.includes(id);
 $("#modal").hidden=false;
}

document.addEventListener("click",e=>{
 let g=e.target.closest("[data-genre]");
 if(g){
  activeGenre=g.dataset.genre;
  render();
  if(g.classList.contains("genre-card"))$("#explore").scrollIntoView({behavior:"smooth"});
 }

 let s=e.target.closest("[data-save]");
 if(s){
  e.stopPropagation();
  toggleSave(Number(s.dataset.save));
 }

 let c=e.target.closest("[data-open]");
 if(c)openDetail(Number(c.dataset.open));
});

$("#search").addEventListener("input",e=>{
 query=e.target.value.toLowerCase().trim();
 render();
});

$("#sort").addEventListener("change",e=>{
 sortMode=e.target.value;
 render();
});

const clearFilters = $("#clear-filters");

if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    activeGenre = "All";
    query = "";
    $("#search").value = "";
    sortMode = "popular";
    $("#sort").value = "default";
    render();
  });
}

$("#modal-close").addEventListener("click",()=>$("#modal").hidden=true);

$("#modal").addEventListener("click",e=>{
 if(e.target.id==="modal")$("#modal").hidden=true;
});

$("#detail-save").addEventListener("click",()=>{
 if(activeDetail!==null)toggleSave(activeDetail);
});

$("#mobile-menu").addEventListener("click",()=>{
 $(".main-nav").classList.toggle("open");
});

$(".main-nav").addEventListener("click",()=>{
 $(".main-nav").classList.remove("open");
});

document.addEventListener("keydown",e=>{
 if(e.key==="Escape")$("#modal").hidden=true;
});

saveList();
render();
  
