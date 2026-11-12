"use strict";

// Player da seção "Sobre Nós".
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("playBtn");
  const progress = document.getElementById("progress");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");

  if (![audio, playBtn, progress, currentTime, duration].every(Boolean)) return;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  function updateButton() {
    const playing = !audio.paused;
    playBtn.innerHTML = playing
      ? '<i class="fa-solid fa-pause" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-play" aria-hidden="true"></i>';
    playBtn.setAttribute("aria-label", playing ? "Pausar música" : "Reproduzir música");
  }

  function updateDuration() {
    duration.textContent = formatTime(audio.duration);
  }

  function updateProgress() {
    currentTime.textContent = formatTime(audio.currentTime);
    progress.value = Number.isFinite(audio.duration) && audio.duration > 0
      ? String((audio.currentTime / audio.duration) * 100)
      : "0";
  }

  playBtn.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch (error) {
      console.error("Não foi possível reproduzir a música:", error);
      playBtn.title = "Não foi possível reproduzir o áudio";
    }
  });

  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
      updateProgress();
    }
  });

  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", () => { updateDuration(); updateProgress(); });
  audio.addEventListener("durationchange", updateDuration);
  audio.addEventListener("ended", () => { updateButton(); updateProgress(); });
  audio.addEventListener("error", () => console.error("Erro ao carregar o arquivo de áudio."));

  // Sem autoplay: navegadores frequentemente bloqueiam reprodução sem interação.
  updateButton();
  updateDuration();
  updateProgress();
});
