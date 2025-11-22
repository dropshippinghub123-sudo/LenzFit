import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.pravatar.cc/150?img=3' }} style={styles.avatar} />
      <Text style={styles.name}>Your Profile</Text>
      <Text style={styles.info}>Email: user@example.com</Text>
      <Text style={styles.info}>Workouts: 42</Text>
      <Text style={styles.info}>Best Score: 97</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { color: '#4F8EF7', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  info: { color: '#fff', fontSize: 18, marginBottom: 4 },
});

export default ProfileScreen;