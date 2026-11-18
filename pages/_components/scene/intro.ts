// When the scene first shows, the pieces are set down on the table one after
// another rather than appearing all at once: each falls a short way, faster as
// it nears the table, and lands with the rattle a sub step gives it.
export interface Drop {
  // How high the piece still is, from 1 at the start of its fall to 0 on the table.
  readonly lift: number;
  readonly opacity: number;
  readonly hasLanded: boolean;
}

// The board takes 650ms to tilt into place (`.menu-board` in menu.css), and
// the pieces wait for it. Each piece follows the one before by STAGGER_MS.
export const INTRO_DELAY_MS = 650;
export const STAGGER_MS = 45;
export const DROP_MS = 280;
// The piece is fully shown before it lands, so the knock is seen whole.
const SHOW_MS = DROP_MS * 0.6;

// `order` is the piece's place in the sequence and `elapsedMs` the time since
// the scene first drew. With reduced motion the piece fades in where it stands.
export function measureDrop(order: number, elapsedMs: number, isMotionReduced: boolean): Drop {
  const local = elapsedMs - INTRO_DELAY_MS - order * STAGGER_MS;
  if (local < 0) return { lift: 1, opacity: 0, hasLanded: false };
  const shown = Math.min(local / SHOW_MS, 1);
  const opacity = 1 - (1 - shown) ** 3;
  if (local >= DROP_MS) return { lift: 0, opacity: 1, hasLanded: true };
  const progress = local / DROP_MS;
  return { lift: isMotionReduced ? 0 : 1 - progress ** 2, opacity, hasLanded: false };
}
