'use client';

import { FC, FormEvent, useState } from "react";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      onStatus?.("Uploading and transcribing...");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

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