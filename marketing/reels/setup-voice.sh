#!/usr/bin/env bash
# One-time (per session) setup of the free Kokoro voice engine (Apache 2.0): Python package + model files.
# Installs into marketing/reels/.voice (git-ignored). Safe to re-run.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)/.voice"
mkdir -p "$DIR"
[ -d "$DIR/lib/kokoro_onnx" ] || pip install -q --target "$DIR/lib" kokoro-onnx soundfile
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "$DIR/$f" ] || curl -sSL -o "$DIR/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"
done
echo "voice engine ready in $DIR"
