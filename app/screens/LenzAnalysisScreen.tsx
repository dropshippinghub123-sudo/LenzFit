import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LenzAnalysisScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Lenz Analysis</Text>
    <Text style={styles.subtitle}>AI-powered form and rep analysis.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#4F8EF7', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#fff', fontSize: 18 },
});

export default LenzAnalysisScreen;
