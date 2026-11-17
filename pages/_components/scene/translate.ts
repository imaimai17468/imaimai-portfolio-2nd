// A computed `translate` is "none" or one to three lengths in px. The scene
// follows the DOM's exit motion by reading it mid-transition.
export function readTranslate(value: string): { x: number; y: number } {
  if (value === "none") return { x: 0, y: 0 };
  const [x = 0, y = 0] = value.split(/\s+/).map((part) => Number.parseFloat(part) || 0);
  return { x, y };
}
