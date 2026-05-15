# Audio Classifier Dashboard

The frontend for the Audio Classifier project, built with the [T3 Stack](https://create.t3.gg/) (Next.js, TypeScript, Tailwind CSS).

## Features

- **Audio Upload**: Drag and drop or select audio files for classification.
- **Waveform Visualization**: Interactive view of the raw audio signal.
- **Spectrogram View**: Visual representation of the audio frequencies over time.
- **Feature Map Exploration**: Deep dive into the CNN's internal activations.
- **Confidence Scores**: Real-time predictions from the PyTorch model.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Configuration

The frontend communicates with the backend API (deployed on Modal or running locally). Ensure the API endpoint is correctly configured in your environment if necessary.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com)
- **Language**: [TypeScript](https://www.typescriptlang.org)

## Learn More

This dashboard is part of the [Audio-Classifier](..) project. Refer to the root README for backend and training instructions.
