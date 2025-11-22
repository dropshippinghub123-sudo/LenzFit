import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const ResultsScreen: React.FC = ({ route, navigation }: any) => {
  const { reps = [] } = route.params || {};

  const overall = reps.length ? Math.round(reps.reduce((s: any, r: any) => s + (r.score || 0), 0) / reps.length) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Results</Text>
      <Text style={styles.overall}>Overall Score: {overall}</Text>

      <FlatList
        data={reps}
        keyExtractor={(item: any) => String(item.rep)}
        renderItem={({ item }: any) => (
          <View style={styles.repRow}>
            <Text style={styles.repTitle}>Rep {item.rep}</Text>
            <Text>Score: {item.score}</Text>
            {item.issues && item.issues.length > 0 && (
              <Text style={styles.issues}>Issues: {item.issues.join(', ')}</Text>
            )}
          </View>
        )}
      />

      <Button title="Save Session" onPress={() => { /* hook to cloud save */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700' },
  overall: { fontSize: 18, marginVertical: 8 },
  repRow: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  repTitle: { fontWeight: '700' },
  issues: { color: '#b00' },
});

export default ResultsScreen;
