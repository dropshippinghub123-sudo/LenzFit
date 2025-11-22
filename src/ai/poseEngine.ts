import formRating, { Landmark } from '../modules/formRating';
import { OneEuroFilter, smoothKeypoints } from './smoothing';

export type Keypoint = { name?: string; x: number; y: number; confidence: number };
export type Angles = { [k: string]: number };
export type PoseFrame = {
  keypoints: Keypoint[];
  angles: Angles;
  stability: number;
  smoothing: boolean;
  velocity?: { x: number; y: number }[];
};

// Basic angle helper
function angleBetween(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const magA = Math.hypot(abx, aby);
  const magC = Math.hypot(cbx, cby);
  if (magA === 0 || magC === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (magA * magC)));
  return (Math.acos(cos) * 180) / Math.PI;
}

export class PoseEngine {
  private filters: OneEuroFilter[] = [];
  private listeners: ((frame: PoseFrame) => void)[] = [];

  constructor() {
    // Subscribe to native landmarks stream
    formRating.subscribeLandmarks((lm) => this.onLandmarks(lm));
  }

  onLandmarks(landmarks: Landmark[]) {
    // Map landmarks to consistent order
    const keypoints: Keypoint[] = landmarks.map((l) => ({ name: l.name, x: l.x, y: l.y, confidence: l.confidence }));

    // Initialize filters once
    if (this.filters.length === 0) {
      this.filters = keypoints.map(() => new OneEuroFilter(30, 1.0, 0.001, 1.0));
    }

    const points = keypoints.map((k) => ({ x: k.x, y: k.y }));
    const smoothed = smoothKeypoints(points, this.filters);

    const smoothedKeypoints: Keypoint[] = smoothed.map((p, i) => ({ ...keypoints[i], x: p.x, y: p.y }));

    // Compute angles for a set of joints
    const leftShoulder = smoothedKeypoints.find((k) => k.name === 'left_shoulder');
    const rightShoulder = smoothedKeypoints.find((k) => k.name === 'right_shoulder');
    const leftHip = smoothedKeypoints.find((k) => k.name === 'left_hip');
    const rightHip = smoothedKeypoints.find((k) => k.name === 'right_hip');
    const leftKnee = smoothedKeypoints.find((k) => k.name === 'left_knee');
    const rightKnee = smoothedKeypoints.find((k) => k.name === 'right_knee');
    const leftAnkle = smoothedKeypoints.find((k) => k.name === 'left_ankle');
    const rightAnkle = smoothedKeypoints.find((k) => k.name === 'right_ankle');

    const angles: Angles = {};
    if (leftHip && leftKnee && leftAnkle) {
      angles['left_knee_angle'] = angleBetween(leftHip, leftKnee, leftAnkle);
    }
    if (rightHip && rightKnee && rightAnkle) {
      angles['right_knee_angle'] = angleBetween(rightHip, rightKnee, rightAnkle);
    }
    if (leftShoulder && leftHip && leftKnee) {
      angles['left_torso_angle'] = angleBetween(leftShoulder, leftHip, leftKnee);
    }
    if (rightShoulder && rightHip && rightKnee) {
      angles['right_torso_angle'] = angleBetween(rightShoulder, rightHip, rightKnee);
    }

    // Simple stability: average variance across keypoints over time is not implemented here; stub 100
    const stability = 100;

    const frame: PoseFrame = {
      keypoints: smoothedKeypoints,
      angles,
      stability,
      smoothing: true,
    };

    this.listeners.forEach((l) => l(frame));
  }

  subscribe(cb: (frame: PoseFrame) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== cb);
    };
  }
}

export const poseEngine = new PoseEngine();
