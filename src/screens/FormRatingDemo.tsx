import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, LayoutChangeEvent } from 'react-native';
import formRating, { FormRatingResult } from '../modules/formRating';
import scorer from '../modules/formScorer';
import LandmarkOverlay from '../components/LandmarkOverlay';

const FormRatingDemo: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<FormRatingResult | null>(null);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 1, height: 1 });
  const unsubRef = useRef<() => void | null>(null);

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  }

  useEffect(() => {
    // subscribe to landmarks events
    const unsub = formRating.subscribeLandmarks((lm) => {
      setLandmarks(lm || []);
      const computed = scorer.computeFormRating(lm || []);
      setResult(computed);
    });
    unsubRef.current = unsub;

    return () => {
      if (unsubRef.current) unsubRef.current();
      formRating.stopSession().catch(() => {});
    };
  }, []);

  async function handleStart() {
    await formRating.startSession({ camera: 'front', live: true });
    setRunning(true);
  }

  async function handleStop() {
    await formRating.stopSession();
    setRunning(false);
  }

  async function handleRunDemoFrame() {
    const r = await formRating.processFrame();
    setResult(r);
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.title}>Form Rating Demo (iOS)</Text>

      <View style={styles.controls}>
        {!running ? (
          <Button title="Start Session" onPress={handleStart} />
        ) : (
          <Button title="Stop Session" onPress={handleStop} />
        )}
        <View style={styles.buttonSpacer} />
        <Button title="Run Demo Frame" onPress={handleRunDemoFrame} />
      </View>

      <View style={styles.preview}>
        {/* This is a placeholder for the camera preview. Real camera preview should be added later. */}
        <View style={styles.previewPlaceholder} />
        <LandmarkOverlay landmarks={landmarks} width={containerSize.width} height={containerSize.height} />
      </View>

      {result ? (
        <ScrollView style={styles.result}>
          <Text style={styles.score}>Score: {result.score}/100</Text>
          <Text style={styles.sub}>Breakdown:</Text>
          <Text>Posture: {result.breakdown.posture}</Text>
          <Text>Range: {result.breakdown.range}</Text>
          <Text>Tempo: {result.breakdown.tempo}</Text>
          <Text>Alignment: {result.breakdown.alignment}</Text>
          <Text style={styles.sub}>Landmarks (sample):</Text>
          {result.landmarks.map((l, i) => (
            <Text key={i}>
              {l.name || i}: {l.x.toFixed(2)}, {l.y.toFixed(2)} (c:{l.confidence.toFixed(2)})
            </Text>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.hint}>No result yet — press Run Demo Frame.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  buttonSpacer: { width: 12 },
  result: { marginTop: 12 },
  score: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  sub: { fontWeight: '600', marginTop: 8 },
  hint: { color: '#666' },
  preview: { height: 240, backgroundColor: '#000', marginBottom: 12, borderRadius: 8, overflow: 'hidden' },
  previewPlaceholder: { flex: 1, backgroundColor: '#111' },
});

export default FormRatingDemo;
