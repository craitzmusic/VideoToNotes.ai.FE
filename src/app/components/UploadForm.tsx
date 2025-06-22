'use client';

import { FC, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

interface UploadFormProps {
  onResult?: (text: string, summary: string) => void;
  onStatus?: (status: string) => void;
}

const UploadForm: FC<UploadFormProps> = ({
  onResult,
  onStatus,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [provider, setProvider] = useState<string>("openai");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      onStatus?.("Uploading and transcribing...");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcribe?provider=${provider}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${session?.accessToken || ""}`,
          },
        }
      );

      if (!response.ok) throw new Error("Server error");

      const data: { text: string; summary: string } = await response.json();

      onResult?.(data.text, data.summary);
      onStatus?.("Transcription completed!");
    } catch (error) {
      console.error(error);
      onStatus?.("Error during upload or transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Upload a File</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
      <select
        value={provider}
        onChange={e => setProvider(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
      >
        <option value="openai">OpenAI</option>
        <option value="t5">T5</option>
      </select>

      <input
        type="file"
        accept="audio/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-gray-700"
      />

      <button
        type="submit"
        disabled={!file || isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Uploading..." : "Transcribe"}
      </button>
    </form>
  );
};

export default UploadForm;