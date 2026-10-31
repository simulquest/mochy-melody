import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SOUND_FILES = new Set([
  'petting.mp3',
  'button-click.mp3',
  'chest-open.mp3',
  'background-music.mp3',
]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!SOUND_FILES.has(filename)) {
    return new Response('Son introuvable.', { status: 404 });
  }

  let audio: Buffer;
  try {
    audio = await readFile(path.join(process.cwd(), 'src', 'sound', filename));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return new Response('Ajoutez le fichier MP3 dans src/sound.', { status: 404 });
    }
    throw error;
  }

  if (audio.length === 0) {
    return new Response('Le fichier MP3 est vide.', { status: 404 });
  }

  return new Response(new Uint8Array(audio), {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache',
    },
  });
}
