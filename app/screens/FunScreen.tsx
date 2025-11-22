import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const FunScreen: React.FC = () => {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounce]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ball, { transform: [{ translateY: bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) }] }]} />
      <Text style={styles.text}>Welcome to the Fun Zone!</Text>
      <Text style={styles.subtext}>Enjoy playful animations and surprises 🎉</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', alignItems: 'center', justifyContent: 'center' },
  ball: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF6F61', marginBottom: 24 },
  text: { color: '#4F8EF7', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtext: { color: '#fff', fontSize: 18 },
});

export default FunScreen;
