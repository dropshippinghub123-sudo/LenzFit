import RepDetector from '../src/ai/repDetector';
import { PoseFrame } from '../src/models/poseTypes';

describe('RepDetector', () => {
  it('should detect reps', () => {
    const detector = new RepDetector();
    for (let i = 0; i < 100; i++) {
      const frame: PoseFrame = {
        keypoints: [],
        angles: {},
        stability: {},
        smoothing: {},
        velocity: {},
      };
      detector.onFrame(frame);
    }
    expect(detector.getReps().length).toBeGreaterThan(0);
  });
});
