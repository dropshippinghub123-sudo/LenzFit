# Converting MoveNet (TFLite) to Core ML

This guide walks through converting a MoveNet TFLite model to a Core ML `.mlmodel` that the iOS native module will detect and use.

Prerequisites
- macOS with Python 3 (preferably in a virtualenv)
- Xcode installed
- `pip` available

Recommended Python environment setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install tflite2onnx coremltools onnx
```

Conversion steps (automated)

1. Place your MoveNet `.tflite` file somewhere accessible, e.g. `~/Downloads/movenet_lightning.tflite`.
2. Run the helper script in the repo to convert and save the `.mlmodel` into `ios/Models`:

```bash
python3 tools/convert_movenet_to_coreml.py --tflite ~/Downloads/movenet_lightning.tflite
```

3. Verify the produced file `ios/Models/MoveNet.mlmodel` exists. If you instead get a compiled `MoveNet.mlmodelc`, that's fine as well.
4. Open `ios/LenzFit.xcworkspace` in Xcode and add the `.mlmodel` to your app target (drag into Xcode; make sure the target checkbox is enabled).

Manual steps / troubleshooting
- If `tflite2onnx` fails for this specific TFLite, try converting via TensorFlow SavedModel -> ONNX or inspect the TFLite ops used. Some TFLite models require custom handling.
- If `coremltools` conversion fails on your machine, consult the coremltools docs. On Apple Silicon, use the latest coremltools and compatible Python versions.
- After adding the `.mlmodel`, rebuild the app and the native module will attempt to load it automatically.

Testing on device
- Run the app on a real iOS device (camera + model inference require a device). Start the `FormRatingDemo` screen, tap Start Session, and the native module will prefer the bundled Core ML model (if available) and emit landmarks via `onLandmarksUpdate`.
