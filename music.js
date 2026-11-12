"use strict";

// Nas páginas internas, disponibiliza o mesmo MP3 em um player compacto.
// Na inicial, o player original existente (#audio/#playBtn) continua inalterado.
(() => {
  if (document.querySelector("#audio")) return;

  const source = new URL("assets/audio/Billie Eilish - My Future.mp3", document.baseURI).href;
  const audio = new Audio(source);
  audio.preload = "metadata";
  const dock = document.createElement("aside");
  dock.className = "global-music-dock";
  dock.setAttribute("aria-label", "Player de música My Future");
  dock.innerHTML = '<button class="global-play-btn" type="button" aria-label="Reproduzir música"><i class="fa-solid fa-play" aria-hidden="true"></i></button><div class="global-music-meta"><strong>My Future</strong><span>Billie Eilish · My Future</span><input class="global-progress" type="range" min="0" max="100" value="0" step="0.1" aria-label="Posição da música"><div class="global-progress-track"><span></span></div></div><span class="global-music-clock">0:00</span>';
  document.body.append(dock);

  const button = dock.querySelector(".global-play-btn");
  const progress = dock.querySelector(".global-progress");
  const clock = dock.querySelector(".global-music-clock");
  const bar = dock.querySelector(".global-progress-track span");
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  };

  function update() {
    const playing = !audio.paused;
    button.innerHTML = `<i class="fa-solid fa-${playing ? "pause" : "play"}" aria-hidden="true"></i>`;
    button.setAttribute("aria-label", playing ? "Pausar música" : "Reproduzir música");
    const percent = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration * 100 : 0;
    progress.value = String(percent);
    clock.textContent = formatTime(audio.currentTime);
    bar.style.width = `${percent}%`;
  }

  button.addEventListener("click", async () => {
    if (!audio.paused) audio.pause();
    else {
      try { await audio.play(); }
      catch (error) { console.error("Não foi possível reproduzir a música:", error); }
    }
  });
  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(progress.value) / 100 * audio.duration;
  });
  ["play", "pause", "timeupdate", "loadedmetadata", "durationchange", "ended"].forEach((name) => audio.addEventListener(name, update));
  update();
})();
