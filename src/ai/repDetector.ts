import { PoseFrame } from './poseEngine';

export type Rep = {
  rep: number;
  score: number;
  issues: string[];
  angles: { [k: string]: number };
  tips: string[];
};

type State = 'idle' | 'descending' | 'ascending';

export class RepDetector {
  private state: State = 'idle';
  private reps: Rep[] = [];
  private repCount = 0;
  private lastKneeAngle = 180;

  onFrame(frame: PoseFrame) {
    // Use knee angle as proxy for squat detection
    const leftKnee = frame.angles['left_knee_angle'] || 180;
    const rightKnee = frame.angles['right_knee_angle'] || 180;
    const kneeAngle = (leftKnee + rightKnee) / 2;

    const thresholdDown = 120; // example: below this is descending
    const thresholdUp = 160;

    if (this.state === 'idle') {
      if (kneeAngle < thresholdDown) {
        this.state = 'descending';
      }
    } else if (this.state === 'descending') {
      if (kneeAngle <= 100) {
        // reached bottom
      }
      if (kneeAngle > thresholdDown) {
        // false alarm, back to idle
        this.state = 'idle';
      }
      if (kneeAngle > thresholdUp) {
        // edge case
      }
      if (this.lastKneeAngle < kneeAngle && kneeAngle > thresholdUp) {
        // finished ascending -> count rep
        this.repCount += 1;
        const rep: Rep = {
          rep: this.repCount,
          score: 80,
          issues: [],
          angles: frame.angles,
          tips: [],
        };
        this.reps.push(rep);
        this.state = 'idle';
      }
    }

    this.lastKneeAngle = kneeAngle;
  }

  getReps() {
    return this.reps.slice();
  }

  reset() {
    this.reps = [];
    this.repCount = 0;
    this.state = 'idle';
  }
}

export default RepDetector;
