import { scoreRep } from '../src/ai/formScoring';
import { PoseFrame } from '../src/models/poseTypes';

describe('scoreRep', () => {
  it('should return a grade', () => {
    const frame: PoseFrame = {
      keypoints: [],
      angles: {},
      stability: {},
      smoothing: {},
      velocity: {},
    };
    const result = scoreRep(frame);
    expect(result.grade).toBeDefined();
  });
});
