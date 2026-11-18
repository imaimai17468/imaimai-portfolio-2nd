// Every material in a model is named after the palette token that colours it,
// so the scene finds a material's colour by prefixing its name with `--`.
export const PALETTE_TOKENS = [
  "--piece-white",
  "--piece-grey",
  "--piece-dark",
  "--piece-blue",
  "--piece-gold",
  "--piece-red",
  "--piece-green",
  "--piece-wood",
] as const;

const HEX_COLOR = /^#([0-9a-f]{6})$/i;

// `read` returns a custom property's computed value, which is the declared
// hex literal, since the scene's tokens are declared as hex.
export function readTokenColor(read: (name: string) => string, token: string): number | null {
  const match = HEX_COLOR.exec(read(token).trim());
  return match?.[1] ? Number.parseInt(match[1], 16) : null;
}

const PLAIN_NUMBER = /^-?\d+(\.\d+)?$/;

// For the scene's unitless settings, such as how dark a shadow falls.
export function readTokenNumber(read: (name: string) => string, token: string): number | null {
  const value = read(token).trim();
  return PLAIN_NUMBER.test(value) ? Number(value) : null;
}

export function modelUrlOf(mainId: string, subId: string | null): string {
  return subId === null ? `/models/${mainId}.glb` : `/models/${mainId}--${subId}.glb`;
}
