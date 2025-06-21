'use client';

import { useState, useRef } from 'react';
import Header from './components/Header';
import ResultSection from './components/ResultSection';
import Spinner from "./components/Spinner";
import UploadForm from './components/UploadForm';
import { VideoMetadataFields, VideoMetadataProps } from "./components/VideoMetadata";
import YoutubeForm from './components/YoutubeForm';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [metadata, setMetadata] = useState<VideoMetadataFields | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleResult = (
    text: string,
    summaryText: string,
    metadataObj?: VideoMetadataProps
  ) => {
    console.log("📦 Received from form:", { text, summaryText, metadata: metadataObj });
    setTranscription(text);
    setSummary(summaryText);
    setMetadata(metadataObj?.metadata ?? null);
  };

  const handleStatus = (message: string) => {
    if (message.toLowerCase().includes("transcribing") || message.toLowerCase().includes("downloading")) {
      setIsLoading(true);
      setElapsedTime(0);      
      startTimeRef.current = Date.now();

      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1); // Atualiza a cada 100ms
      }, 100);
  
      setTimerInterval(interval);
      setStatus(message);
    } else if (message.toLowerCase().includes("completed")) {
      setIsLoading(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      const endTime = Date.now();
      const seconds = ((endTime - startTimeRef.current) / 1000).toFixed(1);
      setStatus(`Transcription completed in ${seconds} seconds`);
      return;
    } else if (message.toLowerCase().includes("error")) {
      setIsLoading(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }      
      setStatus(message);
    } else {
      setStatus(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center">VideoToNotes</h1>

        <UploadForm
          onResult={handleResult}
          onStatus={handleStatus}
        />

        <YoutubeForm
          onResult={handleResult}
          onStatus={handleStatus}
        />

        {isLoading && (
          <Spinner>
            <span className="text-sm text-gray-600 ml-2">
              ⏱️ {elapsedTime.toFixed(1)}s
            </span>
          </Spinner>
        )}

        {status && (
          <p className="text-center text-sm text-gray-600 italic">{status}</p>
        )}

        <ResultSection
          transcription={transcription}
          summary={summary}
          metadata={metadata ?? undefined}
        />
      </main>
    </div>
  );
}