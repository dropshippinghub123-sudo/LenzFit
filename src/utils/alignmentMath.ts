export function getAlignment(angles: Record<string, number>, ideal: Record<string, number>) {
  let totalDeviation = 0;
  let count = 0;
  for (const joint in angles) {
    if (ideal[joint] !== undefined) {
      totalDeviation += Math.abs(angles[joint] - ideal[joint]);
      count++;
    }
  }
  return count ? 100 - Math.min(totalDeviation / count, 100) : 100;
}
