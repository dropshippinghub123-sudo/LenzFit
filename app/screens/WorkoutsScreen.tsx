import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Calendar from '../components/Calendar';

const splits = [
  'Push/Pull/Legs',
  'Upper/Lower',
  'Full Body',
  'Bro Split',
  'Custom Split',
];

const WorkoutsScreen: React.FC = () => {
  const [suggested, setSuggested] = useState(splits[0]);
  function handleDateSelect(date: Date) {
    // Suggest split based on day of week
    const day = date.getDay();
    setSuggested(splits[day % splits.length]);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workouts</Text>
      <Text style={styles.subtitle}>Track, start, and analyze your workouts here.</Text>
      <Calendar onSelect={handleDateSelect} />
      <Text style={styles.suggest}>Suggested Split: {suggested}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#4F8EF7', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#fff', fontSize: 18 },
});

export default WorkoutsScreen;
