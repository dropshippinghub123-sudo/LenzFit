export function getROM(angles: number[]) {
  if (!angles.length) return 0;
  const min = Math.min(...angles);
  const max = Math.max(...angles);
  return max - min;
}
