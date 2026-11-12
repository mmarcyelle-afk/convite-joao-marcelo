// ========= CONFIGURAÇÃO =========
// Cole aqui a URL do seu Google Apps Script Web App (veja README.md)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRsuMi1WLzexuDWg1Ia_tMnzlatwbzPRGXfHCleDimgKaP5qwB-Mi7jL_u3FIjFOP3/exec";

const EVENT_DATE = new Date("2026-12-21T19:00:00-03:00");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ========= VÍDEO DE ABERTURA =========
const introVideo = document.getElementById("introVideo");
const introVid = document.getElementById("introVid");
const introFade = document.getElementById("introFade");
const skipIntro = document.getElementById("skipIntro");

let introEnded = false;
let introFading = false;
const INTRO_FADE_MS = 1100;

function finishIntro() {
  if (introEnded) return;
  introEnded = true;
  introVideo.classList.add("hide");
  introVid.pause();
  introVideo.remove();
}

// Em vez de cortar seco, a fumaça azul da carta vai tomando a tela toda
// até virar o mesmo azul da capa do site — a transição fica contínua.
function endIntro() {
  if (introFading || introEnded) return;
  introFading = true;
  introVid.pause(); // trava o quadro da fumaça aqui, pra não "vazar" a cena seguinte
  introFade.classList.add("show");
  setTimeout(finishIntro, INTRO_FADE_MS);
}

function skipIntroNow() {
  // Pular vai direto, sem precisar esperar o fade.
  if (introFading || introEnded) return;
  finishIntro();
}

// Mostra só a parte em que ele abre a carta, deixando a fumaça se espalhar
// mais antes de cortar, e em câmera um pouco mais lenta pra não ficar brusco.
introVid.playbackRate = 0.65;
const INTRO_CUT_TIME = 4.3;
introVid.addEventListener("timeupdate", () => {
  if (introVid.currentTime >= INTRO_CUT_TIME) {
    endIntro();
  }
});
introVid.addEventListener("ended", endIntro);
skipIntro.addEventListener("click", skipIntroNow);

// ========= MÚSICA DE FUNDO (toca desde o início, contínua) =========
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
bgMusic.volume = 0.5;
const MUSIC_SILENCE_OFFSET = 1.8; // pula o trechinho mudo do início do MP3

// Função única e segura pra iniciar a música (evita chamadas duplicadas
// conflitando entre si, que causavam o "liga e já pausa" no celular).
let musicStarting = false;
function startMusic() {
  if (musicStarting || !bgMusic.paused) return;
  musicStarting = true;
  if (bgMusic.currentTime < MUSIC_SILENCE_OFFSET) {
    bgMusic.currentTime = MUSIC_SILENCE_OFFSET;
  }
  bgMusic
    .play()
    .then(() => {
      musicToggle.textContent = "🔊";
    })
    .catch(() => {})
    .finally(() => {
      musicStarting = false;
    });
}

// Tenta tocar sozinho assim que possível
function tryAutoplay() {
  startMusic();
}
if (bgMusic.readyState >= 3) {
  tryAutoplay();
} else {
  bgMusic.addEventListener("canplay", tryAutoplay, { once: true });
}

// Autoplay com som é bloqueado pelo navegador até a pessoa tocar na tela.
// Um único gatilho ("click") cobre tanto toque no celular quanto clique no
// computador, sem duplicar com "touchstart" (que causava o conflito).
document.addEventListener("click", startMusic, { once: true });
document.addEventListener("keydown", startMusic, { once: true });

bgMusic.addEventListener("ended", () => {
  bgMusic.currentTime = MUSIC_SILENCE_OFFSET;
  bgMusic.play().catch(() => {});
});

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    startMusic();
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  }
});

// Pausa a música quando a pessoa sai da aba/site (troca de app, minimiza,
// ou clica num link que abre o WhatsApp/Maps em outra aba) e retoma se voltar.
let musicWasPlayingBeforeHide = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    musicWasPlayingBeforeHide = !bgMusic.paused;
    bgMusic.pause();
  } else if (musicWasPlayingBeforeHide) {
    bgMusic.play().catch(() => {});
  }
});

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.addEventListener("click", () => {
    bgMusic.pause();
    musicToggle.textContent = "🔇";
  });
});

