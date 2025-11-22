import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SessionGraph from '../components/SessionGraph';

const mockScores = [70, 75, 80, 85, 90, 88, 92, 95];

const ProgressScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Progress</Text>
    <Text style={styles.subtitle}>Your improvement over time</Text>
    <SessionGraph scores={mockScores} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#4F8EF7', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#fff', fontSize: 18, marginBottom: 16 },
});

export default ProgressScreen;
