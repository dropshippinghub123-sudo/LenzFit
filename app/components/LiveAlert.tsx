import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LiveAlertProps {
  message: string;
  color?: string;
}

const LiveAlert: React.FC<LiveAlertProps> = ({ message, color = '#f00' }) => (
  <View style={[styles.alert, { borderColor: color }]}> 
    <Text style={[styles.text, { color }]}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default LiveAlert;
