"use client";

import { useState, useEffect } from "react";
import { FilledButton } from "@/components/ui/FilledButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useRouter } from "next/navigation";
import { Question } from "@/app/types";
import { TestResult } from "@/app/types";

const answers = [
  { label: "Strongly Agree", multiplier: 1.0 },
  { label: "Agree", multiplier: 0.5 },
  { label: "Neutral", multiplier: 0.0 },
  { label: "Disagree", multiplier: -0.5 },
  { label: "Strongly Disagree", multiplier: -1.0 },
];

export default function IdeologyTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scores, setScores] = useState({ econ: 0, dipl: 0, govt: 0, scty: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  useEffect(() => {
    console.log("Fetching questions...");
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions/ideology-test`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        console.log("Questions fetched:", data.questions);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

      const results: TestResult = {
        econ: econScore,
        dipl: diplScore,
        govt: govtScore,
        scty: sctyScore,
      };

      // Redirect to insights page with results
      router.push(`/insights?econ=${results.econ}&dipl=${results.dipl}&govt=${results.govt}&scty=${results.scty}`);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  if (loading) return <div className="text-white text-center">Loading questions...</div>;
  if (error) return <div className="text-white text-center">Error: {error}</div>;
  if (questions.length === 0) return <div className="text-white text-center">No questions found.</div>;

  return (
    <div className="min-h-screen bg-brand-tertiary px-4 py-14 flex flex-col items-center">
      <div className="w-full max-w-md">
        <FilledButton
          variant="default"
          size="sm"
          className="mb-8"
          onClick={() => router.push("/tests")}
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
          {answers.map((answer, index) => (
            <FilledButton
              key={index}
              variant="secondary"
              size="lg"
              className="w-full bg-[#387478] hover:bg-[#387478]/90 rounded-[30px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-white text-base font-bold font-spaceGrotesk"
              onClick={() => handleAnswer(answer.multiplier)}
            >
              {answer.label}
            </FilledButton>
          ))}
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