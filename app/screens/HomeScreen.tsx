import React from 'react';
import { Text, StyleSheet } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';

const HomeScreen: React.FC = () => (
  <AnimatedBackground>
    <Text style={styles.title}>Lenz Fit Home</Text>
    <Text style={styles.subtitle}>Welcome to your AI-powered fitness journey!</Text>
  </AnimatedBackground>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#4F8EF7', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#fff', fontSize: 18 },
});

export default HomeScreen;
