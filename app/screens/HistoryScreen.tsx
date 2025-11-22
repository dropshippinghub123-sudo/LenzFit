import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getHistory } from '../../src/services/supabaseService';

const HistoryScreen: React.FC = () => {
  const [sessions, setSessions] = useState<Array<{ id: string; created_at: string; score: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      // Replace with actual userId from auth context
      const userId = 'demo-user-id';
      const { data, error } = await getHistory(userId);
      if (!error && data) setSessions(data);
      setLoading(false);
    }
    fetchSessions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={sessions}
          renderItem={({ item }) => (
            <View style={styles.sessionRow}>
              <Text style={styles.sessionDate}>{item.created_at}</Text>
              <Text>Score: {item.score}</Text>
            </View>
          )}
          keyExtractor={(i) => String(i.id)}
        />
      )}
      {/* Improvement graph placeholder */}
      <View style={styles.graphPlaceholder}>
        <Text>Improvement Graph (coming soon)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  sessionRow: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  sessionDate: { fontWeight: '600' },
  graphPlaceholder: { marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center' },
});

export default HistoryScreen;
