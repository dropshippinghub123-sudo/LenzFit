import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

export type Landmark = { x: number; y: number; confidence: number; name?: string };
export type Breakdown = { posture: number; range: number; tempo: number; alignment: number };
export type FormRatingResult = { score: number; breakdown: Breakdown; landmarks: Landmark[] };

const Native = (NativeModules as any).FormRating;
const emitter = Native ? new NativeEventEmitter(Native) : null;

type LandmarksCallback = (landmarks: Landmark[]) => void;
type FeedbackCallback = (feedback: any) => void;

let landmarksListener: any = null;
let feedbackListener: any = null;

const stubResult: FormRatingResult = {
  score: 85,
  breakdown: { posture: 88, range: 79, tempo: 90, alignment: 83 },
  landmarks: [
    { name: 'nose', x: 0.5, y: 0.2, confidence: 0.95 },
    { name: 'left_shoulder', x: 0.45, y: 0.35, confidence: 0.93 },
    { name: 'right_shoulder', x: 0.55, y: 0.35, confidence: 0.92 },
  ],
};

export async function startSession(options?: any): Promise<void> {
  if (Native && Native.startSession) {
    return Native.startSession(options);
  }
  return Promise.resolve();
}

export async function stopSession(): Promise<void> {
  if (Native && Native.stopSession) {
    return Native.stopSession();
  }
  return Promise.resolve();
}

/**
 * Process a single frame (base64-encoded) or return a stub result when native module isn't available.
 */
export async function processFrame(base64Image?: string): Promise<FormRatingResult> {
  if (Native && Native.processFrame) {
    return Native.processFrame(base64Image);
  }
  // Return a stubbed result so the UI can be iterated without native implementation.
  return Promise.resolve(stubResult);
}

export function subscribeLandmarks(cb: LandmarksCallback) {
  if (!emitter) return () => {};
  landmarksListener = emitter.addListener('onLandmarksUpdate', (body: any) => {
    cb(body.landmarks || []);
  });
  return () => {
    if (landmarksListener) {
      landmarksListener.remove();
      landmarksListener = null;
    }
  };
}

export function subscribeFormFeedback(cb: FeedbackCallback) {
  if (!emitter) return () => {};
  feedbackListener = emitter.addListener('onFormFeedback', (body: any) => {
    cb(body || {});
  });
  return () => {
    if (feedbackListener) {
      feedbackListener.remove();
      feedbackListener = null;
    }
  };
}

export default {
  startSession,
  stopSession,
  processFrame,
  subscribeLandmarks,
  subscribeFormFeedback,
};

