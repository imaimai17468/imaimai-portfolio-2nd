import sprite from "snd-lib/assets/sounds/sprite/02/audioSprite.json";

export type PianoSound = keyof typeof sprite.spritemap;

export interface SpriteSegment {
  readonly offset: number;
  readonly duration: number;
  readonly loop: boolean;
}

export function findSegment(sound: PianoSound): SpriteSegment {
  const { start, end, loop } = sprite.spritemap[sound];
  return { offset: start, duration: end - start, loop };
}
