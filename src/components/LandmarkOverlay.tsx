import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Landmark } from '../modules/formRating';

type Props = {
  landmarks: Landmark[];
  width: number;
  height: number;
};

const LandmarkOverlay: React.FC<Props> = ({ landmarks, width, height }) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      {landmarks.map((l, i) => {
        if (typeof l.x !== 'number' || typeof l.y !== 'number') return null;
        const left = l.x * width - 6;
        const top = l.y * height - 6;
        return <View key={i} style={[styles.dot, { left, top }]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,200,0,0.9)',
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default LandmarkOverlay;
