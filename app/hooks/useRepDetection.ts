import { useEffect, useState } from 'react';
import RepDetector from '../../src/ai/repDetector';
import { PoseFrame } from '../../src/models/poseTypes';

export function useRepDetection(frame: PoseFrame | null) {
  const [reps, setReps] = useState<any[]>([]);
  const detector = new RepDetector();

  useEffect(() => {
    if (frame) {
      detector.onFrame(frame);
      setReps([...detector.getReps()]);
    }
  }, [frame]);

  return reps;
}
