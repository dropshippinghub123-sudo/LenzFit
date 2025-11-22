import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

interface AngleIndicatorProps {
  x: number;
  y: number;
  angle: number;
  color: string;
}

const AngleIndicator: React.FC<AngleIndicatorProps> = ({ x, y, angle, color }) => (
  <View style={{ position: 'absolute', left: 0, top: 0 }}>
    <Svg width={40} height={40}>
      <SvgText
        x={20}
        y={20}
        fill={color}
        fontSize={16}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {Math.round(angle)}°
      </SvgText>
    </Svg>
  </View>
);

export default AngleIndicator;
