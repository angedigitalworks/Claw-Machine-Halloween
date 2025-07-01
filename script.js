
const videoEl = document.getElementById('animation-video');
const audioEl = document.getElementById('animation-audio');
const wrapper = document.getElementById('animation-wrapper');
const usernameDisplay = document.getElementById('username-display');

// Animaciones ganar (win)
const winAnimations = [
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win-cat.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win.MP3' },
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win-cauldron.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win.MP3' },
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win-ghost.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win.MP3' },
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win-mummy.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/win.MP3' }
];

// Animaciones perder (lose)
const loseAnimations = [
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose-cat.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose.MP3' },
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose-cauldron.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose.MP3' },
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose-ghost.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose.MP3' },
  { video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose-mummy.webm', audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/lose.MP3' }
];

// Premio especial 3 wins
const specialAnimation = {
  video: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/ghostface.webm',
  audio: 'https://angedigitalworks.github.io/Claw-Machine-Halloween/ghostface.MP3'
};

// Contador de victorias por usuario
const userWins = {};

// Función para reproducir animación
function playAnimation(videoUrl, audioUrl, username) {
  usernameDisplay.textContent = username;
  videoEl.src = videoUrl;
  audioEl.src = audioUrl;

  wrapper.classList.remove('hidden');

  // Reproducir video y audio
  Promise.all([videoEl.play(), audioEl.play()]).catch(e => {
    // puede fallar si no hay interacción previa, ignorar
  });

  // Al terminar el video ocultar todo
  videoEl.onended = () => {
    wrapper.classList.add('hidden');
    videoEl.src = '';
    audioEl.src = '';
    usernameDisplay.textContent = '';
  };
}

// Escuchar eventos del chat
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail;
  if (!listener || !listener.event) return;
  if (listener.event === 'message') {
    const message = listener.data.text.toLowerCase();
    const username = listener.data.displayName || listener.data.username;

    if (message.includes('machine')) {
      // Decidir si gana o pierde (50/50)
      const didWin = Math.random() < 0.5;

      if (!userWins[username]) userWins[username] = 0;

      if (didWin) {
        userWins[username]++;
        // Si tiene 3 wins activar premio especial y resetear contador
        if (userWins[username] >= 3) {
          playAnimation(specialAnimation.video, specialAnimation.audio, username + ' (SPECIAL WIN!)');
          userWins[username] = 0;
        } else {
          // Animación aleatoria de ganar
          const win = winAnimations[Math.floor(Math.random() * winAnimations.length)];
          playAnimation(win.video, win.audio, username + ' (WIN)');
        }
      } else {
        // Pierde, resetear contador
        userWins[username] = 0;
        // Animación aleatoria de perder
        const lose = loseAnimations[Math.floor(Math.random() * loseAnimations.length)];
        playAnimation(lose.video, lose.audio, username + ' (LOSE)');
      }
    }
  }
});
