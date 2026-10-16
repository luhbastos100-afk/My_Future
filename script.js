const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");


// PLAY / PAUSE
playBtn.addEventListener("click", () => {

    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

});


// ATUALIZA O ÍCONE DO BOTÃO
audio.addEventListener("play", () => {

    playBtn.innerHTML =
        '<i class="fa-solid fa-pause"></i>';

});

audio.addEventListener("pause", () => {

    playBtn.innerHTML =
        '<i class="fa-solid fa-play"></i>';

});


// ATUALIZA A BARRA DE PROGRESSO
audio.addEventListener("timeupdate", () => {

    if (!isNaN(audio.duration) && audio.duration > 0) {

        progress.value =
            (audio.currentTime / audio.duration) * 100;

        duration.textContent =
            formatTime(audio.duration);

    }

    currentTime.textContent =
        formatTime(audio.currentTime);

});


// CARREGA A DURAÇÃO
audio.addEventListener("loadedmetadata", updateDuration);

audio.addEventListener("durationchange", updateDuration);

audio.addEventListener("loadeddata", updateDuration);

audio.addEventListener("canplay", updateDuration);


function updateDuration() {

    if (!isNaN(audio.duration) && audio.duration > 0) {

        duration.textContent =
            formatTime(audio.duration);

    }

}


// BARRA DE PROGRESSO
progress.addEventListener("input", () => {

    if (!isNaN(audio.duration) && audio.duration > 0) {

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    }

});


// QUANDO TERMINAR
audio.addEventListener("ended", () => {

    playBtn.innerHTML =
        '<i class="fa-solid fa-play"></i>';

    progress.value = 0;

    currentTime.textContent = "0:00";

});


// FORMATA O TEMPO
function formatTime(time) {

    if (isNaN(time) || time < 0) {

        return "0:00";

    }

    const minutes =
        Math.floor(time / 60);

    const seconds =
        Math.floor(time % 60);

    return (
        minutes +
        ":" +
        seconds.toString().padStart(2, "0")
    );

}


// TENTA DAR AUTOPLAY AO ABRIR O SITE
window.addEventListener("load", () => {

    audio.play().catch(() => {

        console.log(
            "Autoplay bloqueado pelo navegador."
        );

    });

});