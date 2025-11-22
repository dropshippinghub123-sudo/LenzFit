export interface Keypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

export interface PoseFrame {
  keypoints: Keypoint[];
  angles: Record<string, number>;
  stability: Record<string, number>;
  smoothing: Record<string, number>;
  velocity: Record<string, number>;
}
