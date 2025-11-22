import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { poseEngine } from '../ai/poseEngine';
import RepDetector from '../ai/repDetector';
import LandmarkOverlay from '../components/LandmarkOverlay';
import formRating from '../modules/formRating';

const detector = new RepDetector();

const CameraScreen: React.FC = ({ navigation }: any) => {
  const [running, setRunning] = useState(false);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [lastFrame, setLastFrame] = useState<any>(null);

  useEffect(() => {
    const unsub = poseEngine.subscribe((frame) => {
      setLastFrame(frame);
      detector.onFrame(frame);
      setLandmarks(frame.keypoints || []);
    });
    return () => unsub();
  }, []);

  function start() {
    formRating.startSession({ camera: 'front', live: true }).then(() => setRunning(true));
  }

  function stop() {
    formRating.stopSession().then(() => setRunning(false));
    const reps = detector.getReps();
    navigation.navigate('Results', { reps });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Workout</Text>
      <View style={styles.preview}>
        <View style={styles.previewPlaceholder} />
        <LandmarkOverlay landmarks={landmarks} width={360} height={240} />
      </View>

      <View style={styles.controls}>
        {!running ? <Button title="Start" onPress={start} /> : <Button title="Stop" onPress={stop} />}
        <Button title="History" onPress={() => navigation.navigate('History')} />
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      </View>
      <Text style={styles.hint}>Reps recorded: {detector.getReps().length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700' },
  preview: { height: 240, marginTop: 12, marginBottom: 12, borderRadius: 8, overflow: 'hidden', backgroundColor: '#111' },
  previewPlaceholder: { flex: 1 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  hint: { marginTop: 12, color: '#666' },
});

export default CameraScreen;
