export function getSafety(issues: string[]) {
  return issues.length === 0 ? 100 : Math.max(0, 100 - issues.length * 20);
}
