import { useEffect, useState } from 'react';
import { runMediaPipePose } from '../../src/ai/mediaPipePose';
import { Keypoint } from '../../src/ai/poseEngine';

export function usePoseDetection(imageData: ImageData | HTMLCanvasElement) {
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);

  useEffect(() => {
    let active = true;
    async function detect() {
      const result = await runMediaPipePose(imageData);
      if (active) setKeypoints(result);
    }
    if (imageData) detect();
    return () => { active = false; };
  }, [imageData]);

  return keypoints;
}
