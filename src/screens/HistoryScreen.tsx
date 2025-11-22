import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HistoryScreen: React.FC = () => {
  // Placeholder: fetch from cloud
  const sessions = [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <FlatList data={sessions} renderItem={({ item }: any) => <Text>{item.id}</Text>} keyExtractor={(i: any) => i.id} />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, fontWeight: '700' } });

export default HistoryScreen;
