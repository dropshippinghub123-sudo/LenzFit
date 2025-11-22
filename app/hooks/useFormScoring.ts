import { useEffect, useState } from 'react';
import { scoreRep } from '../../src/ai/formScoring';
import { PoseFrame } from '../../src/models/poseTypes';

export function useFormScoring(frame: PoseFrame | null) {
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    if (frame) {
      setScore(scoreRep(frame));
    }
  }, [frame]);

  return score;
}
