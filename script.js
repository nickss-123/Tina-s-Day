/* ===================== DATA ===================== */
// Program participants — updated per Revision 3 notes:
//   Roses: #5 is now Mark Dan Gil (Bernard Madriaga removed)
//   Treasures: #6 Sale Udaundo, #7 Mary Ann Solis
//             (Maricel Gagnao removed; Sale & Hershey switched numbers)
//   Treasures (this revision): #6/#7/#8 -> 6:Hershey Santos, 7:Sale Udaundo, 8:Mary Ann Solis
const program = {
  roses: ["Danny Madriaga","Bong Madriaga","Dexter Madriaga","Reymyr Madriaga","Mark Dan Gil","Mark Jhon dela Cruz","Aldrin Castro","Erico Nario","Carlos Vincent Udaundo","Francis Karl Daligdig","Rhovin Cristian Nario","Ruben Nario"],
  candles: ["Myrna Edejer","Remedios Salazar","Lorine Madriaga","Edita Madriaga","Helen Gabata","Ruby Castro","Gina Caballero","Irene Tayo","Susan Nario","Raquel Cruz","Josefina Tibay","Criselda Borebor"],
  treasures: ["Renalyn Kaye Gil","Ailish Rain Helera","Jan Pauline Cruz","Mara Clarisse Tayo","Khamille Merciales","Hershey Santos","Sale Udaundo","Mary Ann Solis","Brett Pantaleon","Sarah Firman","Imelda dela Cruz","Raquel Brazal"],
  shots: ["Alfred Madriaga","Reymond Edejer","Hans Madriaga","Darwin Gerald Udaundo","Warren Daligdig","John Neslie Leano","Simon Enofre","Virgilio Tibay","Merarie Caballero","Tony Tayo","Renan Cruz","Henry Cabrillas"],
  bills: ["Rem Edejer","Paolo Madriaga","Ranel James Rigo","Aaron Castro","Ryan Rasheed Lazo","Jerum Jerusalem","Nikka Ella Udaundo","Noreen Asia Batalla","Mira Inah Caballero","Shane Marie Jalandoni","Gianne Kaye Durante","Veronica Nario"]
};

function renderProgram(){
  Object.keys(program).forEach(key=>{
    const ol = document.getElementById('list-'+key);
    ol.innerHTML = program[key].map((name,i)=>
      `<li><span class="num">${String(i+1).padStart(2,'0')}</span><span>${name}</span></li>`
    ).join('');
  });
}
renderProgram();

/* ===================== TABS ===================== */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
  });
});

/* ===================== COUNTDOWN ===================== */
// Event: August 2, 2026, 8:30 AM (Asia/Manila, UTC+8)
const eventDate = new Date("2026-08-02T08:30:00+08:00").getTime();
function updateCountdown(){
  const now = new Date().getTime();
  const diff = eventDate - now;
  if(diff <= 0){
    document.getElementById('countdown').innerHTML = '<div class="cd-note">It\'s celebration time! &#127881;</div>';
    return;
  }
  const days = Math.floor(diff/(1000*60*60*24));
  const hours = Math.floor((diff/(1000*60*60))%24);
  const mins = Math.floor((diff/(1000*60))%60);
  const secs = Math.floor((diff/1000)%60);
  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===================== COVER OPEN ===================== */
document.getElementById('openInvite').addEventListener('click', ()=>{
  document.getElementById('cover').classList.add('opened');
  // #app-shell is the scroll container now (not window/body), so make
  // sure the guest lands at the very top of the invitation there.
  const shell = document.getElementById('app-shell');
  if (shell) shell.scrollTo({top: 0, left: 0, behavior: 'auto'});
  // Called directly inside this click handler (same tap, no delay) so
  // iOS Safari counts it as coming from a real user gesture and allows
  // audio to start immediately.
  playMusic();
  dismissMusicCallout();
});

/* ===================== BACKGROUND MUSIC ===================== */
// Native <audio> element (see index.html: #bg-music, music/background-song.mp3).
// Drop your own MP3 into a "music" folder next to index.html and name it
// background-song.mp3 — or edit the <source src="..."> in index.html to
// match your filename.
const audio = document.getElementById('bg-music');
let isPlaying = false;

function setMusicIconPlaying(playing){
  const toggle = document.getElementById('music-toggle');
  if(playing){
    toggle.classList.add('is-playing');
  } else {
    toggle.classList.remove('is-playing');
  }
}

function playMusic(){
  if(!audio) return;
  const playPromise = audio.play();
  if(playPromise !== undefined){
    playPromise.then(()=>{
      isPlaying = true;
      setMusicIconPlaying(true);
    }).catch(()=>{
      // Autoplay was blocked for some reason — guest can still start
      // it manually with the music button.
      isPlaying = false;
      setMusicIconPlaying(false);
    });
  }
}

function dismissMusicCallout(){
  const callout = document.getElementById('music-callout');
  if(callout) callout.classList.add('hidden');
}

document.getElementById('music-toggle').addEventListener('click', ()=>{
  dismissMusicCallout();
  if(!audio) return;
  if(isPlaying){
    audio.pause();
    isPlaying = false;
    setMusicIconPlaying(false);
  } else {
    playMusic();
  }
});

// Gently auto-hide the "Click me!" callout after a while so it doesn't
// linger forever for guests who don't need the nudge.
setTimeout(dismissMusicCallout, 12000);

