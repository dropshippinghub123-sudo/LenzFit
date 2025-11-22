import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Keypoint } from '../../src/ai/poseEngine';

interface LandmarkOverlayProps {
  landmarks: Keypoint[];
  width: number;
  height: number;
}

const LandmarkOverlay: React.FC<LandmarkOverlayProps> = ({ landmarks, width, height }) => {
  // Render simple dots for each landmark
  return (
    <View style={[StyleSheet.absoluteFill, { width, height }]} pointerEvents="none">
      {landmarks.map((l, i) => {
        if (typeof l.x !== 'number' || typeof l.y !== 'number') return null;
        const left = l.x * width - 6;
        const top = l.y * height - 6;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left,
              top,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(0,200,0,0.9)',
              borderWidth: 1,
              borderColor: '#fff',
            }}
          />
        );
      })}
    </View>
  );
};

export default LandmarkOverlay;
