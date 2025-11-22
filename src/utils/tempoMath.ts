export function getTempo(timestamps: number[]) {
  if (timestamps.length < 2) return 0;
  const diffs = timestamps.slice(1).map((t, i) => t - timestamps[i]);
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  return avg;
}
