# FormRatingBridge (iOS)

This folder contains a skeleton for the iOS native module that will perform pose detection and form scoring using Core ML and Vision.

Planned contents and steps:

1. Add a Core ML pose model (MoveNet or an equivalent) into `ios/Models`.
2. Implement a Swift native module that:
   - opens an `AVCaptureSession` or accepts frames from a camera component,
   - runs the Core ML model (via `VNCoreMLRequest` / `VNCoreMLModel`) to get landmarks,
   - computes per-frame metrics (angles, alignment) and aggregates into a score,
   - emits events to JS (`RCTEventEmitter`) with landmark updates and final `FormRatingResult`.
3. Expose the following JS-facing API via `NativeModules`:
   - `startSession(options)`
   - `stopSession()`
   - `processFrame(base64Image)` (for uploaded videos)

4. Model placement and automatic loading

- Place a converted Core ML model in `ios/Models/` named `MoveNet.mlmodel` (or the compiled `MoveNet.mlmodelc`).
- During `startSession` the native module will attempt to load `MoveNet` from the app bundle and prefer it for inference. If not present, it will fallback to Vision's `VNDetectHumanBodyPoseRequest`.

See `docs/convert_movenet.md` and `tools/convert_movenet_to_coreml.py` for automated conversion instructions.

Notes:
- Testing requires a physical iOS device for camera + real-time performance checks.
- Consider using `react-native-vision-camera` for easier frame streaming into native code.
