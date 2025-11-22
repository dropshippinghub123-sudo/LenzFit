import React from 'react';
import { View, StyleSheet } from 'react-native';

type Keypoint = { x: number; y: number; confidence: number; name?: string };

type Props = {
  keypoints: Keypoint[];
  width: number;
  height: number;
};

const connections = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_hip', 'right_hip'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

export const SkeletonOverlay: React.FC<Props> = ({ keypoints, width, height }) => {
  const kpMap = Object.fromEntries(keypoints.map((k) => [k.name, k]));
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      {connections.map(([a, b], i) => {
        const kpA = kpMap[a];
        const kpB = kpMap[b];
        if (!kpA || !kpB) return null;
        const x1 = kpA.x * width;
        const y1 = kpA.y * height;
        const x2 = kpB.x * width;
        const y2 = kpB.y * height;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1) || 2,
              height: Math.abs(y2 - y1) || 2,
              backgroundColor: 'rgba(0,150,255,0.7)',
              borderRadius: 2,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

export default SkeletonOverlay;
