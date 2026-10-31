export type GameSound = 'pet' | 'button' | 'chest';

const SOUND_URLS: Record<GameSound, string> = {
  pet: '/api/sound/petting.mp3',
  button: '/api/sound/button-click.mp3',
  chest: '/api/sound/chest-open.mp3',
};

const players = new Map<GameSound, HTMLAudioElement>();
let backgroundMusic: HTMLAudioElement | null = null;

function getPlayer(sound: GameSound): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  let player = players.get(sound);
  if (!player) {
    player = new Audio(SOUND_URLS[sound]);
    player.preload = 'auto';
    player.volume = 0.35;
    players.set(sound, player);
  }
  return player;
}

export function preloadGameSounds() {
  if (typeof window === 'undefined') return;

  for (const sound of Object.keys(SOUND_URLS) as GameSound[]) {
    getPlayer(sound)?.load();
  }
}

export function playGameSound(sound: GameSound) {
  const player = getPlayer(sound);
  if (!player) return;

  player.currentTime = 0;
  void player.play().catch((error: unknown) => {
    console.warn(`Lecture du son de jeu "${sound}" impossible :`, error);
  });
}

export function startBackgroundMusic() {
  if (typeof window === 'undefined') return;

  backgroundMusic ??= new Audio('/api/sound/background-music.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.preload = 'auto';
  backgroundMusic.volume = 0.2;

  if (backgroundMusic.paused) {
    void backgroundMusic.play().catch((error: unknown) => {
      console.warn('Lecture de la musique de fond impossible :', error);
    });
  }
}

export function stopBackgroundMusic() {
  backgroundMusic?.pause();
  if (backgroundMusic) backgroundMusic.currentTime = 0;
}
