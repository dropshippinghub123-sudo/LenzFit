import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedBackground: React.FC = ({ children }) => {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, [colorAnim]);

  const bgColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#181A20', '#23272F'],
  });

  return <Animated.View style={[styles.bg, { backgroundColor: bgColor }]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
});

export default AnimatedBackground;
