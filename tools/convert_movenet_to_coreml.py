"""
convert_movenet_to_coreml.py

Simple helper script to convert a MoveNet TFLite model into a Core ML `.mlmodel` and
place it into `ios/Models/MoveNet.mlmodel`.

Notes:
- This script uses `tflite2onnx` to convert a TFLite model to ONNX, and `coremltools`
  to convert ONNX to Core ML. You will need a local Python environment with the
  required packages installed.
- This is provided as an automation helper; conversions sometimes require
  manual adjustments depending on the concrete model. If the conversion fails,
  follow the manual steps in `docs/convert_movenet.md`.

Usage (example):
  python3 tools/convert_movenet_to_coreml.py --tflite /path/to/movenet_lightning.tflite

Requirements (install in a venv):
  pip install -U tflite2onnx coremltools onnx

On Apple Silicon macs, installing coremltools may require specific Python/C dependencies.
See https://coremltools.readme.io/ for troubleshooting.
"""

import argparse
import os
import subprocess
import sys

def run(cmd):
    print('> ' + ' '.join(cmd))
    subprocess.check_call(cmd)


def main():
    parser = argparse.ArgumentParser(description='Convert MoveNet TFLite -> ONNX -> CoreML')
    parser.add_argument('--tflite', required=True, help='Path to the MoveNet .tflite file')
    parser.add_argument('--output-dir', default='ios/Models', help='Output directory for the .mlmodel')
    parser.add_argument('--name', default='MoveNet', help='Base name for the model files')
    args = parser.parse_args()

    tflite_path = os.path.abspath(args.tflite)
    if not os.path.exists(tflite_path):
        print('TFLite model not found at', tflite_path)
        sys.exit(2)

    os.makedirs(args.output_dir, exist_ok=True)
    onnx_path = os.path.join(args.output_dir, args.name + '.onnx')
    mlmodel_path = os.path.join(args.output_dir, args.name + '.mlmodel')

    # Step 1: TFLite -> ONNX using tflite2onnx
    print('\nConverting TFLite -> ONNX...')
    run([sys.executable, '-m', 'tflite2onnx', '--model', tflite_path, '--output', onnx_path])

    # Step 2: ONNX -> Core ML using coremltools
    print('\nConverting ONNX -> Core ML (.mlmodel)...')
    try:
        import coremltools as ct
        import onnx
    except Exception as e:
        print('Error importing coremltools or onnx:', e)
        print('Make sure to `pip install coremltools onnx` in a Python environment.');
        sys.exit(3)

    print('Loading ONNX model from', onnx_path)
    onnx_model = onnx.load(onnx_path)

    print('Converting ONNX model to Core ML...')
    mlmodel = ct.converters.onnx.convert(onnx_model)

    print('Saving Core ML model to', mlmodel_path)
    mlmodel.save(mlmodel_path)

    print('\nConversion complete. Add the generated .mlmodel to your Xcode target (ios/Models).')


if __name__ == '__main__':
    main()
