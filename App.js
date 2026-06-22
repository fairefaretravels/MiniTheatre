let library = [];
let current = 0;
let sessionStart = null;
let timerInterval;

const PIN = "1234";

const lockScreen = document.getElementById("lockScreen");
const home = document.getElementById("home");
const player = document.getElementById("player");
const admin = document.getElementById("admin");

const video = document.getElementById("video");
const title = document.getElementById("title");
const timer = document.getElementById("timer");

/* LOAD CONTENT */
fetch("library.json")
  .then(res => res.json())
  .then(data => {
    library = data;
    buildGrid();
  });

/* UNLOCK */
function unlock() {
  const pin = document.getElementById("pinInput").value;

  if (pin === PIN) {
    lockScreen.classList.add("hidden");
    home.classList.remove("hidden");
  } else {
    alert("Wrong PIN");
  }
}

/* BUILD GRID */
function buildGrid() {
  const grid = document.getElementById("grid");

  library.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = item.title;
    card.onclick = () => openVideo(i);
    grid.appendChild(card);
  });
}

/* OPEN VIDEO */
function openVideo(i) {
  current = i;
  home.classList.add("hidden");
  player.classList.remove("hidden");

  video.src = library[i].src;
  title.innerText = library[i].title;

  video.play();
  startTimer();
}

/* NEXT */
function nextVideo() {
  current = (current + 1) % library.length;
  openVideo(current);
}

/* BACK */
function backHome() {
  player.classList.add("hidden");
  home.classList.remove("hidden");

  video.pause();
  stopTimer();
}

/* TIMER */
function startTimer() {
  sessionStart = Date.now();

  timerInterval = setInterval(() => {
    let diff = Math.floor((Date.now() - sessionStart) / 1000);
    let m = Math.floor(diff / 60);
    let s = diff % 60;

    timer.innerText = `${m}:${s.toString().padStart(2,'0')}`;

    if (diff > 3600) {
      alert("Daily limit reached");
      backHome();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

/* PARENT MODE */
function openParent() {
  admin.classList.remove("hidden");
}

function closeAdmin() {
  admin.classList.add("hidden");
}

function saveSettings() {
  alert("Saved (local build - can extend to storage)");
}

/* autoplay next */
video.addEventListener("ended", nextVideo);
