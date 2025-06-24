'use client';

import { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import StudyGuideTab from './StudyGuideTab';

// Props for the ResultSection component: receives transcription and summary text
interface ResultSectionProps {
  transcription?: string;
  summary?: string;
}

// Flashcard interface: represents a single flashcard with front and back text
interface Flashcard {
  front: string;
  back: string;
}

// StudyPlanTopic interface: represents a topic in the study plan with review dates and notes
interface StudyPlanTopic {
  topic: string;
  review_dates: string[];
  notes: string;
}

// StudyPlanData interface: represents the full study plan
interface StudyPlanData {
  plan: StudyPlanTopic[];
}

// Question interface: represents a multiple-choice question
interface Question {
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao?: string;
}

// Tab definitions for navigation
const TABS = [
  { key: 'transcription', label: 'Transcription' },
  { key: 'summary', label: 'Summary' },
  { key: 'questions', label: 'Questions' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'studyplan', label: 'Plano de Estudos' },
  { key: 'studyguidepdf', label: 'Study Guide PDF' },
];

// Main component to display results and interactive features after transcription
const ResultSection: FC<ResultSectionProps> = ({ transcription, summary }) => {
  // Check if there is any content to display
  const hasContent = transcription || summary;

  // State for tab navigation
  const [activeTab, setActiveTab] = useState<string>('transcription');

  // State and logic for questions generation and interaction
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [errorQuestions, setErrorQuestions] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | undefined }>({});
  const [showAnswers, setShowAnswers] = useState(false);

  // State and logic for flashcards generation and navigation
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [errorFlashcards, setErrorFlashcards] = useState<string | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardBack, setShowFlashcardBack] = useState(false);
  const [numFlashcards, setNumFlashcards] = useState(10);

  // State and logic for study plan generation
  const [studyPlanData, setStudyPlanData] = useState<StudyPlanData | null>(null);
  const [loadingStudyPlan, setLoadingStudyPlan] = useState(false);
  const [errorStudyPlan, setErrorStudyPlan] = useState<string | null>(null);

  // Get user session for authentication (used in API calls)
  const { data: session } = useSession();

  // Fetches questions from the backend based on the transcription/summary
  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    setQuestions([]);
    setErrorQuestions(null);
    setSelectedAnswers({});
    setShowAnswers(false);
    try {
      const text = transcription || summary;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ text, num_questions: numQuestions })
      });
      if (!res.ok) throw new Error('Failed to generate questions');
      const data = await res.json();
      setQuestions(data);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorQuestions(err.message);
      else setErrorQuestions('Failed to generate questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Handles answer selection for questions
  const handleSelectAnswer = (qIdx: number, altIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: altIdx }));
  };

  // Fetches flashcards from the backend based on the transcription/summary
  const handleGenerateFlashcards = async () => {
    setLoadingFlashcards(true);
    setErrorFlashcards(null);
    setFlashcards([]);
    setCurrentFlashcard(0);
    setShowFlashcardBack(false);
    try {
      const text = transcription || summary;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ text, num_flashcards: numFlashcards })
      });
      if (!res.ok) throw new Error('Failed to generate flashcards');
      const data = await res.json();
      setFlashcards(data);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorFlashcards(err.message);
      else setErrorFlashcards('Failed to generate flashcards');
    } finally {
      setLoadingFlashcards(false);
    }
  };

  // Shows the back of the current flashcard
  const handleShowFlashcardBack = () => setShowFlashcardBack(true);
  // Navigates to the previous flashcard
  const handlePrevFlashcard = () => {
    setCurrentFlashcard((prev) => Math.max(prev - 1, 0));
    setShowFlashcardBack(false);
  };
  // Navigates to the next flashcard
  const handleNextFlashcard = () => {
    setCurrentFlashcard((prev) => Math.min(prev + 1, flashcards.length - 1));
    setShowFlashcardBack(false);
  };

  // Fetches a study plan from the backend based on the transcription/summary
  const handleGenerateStudyPlan = async () => {
    setLoadingStudyPlan(true);
    setErrorStudyPlan(null);
    setStudyPlanData(null);
    try {
      const text = transcription || summary;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_studyplan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Failed to generate study plan');
      const data = await res.json();
      setStudyPlanData(data);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorStudyPlan(err.message);
      else setErrorStudyPlan('Failed to generate study plan');
    } finally {
      setLoadingStudyPlan(false);
    }
  };

  // If there is no content, render nothing
  if (!hasContent) return null;

  return (
    <section className="bg-white p-6 rounded shadow-md mt-6">
      {/* Tab navigation for switching between result types */}
      <div className="flex border-b mb-4 gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 -mb-px font-medium rounded-t transition-colors duration-200 focus:outline-none 
              ${activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50 font-bold shadow-sm'
                : 'border-b-2 border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-100'}
            `}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content rendering based on activeTab */}
      {activeTab === 'transcription' && (
        transcription ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Transcription</h2>
            <div className="max-h-60 overflow-y-auto whitespace-pre-wrap text-gray-800 border p-4 rounded bg-gray-50">
              {transcription}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">No transcription available.</div>
        )
      )}
      {activeTab === 'summary' && (
        summary ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <div className="whitespace-pre-wrap text-gray-700 border p-4 rounded bg-gray-100">
              {summary}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">No summary available.</div>
        )
      )}
      {activeTab === 'questions' && (
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Controls for generating questions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="num-questions" className="text-sm font-medium text-gray-700">Number of questions:</label>
            <select
              id="num-questions"
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
            >
              {[3, 5, 10].map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 font-semibold"
              disabled={!(transcription || summary) || loadingQuestions || !session?.accessToken}
              onClick={handleGenerateQuestions}
              type="button"
            >
              {loadingQuestions ? 'Generating...' : 'Generate questions from content'}
            </button>
          </div>
          {/* Display generated questions and answer selection */}
          <div className="w-full max-w-2xl mx-auto">
            {errorQuestions && (
              <div className="text-red-500 text-center mb-4">{errorQuestions}</div>
            )}
            {questions.length === 0 && !loadingQuestions && !errorQuestions && (
              <div className="text-gray-500 text-center">No questions generated yet.</div>
            )}
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white border rounded shadow p-4 mb-4">
                <div className="font-medium mb-2">{idx + 1}. {q.enunciado}</div>
                <ul className="space-y-2">
                  {q.alternativas.map((alt: string, i: number) => (
                    <li key={i}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={i}
                          checked={selectedAnswers[idx] === i}
                          onChange={() => handleSelectAnswer(idx, i)}
                          disabled={!!selectedAnswers[idx] || showAnswers}
                        />
                        <span>{alt}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {selectedAnswers[idx] !== undefined && (
                  <div className={`mt-2 text-sm font-semibold ${selectedAnswers[idx] === q.correta ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedAnswers[idx] === q.correta ? 'Correct!' : `Incorrect. Correct answer: ${q.alternativas[q.correta]}`}
                  </div>
                )}
                {selectedAnswers[idx] !== undefined && q.explicacao && (
                  <div className="mt-1 text-xs text-gray-600">{q.explicacao}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Controls for generating flashcards */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <label htmlFor="num-flashcards" className="text-sm font-medium text-gray-700">Number of flashcards:</label>
            <select
              id="num-flashcards"
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={numFlashcards}
              onChange={e => setNumFlashcards(Number(e.target.value))}
            >
              {[5, 10, 15].map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded font-semibold"
              onClick={handleGenerateFlashcards}
              type="button"
              disabled={loadingFlashcards || !(transcription || summary) || !session?.accessToken}
            >
              {loadingFlashcards ? 'Generating...' : 'Generate flashcards from content'}
            </button>
          </div>
          {/* Display generated flashcards and navigation */}
          <div className="w-full max-w-md mx-auto text-center">
            {errorFlashcards && (
              <div className="text-red-500 mb-4">{errorFlashcards}</div>
            )}
            {!loadingFlashcards && flashcards.length === 0 && !errorFlashcards && (
              <div className="text-gray-500">No flashcards generated yet.</div>
            )}
            {loadingFlashcards && (
              <div className="text-gray-500">Generating flashcards...</div>
            )}
            {flashcards.length > 0 && !loadingFlashcards && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white border rounded shadow p-6 w-full">
                  <div className="text-sm text-gray-500 mb-2">Flashcard {currentFlashcard + 1} of {flashcards.length}</div>
                  <div className="text-lg font-semibold min-h-[60px] flex items-center justify-center">
                    {!showFlashcardBack ? flashcards[currentFlashcard].front : flashcards[currentFlashcard].back}
                  </div>
                  {!showFlashcardBack && (
                    <button
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                      onClick={handleShowFlashcardBack}
                      type="button"
                    >
                      Show answer
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold disabled:opacity-50"
                    onClick={handlePrevFlashcard}
                    type="button"
                    disabled={currentFlashcard === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold disabled:opacity-50"
                    onClick={handleNextFlashcard}
                    type="button"
                    disabled={currentFlashcard === flashcards.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'studyplan' && (
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Button to generate study plan */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            onClick={handleGenerateStudyPlan}
            type="button"
            disabled={loadingStudyPlan || !(transcription || summary) || !session?.accessToken}
          >
            {loadingStudyPlan ? 'Gerando plano de estudos...' : 'Gerar Plano de Estudos'}
          </button>
          <div className="w-full">
            {errorStudyPlan && (
              <div className="text-red-500 text-center mb-4">{errorStudyPlan}</div>
            )}
            {studyPlanData && studyPlanData.plan.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Tópico</th>
                      <th className="px-4 py-2 border">Revisões</th>
                      <th className="px-4 py-2 border">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyPlanData.plan.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2 border font-semibold">{item.topic}</td>
                        <td className="px-4 py-2 border">
                          {item.review_dates.map((date, i) => (
                            <span key={i} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs mr-1 mb-1">{date}</span>
                          ))}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loadingStudyPlan && !errorStudyPlan && (!studyPlanData || studyPlanData.plan.length === 0) && (
              <div className="text-gray-500 text-center py-8">Nenhum plano de estudos gerado ainda.</div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'studyguidepdf' && (
        <StudyGuideTab transcription={transcription} />
      )}
    </section>
  );
};

export default ResultSection;