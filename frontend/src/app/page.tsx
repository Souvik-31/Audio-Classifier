"use client";

import Link from "next/link";
import { useState } from "react";
import ColorScale from "~/components/ColorScale";
import FeatureMap from "~/components/FeatureMap";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import Waveform from "~/components/Waveform";

interface Prediction {
  class: string;
  confidence: number;
}

interface LayerData {
  shape: number[];
  values: number[][];
}

interface VisualizationData {
  [layerName: string]: LayerData;
}

interface WaveformData {
  values: number[];
  sample_rate: number;
  duration: number;
}

interface ApiResponse {
  predictions: Prediction[];
  visualization: VisualizationData;
  input_spectrogram: LayerData;
  waveform: WaveformData;
}

const ESC50_EMOJI_MAP: Record<string, string> = {
  dog: "🐕",
  rain: "🌧️",
  crying_baby: "👶",
  door_wood_knock: "🚪",
  helicopter: "🚁",
  rooster: "🐓",
  sea_waves: "🌊",
  sneezing: "🤧",
  mouse_click: "🖱️",
  chainsaw: "🪚",
  pig: "🐷",
  crackling_fire: "🔥",
  clapping: "👏",
  keyboard_typing: "⌨️",
  siren: "🚨",
  cow: "🐄",
  crickets: "🦗",
  breathing: "💨",
  door_wood_creaks: "🚪",
  car_horn: "📯",
  frog: "🐸",
  chirping_birds: "🐦",
  coughing: "😷",
  can_opening: "🥫",
  engine: "🚗",
  cat: "🐱",
  water_drops: "💧",
  footsteps: "👣",
  washing_machine: "🧺",
  train: "🚂",
  hen: "🐔",
  wind: "💨",
  laughing: "😂",
  vacuum_cleaner: "🧹",
  church_bells: "🔔",
  insects: "🦟",
  pouring_water: "🚰",
  brushing_teeth: "🪥",
  clock_alarm: "⏰",
  airplane: "✈️",
  sheep: "🐑",
  toilet_flush: "🚽",
  snoring: "😴",
  clock_tick: "⏱️",
  fireworks: "🎆",
  crow: "🐦‍⬛",
  thunderstorm: "⛈️",
  drinking_sipping: "🥤",
  glass_breaking: "🔨",
  hand_saw: "🪚",
};

const getEmojiForClass = (className: string) =>
  ESC50_EMOJI_MAP[className] || "🔈";


function splitLayers(visualization: VisualizationData) {
  const main: [string, LayerData][] = [];
  const internals: Record<string, [string, LayerData][]> = {};

  for (const [name, data] of Object.entries(visualization)) {
    if (!name.includes(".")) {
      main.push([name, data]);
    } else {
      const parts = name.split(".");
      const parent = parts[0];

      if (!parent) continue; // 🔑 type guard

      if (!internals[parent]) {
        internals[parent] = [];
      }

      internals[parent].push([name, data]);
    }
  }

  return { main, internals };
}


export default function HomePage() {
  const [vizData, setVizData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setVizData(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const response = await fetch("inference_url_here", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_data: base64String }),
        });

        if (!response.ok) throw new Error(response.statusText);
        setVizData(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
  };

  const { main, internals } = vizData
    ? splitLayers(vizData.visualization)
    : { main: [], internals: {} };

  return (
    <main className="relative min-h-screen bg-linear-to-br from-[#FAF7F2] via-[#F4ECE3] to-[#EFE2D7] p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(107,29,29,0.15),transparent_60%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* HERO */}
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-5xl font-light tracking-tight text-[#4A1212]">
            CNN Audio Visualizer
          </h1>
          <p className="mx-auto max-w-xl text-stone-600">
            Upload a WAV file to explore deep learning predictions and feature
            maps
          </p>

          <div className="mt-10 flex flex-col items-center">
            <div className="relative">
              <input
                type="file"
                accept=".wav"
                onChange={handleFileChange}
                disabled={isLoading}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <Button
                size="lg"
                disabled={isLoading}
                className="
                  bg-linear-to-r from-[#6B1D1D] to-[#8A2A2A]
                  text-[#FAF7F2]
                  shadow-xl
                  border border-[#6B1D1D]/20
                  hover:from-[#8A2A2A] hover:to-[#6B1D1D]
                "
              >
                {isLoading ? "Analysing..." : "Choose WAV File"}
              </Button>
            </div>

            {fileName && (
              <Badge className="mt-4 bg-[#E8D6D0] text-[#6B1D1D]">
                {fileName}
              </Badge>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <Card className="mb-8 border-red-300 bg-red-50">
            <CardContent className="text-red-700">
              Error: {error}
            </CardContent>
          </Card>
        )}

        {/* RESULTS */}
        {vizData && (
          <div className="space-y-10">
            {/* PREDICTIONS */}
            <Card className="rounded-2xl bg-white/70 backdrop-blur shadow-xl border border-[#6B1D1D]/10">
              <CardHeader>
                <CardTitle className="text-[#4A1212]">
                  Top Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vizData.predictions.slice(0, 3).map((p, i) => (
                  <div key={p.class} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-700 font-medium">
                        {getEmojiForClass(p.class)}{" "}
                        {p.class.replaceAll("_", " ")}
                      </span>
                      <Badge
                        className={
                          i === 0
                            ? "bg-[#6B1D1D] text-[#FAF7F2]"
                            : "bg-[#E8D6D0] text-[#6B1D1D]"
                        }
                      >
                        {(p.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress
                      value={p.confidence * 100}
                      className="h-2 bg-[#E8D6D0] [&>div]:bg-[#6B1D1D]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* VISUALS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-2xl bg-white/70 backdrop-blur shadow-xl border border-[#6B1D1D]/10">
                <CardHeader>
                  <CardTitle className="text-[#4A1212]">
                    Input Spectrogram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeatureMap
                    data={vizData.input_spectrogram.values}
                    title={vizData.input_spectrogram.shape.join(" × ")}
                    spectrogram
                  />
                  <div className="mt-4 flex justify-end">
                    <ColorScale width={200} height={16} min={-1} max={1} />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-white/70 backdrop-blur shadow-xl border border-[#6B1D1D]/10">
                <CardHeader>
                  <CardTitle className="text-[#4A1212]">
                    Audio Waveform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Waveform
                    data={vizData.waveform.values}
                    title={`${vizData.waveform.duration.toFixed(
                      2,
                    )}s · ${vizData.waveform.sample_rate}Hz`}
                  />
                </CardContent>
              </Card>
            </div>

            {/* FEATURE MAPS */}
            <Card className="rounded-2xl bg-white/70 backdrop-blur shadow-xl border border-[#6B1D1D]/10">
              <CardHeader>
                <CardTitle className="text-[#4A1212]">
                  Convolutional Layer Outputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  {main.map(([name, data]) => (
                    <div key={name} className="space-y-4">
                      <h4 className="font-medium text-stone-700">{name}</h4>
                      <FeatureMap
                        data={data.values}
                        title={data.shape.join(" × ")}
                      />

                      {internals[name] && (
                        <div className="h-80 overflow-y-auto rounded-xl bg-[#FAF7F2] border border-[#6B1D1D]/10 p-2 space-y-2">
                          {internals[name]
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([lname, ldata]) => (
                              <FeatureMap
                                key={lname}
                                data={ldata.values}
                                title={lname.replace(`${name}.`, "")}
                                internal
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <ColorScale width={200} height={16} min={-1} max={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