// ========= ABRIR CONVITE =========
const openBtn = document.getElementById("openBtn");
const mainContent = document.getElementById("mainContent");
const capa = document.getElementById("capa");

openBtn.addEventListener("click", () => {
  mainContent.classList.add("shown");
  openBtn.disabled = true;
  if (!prefersReducedMotion) {
    launchConfetti(40);
  }
  setTimeout(() => {
    document.getElementById("quando").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, 150);
});

// ========= CONTAGEM REGRESSIVA =========
function updateCountdown() {
  const now = new Date();
  let diff = EVENT_DATE - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("cd-days").textContent = pad(days);
  document.getElementById("cd-hours").textContent = pad(hours);
  document.getElementById("cd-min").textContent = pad(mins);
  document.getElementById("cd-sec").textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ========= SCROLL REVEAL =========
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => io.observe(el));

// ========= BARRA DE PROGRESSO / CARRINHO LATERAL =========
const trackCar = document.getElementById("trackCar");
function updateTrackCar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? scrollTop / docHeight : 0;
  const viewportH = window.innerHeight;
  trackCar.style.top = `${pct * (viewportH - 40) + 20}px`;
}
window.addEventListener("scroll", updateTrackCar, { passive: true });
updateTrackCar();

// ========= FORMULÁRIO RSVP =========
const rsvpForm = document.getElementById("rsvpForm");
const addAcompBtn = document.getElementById("addAcomp");
const acompanhantesList = document.getElementById("acompanhantes");
const declineBtn = document.getElementById("declineBtn");
const thanksMsg = document.getElementById("thanksMsg");
const thanksText = document.getElementById("thanksText");
const confirmBtn = document.getElementById("confirmBtn");

let isSubmitting = false;

addAcompBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "acompanhante";
  input.placeholder = "Nome do acompanhante";
  input.className = "acomp-input";
  acompanhantesList.appendChild(input);
  input.focus();
});

async function sendRSVP(status) {
  if (isSubmitting) return;

  const nome = document.getElementById("nome").value.trim();
  if (status === "Confirmado" && !nome) {
    document.getElementById("nome").focus();
    return;
  }
  // Para "não poderei ir" também pedimos nome, se vazio não bloqueia mas pedimos
  if (!nome) {
    document.getElementById("nome").focus();
    return;
  }

  const acompanhantes = Array.from(document.querySelectorAll('input[name="acompanhante"]'))
    .map((i) => i.value.trim())
    .filter(Boolean);

  isSubmitting = true;
  confirmBtn.disabled = true;
  declineBtn.disabled = true;
  confirmBtn.textContent = "Enviando...";

  const payload = {
    nome,
    acompanhantes: acompanhantes.join(", "),
    total: 1 + acompanhantes.length,
    status,
  };

  try {
    if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("COLE_AQUI")) {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
    } else {
      console.warn("GOOGLE_SCRIPT_URL não configurada ainda. Resposta não foi salva na planilha.", payload);
    }
  } catch (err) {
    console.error("Erro ao enviar RSVP:", err);
  }

  rsvpForm.hidden = true;
  thanksMsg.hidden = false;
  if (status === "Confirmado") {
    thanksText.textContent = "Obrigado por confirmar! Vai ser demais te ver na festa do João Marcelo! 🏁💙";
    if (!prefersReducedMotion) launchConfetti(80);
  } else {
    thanksText.textContent = "Que pena que não vai poder vir! Obrigado por avisar, vamos sentir sua falta. 💙";
  }
}

rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendRSVP("Confirmado");
});

declineBtn.addEventListener("click", () => {
  sendRSVP("Não poderá ir");
});

// ========= CONFETE (canvas, leve, sem libs externas) =========
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiAnimId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confettiColors = ["#A9C7E8", "#6F96C4", "#FFFFFF", "#2e2e2e", "#FFF9F0"];

function launchConfetti(count = 60) {
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      size: 6 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: -1.5 + Math.random() * 3,
      rotation: Math.random() * 360,
      rotSpeed: -6 + Math.random() * 12,
    });
  }
  if (!confettiAnimId) confettiLoop();
}

function confettiLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotSpeed;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });
  confettiPieces = confettiPieces.filter((p) => p.y < canvas.height + 40);
  if (confettiPieces.length > 0) {
    confettiAnimId = requestAnimationFrame(confettiLoop);
  } else {
    confettiAnimId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
