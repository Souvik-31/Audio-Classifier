# Audio-Classifier

A full-stack audio classification system that takes raw audio input, converts it into spectrograms, and performs deep learning inference using a ResNet-style CNN.
The backend is powered by PyTorch and can be deployed on [Modal](https://modal.com/) with GPU acceleration, while the frontend is built using the T3 Stack (Next.js, TypeScript, Tailwind CSS) for a modern, responsive user experience.

- **Primary languages**: Python, TypeScript
- **Use cases**: Environmental sound classification, speech command detection, bird call classification, and other audio-labeling tasks.

## Overview

This project demonstrates a complete machine learning pipeline:
- **Architecture**: A ResNet-style audio CNN with residual blocks, optimized for sound classification.
- **Data Pipeline**: Automatic download and preprocessing of the [ESC-50 dataset](https://github.com/karolpiczak/ESC-50).
- **Spectrograms**: Conversion of raw audio into Mel spectrograms (audio → image) using `torchaudio`.
- **Augmentation**: Implementation of Mixup and SpecAugment (time/frequency masking) for robust training.
- **Training**: Optimized with AdamW and OneCycleLR scheduler, featuring TensorBoard integration.
- **Deployment**: Serverless GPU inference and training via Modal, exposing a FastAPI endpoint.
- **Dashboard**: A Next.js application to upload audio, visualize waveforms/spectrograms, and inspect internal CNN feature maps.

## Tech Stack

- **Backend**: Python 3.12, PyTorch, Torchaudio, Librosa, FastAPI, Pydantic.
- **Infrastructure**: Modal (Serverless GPU).
- **Frontend**: Next.js (TypeScript), React, Tailwind CSS, Shadcn UI.
- **Monitoring**: TensorBoard for training analysis.

## Project Structure

```text
.
├── main.py              # Modal app for Inference & FastAPI endpoint
├── model.py             # AudioCNN architecture (ResNet-style)
├── train.py             # Modal app for Training & Dataset handling
├── requirements.txt     # Python dependencies
├── frontend/            # Next.js dashboard
└── README.md            # You are here
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Souvik-31/Audio-Classifier.git
cd Audio-Classifier
```

### 2. Backend Setup (Python)

It is recommended to use Python 3.12 and a virtual environment.

```bash
# Create and activate a venv
python -m venv venv
# macOS / Linux
source venv/bin/activate
# Windows
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 3. Modal Setup (Optional for Local, Required for GPU)

This project uses [Modal](https://modal.com/) for effortless GPU training and deployment.

```bash
pip install modal
modal setup
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

### Training the Model

The `train.py` script handles dataset downloading (ESC-50), preprocessing, and training. It's designed to run on Modal for GPU acceleration.

```bash
# Run training on Modal
modal run train.py
```

Training results and the best model (`best_model.pth`) will be saved to a Modal Volume.

### Running Inference

The `main.py` script serves the model via a FastAPI endpoint and supports local testing.

**Local Testing:**
```bash
# Test inference locally using an audio file
modal run main.py
```

**Deploy as a Web Endpoint:**
```bash
# Deploy to Modal as a persistent API
modal deploy main.py
```

### Frontend Dashboard

The dashboard allows you to:
1. **Upload**: Drag and drop audio files (WAV, MP3, etc.).
2. **Visualize**: See the raw Waveform and the generated Mel Spectrogram.
3. **Analyze**: View predictions with confidence scores and explore internal CNN activations (feature maps).

## Contributing

Contributions are welcome! Please feel free to open issues or PRs.

## License

This project is licensed under the MIT License.

## Acknowledgements

- **Dataset**: [ESC-50: Dataset for Environmental Sound Classification](https://github.com/karolpiczak/ESC-50).
- **Inspiration**: T3 Stack and Modal community.
