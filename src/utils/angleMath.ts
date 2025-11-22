export function getAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  const angle = Math.acos(dot / (magAB * magCB));
  return (angle * 180) / Math.PI;
}
