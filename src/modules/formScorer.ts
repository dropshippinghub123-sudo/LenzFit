import { Landmark, FormRatingResult, Breakdown } from './formRating';

// Helpers
function angleBetween(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  // angle at b between ba and bc
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const magA = Math.hypot(abx, aby);
  const magC = Math.hypot(cbx, cby);
  if (magA === 0 || magC === 0) return null;
  const cos = Math.max(-1, Math.min(1, dot / (magA * magC)));
  const radians = Math.acos(cos);
  return (radians * 180) / Math.PI;
}

function find(landmarks: Landmark[], name: string) {
  return landmarks.find((l) => l.name === name) || null;
}

// A simple rule-based scorer that returns a normalized score and a breakdown.
export function computeFormRating(landmarks: Landmark[], exerciseId = 'default'): FormRatingResult {
  // Default placeholders
  const breakdown: Breakdown = { posture: 100, range: 100, tempo: 100, alignment: 100 };

  // Example rules: use shoulders, hips, knees
  const leftShoulder = find(landmarks, 'left_shoulder');
  const rightShoulder = find(landmarks, 'right_shoulder');
  const leftHip = find(landmarks, 'left_hip');
  const rightHip = find(landmarks, 'right_hip');
  const leftKnee = find(landmarks, 'left_knee');
  const rightKnee = find(landmarks, 'right_knee');

  // Posture: measure torso lean via shoulders-hip angle
  if (leftShoulder && rightShoulder && leftHip && rightHip) {
    const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
    const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
    // Compare vertical alignment: x distance between mid points
    const dx = Math.abs(midShoulder.x - midHip.x);
    // heuristics: smaller dx => better posture
    const postureScore = Math.max(0, 100 - dx * 200); // tuned empirically
    breakdown.posture = Math.round(postureScore);
  }

  // Range: check knee angle if available
  if (leftHip && leftKnee && find(landmarks, 'left_ankle')) {
    const leftAnkle = find(landmarks, 'left_ankle')!;
    const kneeAngle = angleBetween(leftHip, leftKnee, leftAnkle) || 180;
    // target for many exercises: full extension ~ 180, deeper squat smaller angle
    const rangeScore = Math.max(0, 100 - Math.abs(180 - kneeAngle));
    breakdown.range = Math.round(rangeScore);
  }

  // Alignment: shoulder symmetry
  if (leftShoulder && rightShoulder) {
    const shoulderDx = Math.abs(leftShoulder.y - rightShoulder.y);
    const alignScore = Math.max(0, 100 - shoulderDx * 100); // smaller vertical difference is better
    breakdown.alignment = Math.round(alignScore);
  }

  // Tempo: cannot be determined from a single frame; keep as 100 for per-frame scoring
  breakdown.tempo = 100;

  // Combine into final score weighted
  const score = Math.round((breakdown.posture * 0.35 + breakdown.range * 0.30 + breakdown.alignment * 0.25 + breakdown.tempo * 0.10));

  return { score, breakdown, landmarks };
}

export default { computeFormRating };
