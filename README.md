# Audio-Classifier

A full-stack audio classification system that takes raw audio input, converts it into spectrograms, and performs deep learning inference using a ResNet-style CNN.
The backend is deployed on Modal with GPU acceleration, while the frontend is built using the T3 Stack for a modern, responsive user experience.

This README explains the project goals, core features, how to set up the project locally, and how to run training, inference, and the dashboard.

- Primary languages: Python, TypeScript
- Use cases: environmental sound classification, speech command detection, bird call classification, and other audio-labeling tasks

## Overview

In the accompanying video/tutorial you will:
- Train a ResNet-style audio CNN to classify sound events (e.g., dog bark, bird chirp).
- Convert audio into Mel spectrograms (audio → image) as model input.
- Use data augmentation like Mixup and SpecAugment (time/frequency masking).
- Optimize training with AdamW and OneCycleLR, and stabilize with BatchNorm.
- Deploy serverless GPU inference (Modal) and expose a FastAPI endpoint.
- Build a Next.js dashboard to upload audio, visualize waveforms/spectrograms, and inspect intermediate CNN feature maps.

All services and techniques used in the tutorial are free for you to use.

## Features

- Deep Audio CNN for sound classification  
- ResNet-style architecture with residual blocks  
- Mel Spectrogram audio-to-image conversion  
- Data augmentation with Mixup & Time/Frequency Masking (SpecAugment)  
- Serverless GPU inference with Modal  
- Interactive Next.js & React dashboard  
- Visualization of internal CNN feature maps  
- Real-time audio classification with confidence scores  
- Waveform and Spectrogram visualization  
- FastAPI inference endpoint  
- Optimized training with AdamW & OneCycleLR scheduler  
- TensorBoard integration for training analysis  
- Batch Normalization for stable & fast training  
- Modern UI with Tailwind CSS & Shadcn UI  
- Pydantic data validation for robust API requests

## Tech Stack

- Python 3.12 (recommended), PyTorch, Torchaudio, Librosa, NumPy, SciPy  
- FastAPI for model serving  
- Modal for serverless GPU inference (optional)  
- Next.js (TypeScript), React, Tailwind CSS, Shadcn UI for the dashboard  
- TensorBoard for training logs/visualization

## Setup

These steps will get the project running locally. Some commands assume the repository uses the `backend/` and `frontend/` folders — if your layout differs, adjust paths accordingly.

### Clone the repo

```bash
git clone https://github.com/Souvik-31/Audio-Classifier.git
cd Audio-Classifier
```

### Install Python & create a virtual environment

- Install Python (3.12 recommended). See: https://www.python.org/downloads/
- Create and activate a venv:

```bash
python3.12 -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

### Backend (Python) setup

Install Python dependencies:

```bash
pip install -r ../requirements.txt
# or if requirements.txt is in root:
# pip install -r requirements.txt
```

Common backend scripts:
- preprocess.py — prepare raw audio into spectrograms / features
- train.py — run training loop, saves checkpoints to ./checkpoints
- inference.py — local inference from a checkpoint
- api_server.py — FastAPI app exposing /predict

Example: preprocess audio

```bash
python preprocess.py --input-folder ../data/raw --output-folder ../data/processed --sample-rate 16000 --n-mels 64
```

Example: train

```bash
python train.py --data ../data/processed --epochs 50 --batch-size 32 --lr 1e-3 --model resnet18
```

Example: local inference

```bash
python inference.py --model ./checkpoints/best.pt --file ../data/test/example.wav
```

### Modal (optional serverless GPU) setup

Modal is used for serverless GPU inference in the tutorial; you can skip this if you only want local inference.

- Install and log in to Modal (follow Modal docs if needed)
- Commands used in the tutorial:

```bash
# set up modal environment (first time)
modal setup

# run the service locally on Modal
modal run main.py

# deploy to Modal
modal deploy main.py
```

Replace `main.py` with your Modal entrypoint if different (commonly in backend/).

### Frontend setup

Open a new terminal, install frontend deps and run dev server:

```bash
cd frontend
npm install
npm run dev
# or
# yarn
# yarn dev
```

Open the dashboard at http://localhost:3000 (or the port printed by Next.js). The UI supports:
- Uploading audio files for inference
- Visualizing waveform and Mel spectrogram
- Showing predicted label and confidence
- Viewing internal CNN feature maps (activation visualizations)

## Usage

- Train a model with `train.py` and examine logs in TensorBoard:
  ```bash
  tensorboard --logdir runs
  ```
- Start the FastAPI inference server:
  ```bash
  python api_server.py --host 0.0.0.0 --port 8000 --model ./checkpoints/best.pt
  ```
- Use the dashboard to call the API or call the API directly:
  ```bash
  curl -F "file=@example.wav" http://localhost:8000/predict
  # -> {"label":"dog_bark", "scores": {"dog_bark": 0.93, "car_horn": 0.04, ...}}
  ```



## Contributing

Contributions welcome! When opening issues or PRs, include:
- Problem statement / feature request
- Steps to reproduce (for bugs)
- Tests or example usage
- Expected vs actual behavior

Please follow the repository's style and add docs or update this README when adding features.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Dataset: https://github.com/karolpiczak/ESC-50

## Contact

Maintainer: Souvik-31 (GitHub)  
If you have questions, open an issue in this repository.
