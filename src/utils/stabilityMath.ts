export function getStability(positions: {x: number, y: number}[]) {
  if (positions.length < 2) return 100;
  let variance = 0;
  const avgX = positions.reduce((a, p) => a + p.x, 0) / positions.length;
  const avgY = positions.reduce((a, p) => a + p.y, 0) / positions.length;
  positions.forEach(p => {
    variance += Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2);
  });
  variance /= positions.length;
  return 100 - Math.min(variance, 100);
}
