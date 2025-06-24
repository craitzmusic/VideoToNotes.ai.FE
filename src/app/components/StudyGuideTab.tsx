import { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import Spinner from './Spinner';

interface StudyGuideTabProps {
  transcription?: string;
}

/**
 * StudyGuideTab component allows the user to generate a professional study guide PDF
 * from the transcript using the backend AI-powered endpoint. Handles loading, error,
 * and triggers the download of the generated PDF.
 */
const StudyGuideTab: FC<StudyGuideTabProps> = ({ transcription }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles the PDF generation and download
  const handleGeneratePDF = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!transcription) {
        setError('No transcript available.');
        setLoading(false);
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_study_guide_pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ transcript: transcription, title: 'Study Guide' })
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'study_guide.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors mb-4"
        onClick={handleGeneratePDF}
        disabled={loading}
        type="button"
      >
        {loading ? 'Generating PDF...' : 'Generate Study Guide PDF'}
      </button>
      {loading && <Spinner />}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <p className="text-gray-500 text-sm mt-2 text-center">
        This will generate a professional study guide PDF, structured in topics with quizzes, based on your transcript.
      </p>
    </div>
  );
};

export default StudyGuideTab; 