export interface Fade {
  readonly from: number;
  readonly to: number;
  readonly durationMs: number;
}

// Ease-out cubic, close to the site's --ease-out, so a piece's fade matches the
// 2D icon's CSS fade it crosses with.
export function measureFade(fade: Fade, elapsedMs: number): number {
  const progress = Math.min(Math.max(elapsedMs / fade.durationMs, 0), 1);
  const eased = 1 - (1 - progress) ** 3;
  return fade.from + (fade.to - fade.from) * eased;
}
