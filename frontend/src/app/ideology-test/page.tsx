"use client";

import { useState, useEffect } from "react";
import { FilledButton } from "@/components/ui/FilledButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useRouter, useSearchParams } from "next/navigation";
import { Question } from "@/app/types";
import { TestResult } from "@/app/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const answerOptions = [
  { label: "Strongly Agree", multiplier: 1.0 },
  { label: "Agree", multiplier: 0.5 },
  { label: "Neutral", multiplier: 0.0 },
  { label: "Disagree", multiplier: -0.5 },
  { label: "Strongly Disagree", multiplier: -1.0 },
];

export default function IdeologyTest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId') || '1';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scores, setScores] = useState({ econ: 0, dipl: 0, govt: 0, scty: 0 });
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    const loadProgress = async (loadedQuestions: Question[]) => {
      try {
        const response = await fetch(`/api/tests/${testId}/progress`);
        if (response.ok) {
          const data = await response.json();
          if (data.answers && Object.keys(data.answers).length > 0) {
            const lastAnsweredId = Object.keys(data.answers).pop();
            const lastAnsweredIndex = loadedQuestions.findIndex(q => q.id.toString() === lastAnsweredId);
            const nextQuestionIndex = Math.min(lastAnsweredIndex + 1, loadedQuestions.length - 1);
            setCurrentQuestion(nextQuestionIndex);
            setScores(data.scores || { econ: 0, dipl: 0, govt: 0, scty: 0 });
            setUserAnswers(data.answers);
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/tests/${testId}/questions`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data.questions);
        await loadProgress(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  const handleAnswer = async (multiplier: number) => {
    if (questions.length === 0) return;

    const question = questions[currentQuestion];
    const updatedScores = {
      econ: scores.econ + multiplier * question.effect.econ,
      dipl: scores.dipl + multiplier * question.effect.dipl,
      govt: scores.govt + multiplier * question.effect.govt,
      scty: scores.scty + multiplier * question.effect.scty,
    };
    setScores(updatedScores);

    // Save progress to database
    try {
      const response = await fetch(`/api/tests/${testId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
          answer: multiplier,
          currentQuestion: question.id,
          scores: updatedScores
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

      // Update local state after successful save
      setUserAnswers(prev => ({
        ...prev,
        [question.id]: multiplier
      }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const maxEcon = questions.reduce((sum, q) => sum + Math.abs(q.effect.econ), 0);
      const maxDipl = questions.reduce((sum, q) => sum + Math.abs(q.effect.dipl), 0);
      const maxGovt = questions.reduce((sum, q) => sum + Math.abs(q.effect.govt), 0);
      const maxScty = questions.reduce((sum, q) => sum + Math.abs(q.effect.scty), 0);

      const econScore = ((updatedScores.econ + maxEcon) / (2 * maxEcon)) * 100;
      const diplScore = ((updatedScores.dipl + maxDipl) / (2 * maxDipl)) * 100;
      const govtScore = ((updatedScores.govt + maxGovt) / (2 * maxGovt)) * 100;
      const sctyScore = ((updatedScores.scty + maxScty) / (2 * maxScty)) * 100;

      // Save final results
      await fetch(`/api/tests/${testId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scores: {
            economic: econScore,
            diplomatic: diplScore,
            civil: govtScore,
            societal: sctyScore
          }
        })
      });

      // Navigate to results page
      router.push('/results');
    }
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

  const handleNext = async () => {
    if (currentQuestion < totalQuestions - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      
      try {
        await fetch(`/api/tests/${testId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentQuestion: questions[nextQuestion].id,
            scores
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handlePrevious = async () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      
      try {
        await fetch(`/api/tests/${testId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentQuestion: questions[prevQuestion].id,
            scores
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleLeaveTest = async () => {
    try {
      // Save current progress before leaving
      await fetch(`/api/tests/${testId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentQuestion: questions[currentQuestion].id,
          scores
        })
      });
      
      // Navigate to test selection page
      router.push('/test-selection');
    } catch (error) {
      console.error('Error saving progress:', error);
      // Navigate anyway even if save fails
      router.push('/test-selection');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-white text-center">Error: {error}</div>;
  if (!questions || questions.length === 0 || currentQuestion >= questions.length) {
    return <div className="text-white text-center">No questions found.</div>;
  }

  return (
    <div className="min-h-screen bg-brand-tertiary px-4 py-14 flex flex-col items-center">
      <div className="w-full max-w-md">
        <FilledButton
          variant="default"
          size="sm"
          className="mb-8"
          onClick={handleLeaveTest}
        >
          Leave Test
        </FilledButton>

        <h1 className="text-center text-white text-3xl font-bold font-spaceGrotesk mb-6">
          Question {currentQuestion + 1} of {totalQuestions}
        </h1>

        <div className="flex justify-center mb-8">
          <ProgressBar progress={progress} variant="warning" />
        </div>

        <div className="text-center text-white text-2xl font-bold font-spaceGrotesk mb-10">
          {questions[currentQuestion].question}
        </div>

        <div className="space-y-4 mb-12">
          {answerOptions.map((answer, index) => {
            const isSelected = userAnswers[questions[currentQuestion].id] === answer.multiplier;
            return (
              <FilledButton
                key={index}
                variant="secondary"
                size="lg"
                className={`w-full ${
                  isSelected 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-[#387478] hover:bg-[#387478]/90'
                } rounded-[30px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-white text-base font-bold font-spaceGrotesk`}
                onClick={() => handleAnswer(answer.multiplier)}
              >
                {answer.label}
              </FilledButton>
            );
          })}
        </div>

        <div className="flex justify-between">
          {currentQuestion > 0 && (
            <FilledButton
              variant="default"
              size="sm"
              onClick={handlePrevious}
            >
              Previous
            </FilledButton>
          )}

          {currentQuestion === 0 && <div className="flex-1" />}

          <FilledButton
            variant="default"
            size="sm"
            onClick={handleNext}
            disabled={currentQuestion === totalQuestions - 1}
          >
            Next
          </FilledButton>
        </div>
      </div>
    </div>
  );
}