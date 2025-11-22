import { getAngle } from '../src/utils/angleMath';

describe('getAngle', () => {
  it('should compute correct angle', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 1, y: 0 };
    const c = { x: 1, y: 1 };
    const angle = getAngle(a, b, c);
    expect(Math.round(angle)).toBe(90);
  });
});
