// One Euro Filter implementation (TypeScript)
export class OneEuroFilter {
  private freq: number;
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;

  private xPrev: number | null = null;
  private dxPrev: number | null = null;

  constructor(freq = 60, minCutoff = 1.0, beta = 0.0, dCutoff = 1.0) {
    this.freq = freq;
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  private alpha(cutoff: number) {
    const te = 1.0 / this.freq;
    const tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / te);
  }

  filter(x: number, timestamp?: number) {
    if (this.xPrev === null) {
      this.xPrev = x;
      this.dxPrev = 0;
      return x;
    }

    const dx = x - this.xPrev;
    const edCutoff = this.dCutoff;
    const alphaD = this.alpha(edCutoff);
    const dxHat = alphaD * dx + (1 - alphaD) * (this.dxPrev || 0);

    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
    const a = this.alpha(cutoff);
    const xHat = a * x + (1 - a) * this.xPrev;

    this.xPrev = xHat;
    this.dxPrev = dxHat;
    return xHat;
  }
}

export function smoothKeypoints(keypoints: { x: number; y: number }[], filters: OneEuroFilter[]) {
  return keypoints.map((kp, i) => {
    const f = filters[i];
    if (!f) return kp;
    return { x: f.filter(kp.x), y: f.filter(kp.y) };
  });
}
