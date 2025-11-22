import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface SessionGraphProps {
  scores: number[];
  width?: number;
  height?: number;
}

const SessionGraph: React.FC<SessionGraphProps> = ({ scores, width = 320, height = 120 }) => {
  if (!scores.length) return null;
  const maxScore = Math.max(...scores, 100);
  const minScore = Math.min(...scores, 0);
  const points = scores.map((score, i) => `${(i / (scores.length - 1)) * width},${height - ((score - minScore) / (maxScore - minScore)) * height}`).join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke="#00f"
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
};

export default SessionGraph;
