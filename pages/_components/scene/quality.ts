export interface QualityLevel {
  readonly maxPixelRatio: number;
  readonly shadowMapSize: number;
}

// From the sharpest to the cheapest. The scene starts at the first and only
// ever moves toward the last.
export const QUALITY_LEVELS: readonly QualityLevel[] = [
  { maxPixelRatio: 2, shadowMapSize: 2048 },
  { maxPixelRatio: 1.5, shadowMapSize: 1024 },
  { maxPixelRatio: 1, shadowMapSize: 512 },
];

const MIN_SAMPLES = 30;
const SLOW_FRAME_MS = 20;

function findMedian(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length / 2;
  return Number.isInteger(middle)
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : (sorted[Math.floor(middle)] ?? 0);
}

// A device that cannot paint a scroll step inside 20 ms at the median gets the
// next cheaper level. One slow frame does not decide it; a run of them does.
export function chooseQualityLevel(frameTimesMs: readonly number[], level: number): number {
  if (frameTimesMs.length < MIN_SAMPLES) return level;
  if (findMedian(frameTimesMs) <= SLOW_FRAME_MS) return level;
  return Math.min(level + 1, QUALITY_LEVELS.length - 1);
}
