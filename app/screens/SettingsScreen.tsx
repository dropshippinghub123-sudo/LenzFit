import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Delete Account" onPress={() => {}} />
      <Button title="Privacy Policy" onPress={() => {}} />
      <Button title="Upgrade Account" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, fontWeight: '700' } });

export default SettingsScreen;
