import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';
import { poseEngine, Keypoint, PoseFrame } from '../../src/ai/poseEngine';
import RepDetector from '../../src/ai/repDetector';
import LandmarkOverlay from '../../src/components/LandmarkOverlay';
import SkeletonOverlay from '../components/SkeletonOverlay';

const detector = new RepDetector();

interface CameraScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [running, setRunning] = useState(false);
  const [landmarks, setLandmarks] = useState<Keypoint[]>([]);
  const [lastFrame, setLastFrame] = useState<PoseFrame | null>(null);
  const bounce = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const unsub = poseEngine.subscribe((frame: PoseFrame) => {
      setLastFrame(frame);
      detector.onFrame(frame);
      setLandmarks(frame.keypoints || []);
    });
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
    return () => unsub();
  }, []);

  function start() {
    setRunning(true);
    // Start session logic here
  }

  function stop() {
    setRunning(false);
    const reps = detector.getReps();
    navigation.navigate('Results', { reps });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Workout</Text>
      <Animated.View style={[styles.preview, { transform: [{ perspective: 800 }, { rotateX: bounce.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '25deg'] }) }] }] }>
        <View style={styles.previewPlaceholder} />
        <LandmarkOverlay landmarks={landmarks} width={360} height={240} />
        <SkeletonOverlay keypoints={landmarks} width={360} height={240} />
      </Animated.View>
      <View style={styles.controls}>
        {!running ? <Button title="Start" color="#4F8EF7" onPress={start} /> : <Button title="Stop" color="#FF6F61" onPress={stop} />}
        <Button title="History" color="#4F8EF7" onPress={() => navigation.navigate('History')} />
        <Button title="Settings" color="#4F8EF7" onPress={() => navigation.navigate('Settings')} />
      </View>
      <Text style={styles.hint}>Reps recorded: {detector.getReps().length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#181A20' },
  title: { fontSize: 24, fontWeight: '700', color: '#4F8EF7', marginBottom: 8 },
  preview: { height: 240, marginTop: 12, marginBottom: 12, borderRadius: 16, overflow: 'hidden', backgroundColor: '#23272F', shadowColor: '#4F8EF7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
  previewPlaceholder: { flex: 1 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  hint: { marginTop: 12, color: '#FF6F61', fontWeight: '600' },
});

export default CameraScreen;
