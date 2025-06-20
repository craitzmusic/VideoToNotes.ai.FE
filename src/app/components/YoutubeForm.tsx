'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import { VideoMetadataProps } from "./VideoMetadata";

interface YoutubeFormProps {
  onResult?: (text: string, summary: string, metadata?: VideoMetadataProps) => void;
  onStatus?: (status: string) => void;
}

export default function YoutubeForm({
  onResult,
  onStatus,
}: YoutubeFormProps) {
  const { data: session } = useSession();
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<string>("openai");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!url) return;

    try {
      onResult?.("", "", undefined);
      setIsLoading(true);
      onStatus?.("Downloading and transcribing video...");

      const res = await fetch("http://localhost:8000/transcribe_youtube", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ 
            url,
            provider
         }),
      });

      if (!res.ok) throw new Error("Server error");

      const data: { text: string; summary: string; metadata: VideoMetadataProps } = await res.json();

      console.log("🎥 YouTube response:", data);

      onStatus?.("Transcription completed!");
      onResult?.(data.text, data.summary, data.metadata);
    } catch (err) {
      console.error(err);
      onStatus?.("Error during YouTube transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Paste YouTube Link</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
      <select
        value={provider}
        onChange={e => setProvider(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
      >
        <option value="openai">OpenAI</option>
        <option value="t5">T5</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="youtube-url">URL</label>
      <input
        type="url"
        id="youtube-url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        required
      />

      <button
        type="submit"
        disabled={!session?.accessToken || isLoading || !url}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Transcribe YouTube Video"}
      </button>
    </form>
  );
}