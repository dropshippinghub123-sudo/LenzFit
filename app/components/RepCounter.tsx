import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RepCounterProps {
  count: number;
}

const RepCounter: React.FC<RepCounterProps> = ({ count }) => (
  <View style={styles.counter}>
    <Text style={styles.text}>Reps: {count}</Text>
  </View>
);

const styles = StyleSheet.create({
  counter: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default RepCounter;
