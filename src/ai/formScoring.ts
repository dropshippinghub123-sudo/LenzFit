import { PoseFrame } from './poseEngine';

export type Breakdown = { depth: number; stability: number; smoothness: number; tempo: number; alignment: number; safety: number };

export type RepResult = {
  rep: number;
  score: number;
  issues: string[];
  angles: { [k: string]: number };
  tips: string[];
};

export function scoreRep(frame: PoseFrame, repIndex: number): RepResult {
  const angles = frame.angles;
  // depth score: if knee angles are small (deep squat) better for squats
  const leftK = angles['left_knee_angle'] || 180;
  const rightK = angles['right_knee_angle'] || 180;
  const kneeAvg = (leftK + rightK) / 2;
  const depth = Math.max(0, Math.min(100, Math.round((180 - kneeAvg) / 180 * 100)));

  // stability: placeholder using frame.stability
  const stability = Math.round(frame.stability);

  // smoothness: placeholder constant
  const smoothness = 90;

  // tempo: unknown per frame, placeholder
  const tempo = 90;

  // alignment: check torso angles
  const torsoL = angles['left_torso_angle'] || 180;
  const torsoR = angles['right_torso_angle'] || 180;
  const torsoDev = Math.abs(torsoL - torsoR);
  const alignment = Math.max(0, 100 - torsoDev);

  // safety: if knee angle too small or back angle bad
  const safety = kneeAvg < 50 ? 60 : 95;

  const breakdown: Breakdown = { depth, stability, smoothness, tempo, alignment, safety };

  // Weighted final score
  const score = Math.round((breakdown.depth * 0.3) + (breakdown.stability * 0.2) + (breakdown.smoothness * 0.15) + (breakdown.tempo * 0.1) + (breakdown.alignment * 0.15) + (breakdown.safety * 0.1));

  const issues: string[] = [];
  const tips: string[] = [];
  if (alignment < 70) issues.push('Asymmetry detected — hips/shoulders misaligned');
  if (safety < 70) issues.push('Possible unsafe range — reduce depth or check spine');

  if (issues.length === 0) tips.push('Good rep — keep consistent tempo and alignment');

  return { rep: repIndex, score, issues, angles: angles || {}, tips };
}

export function grade(score: number): string {
  if (score > 90) return 'A';
  if (score > 80) return 'B';
  if (score > 70) return 'C';
  if (score > 50) return 'D';
  return 'F';
}
