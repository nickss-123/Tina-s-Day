/* ===================== DATA ===================== */
// Program participants — updated per Revision 3 notes:
//   Roses: #5 is now Mark Dan Gil (Bernard Madriaga removed)
//   Treasures: #6 Sale Udaundo, #7 Mary Ann Solis
//             (Maricel Gagnao removed; Sale & Hershey switched numbers)
const program = {
  roses: ["Danny Madriaga","Bong Madriaga","Dexter Madriaga","Reymyr Madriaga","Mark Dan Gil","Mark Jhon dela Cruz","Aldrin Castro","Erico Nario","Carlos Vincent Udaundo","Francis Karl Daligdig","Rhovin Cristian Nario","Ruben Nario"],
  candles: ["Myrna Edejer","Remedios Salazar","Lorine Madriaga","Edita Madriaga","Helen Gabata","Ruby Castro","Gina Caballero","Irene Tayo","Susan Nario","Raquel Cruz","Josefina Tibay","Criselda Borebor"],
  treasures: ["Renalyn Kaye Gil","Ailish Rain Helera","Jan Pauline Cruz","Mara Clarisse Tayo","Khamille Merciales","Sale Udaundo","Mary Ann Solis","Hershey Santos","Brett Pantaleon","Sarah Firman","Imelda dela Cruz","Raquel Brazal"],
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
let wantsMusic = false; // set true the moment the guest opens the invite (a real user gesture)
document.getElementById('openInvite').addEventListener('click', ()=>{
  document.getElementById('cover').classList.add('opened');
  wantsMusic = true;
  playMusic(); // will actually start once the YouTube player finishes loading (see onReady below)
});

/* ===================== BACKGROUND MUSIC ===================== */
// "You'll be in my heart - Niki" — https://www.youtube.com/watch?v=r27t3H36jmU
let player, musicReady = false, isPlaying = false;
function onYouTubeIframeAPIReady(){
  player = new YT.Player('yt-audio', {
    height:'0', width:'0', videoId:'r27t3H36jmU',
    playerVars:{autoplay:0, loop:1, playlist:'r27t3H36jmU', controls:0, playsinline:1},
    events:{
      'onReady': ()=>{
        musicReady = true;
        // If the guest already tapped to open the invite before the player finished
        // loading, start the music now instead of silently failing.
        if(wantsMusic){ playMusic(); }
      }
    }
  });
}
function setMusicIconPlaying(playing){
  const iconPath = document.querySelector('#music-icon path');
  const toggle = document.getElementById('music-toggle');
  if(playing){
    toggle.classList.add('is-playing');
  } else {
    toggle.classList.remove('is-playing');
  }
}
function playMusic(){
  if(musicReady && player && player.playVideo){
    player.playVideo();
    isPlaying = true;
    setMusicIconPlaying(true);
  }
}
function dismissMusicCallout(){
  const callout = document.getElementById('music-callout');
  if(callout) callout.classList.add('hidden');
}
document.getElementById('music-toggle').addEventListener('click', ()=>{
  wantsMusic = true;
  dismissMusicCallout();
  if(!musicReady) return;
  if(isPlaying){
    player.pauseVideo();
    setMusicIconPlaying(false);
  } else {
    player.playVideo();
    setMusicIconPlaying(true);
  }
  isPlaying = !isPlaying;
});
// Also dismiss the callout once the guest opens the invitation, since
// music will already be attempting to play at that point.
document.getElementById('openInvite').addEventListener('click', dismissMusicCallout);

// Gently auto-hide the "Click me!" callout after a while so it doesn't
// linger forever for guests who don't need the nudge.
setTimeout(dismissMusicCallout, 12000);
