import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface ReplayAnimationProps {
  vectors: { x: number; y: number }[];
  width?: number;
  height?: number;
}

const ReplayAnimation: React.FC<ReplayAnimationProps> = ({ vectors, width = 320, height = 240 }) => {
  if (!vectors.length) return null;
  const points = vectors.map(v => `${v.x * width},${v.y * height}`).join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke="#0f0"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

export default ReplayAnimation;
