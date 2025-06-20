'use client';

import { FC } from 'react';

export interface VideoMetadataProps {
  metadata?: {
    title?: string;
    duration?: number;
    upload_date?: string;
    description?: string;
    [key: string]: any;
  };
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatDate = (raw?: string): string => {
  if (!raw || raw.length !== 8) return '';
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  return `${day}/${month}/${year}`;
};

const VideoMetadata: FC<VideoMetadataProps> = ({ metadata }) => {
  if (!metadata) return null;

  console.log("🔍 VideoMetadata received:", metadata);

  const { title, duration, upload_date, description } = metadata;

  return (
    <div className="bg-white border rounded-md p-4 shadow space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Video Metadata</h2>
      {title && (
        <p>
          <span className="font-medium">Title:</span> {title}
        </p>
      )}
      {duration && (
        <p>
          <span className="font-medium">Duration:</span> {formatDuration(duration)}
        </p>
      )}
      {upload_date && (
        <p>
          <span className="font-medium">Uploaded on:</span> {formatDate(upload_date)}
        </p>
      )}
      {description && (
        <div>
          <p className="font-medium">Description:</p>
          <div className="whitespace-pre-line text-gray-700 text-sm bg-gray-50 border rounded p-2 mt-1">
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMetadata;