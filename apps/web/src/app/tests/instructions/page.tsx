"use client";

import { FilledButton } from "@/components/ui/buttons";
import { LoadingSpinner } from "@/components/ui/feedback";
import { Card } from "@/components/ui/base";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, FileQuestion } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TestInstructions {
  description: string;
  total_questions: number;
}

export default function TestInstructions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId") || "1"; // Fallback to 1 for now

  const [loading, setLoading] = useState(true);
  const [instructions, setInstructions] = useState<TestInstructions>({
    description: "",
    total_questions: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const estimatedTime = Math.ceil(instructions.total_questions * 0.15); // Roughly 9 seconds per question

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructionsResponse = await fetch(
          `/api/tests/${testId}/instructions`,
        );
        const instructionsData = await instructionsResponse.json();

        const progressResponse = await fetch(`/api/tests/${testId}/progress`);
        const progressData = await progressResponse.json();

        setInstructions({
          description: instructionsData.description,
          total_questions: instructionsData.total_questions,
        });

        if (progressData.answers) {
          const answeredCount = Object.keys(progressData.answers).length;
          setCurrentQuestion(answeredCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [testId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const progress = (currentQuestion / instructions.total_questions) * 100;

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#387478] to-[#2C5154]">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full w-full items-start justify-center p-4 pt-12 sm:p-6 md:p-8">
          <div className="relative mx-auto w-full max-w-[421px]">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-2"
            >
              <FilledButton
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-[#E36C59] to-[#E36C59]/90 hover:bg-accent/90"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="sr-only">Back</span>
              </FilledButton>
            </motion.div>

            <motion.div
              className="mt-12 space-y-6 sm:mt-14 sm:space-y-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-4 text-center">
                <Brain className="mx-auto h-12 w-12 text-[#E36C59]" />
                <h1 className="px-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Uncover Your Political Values
                </h1>
              </div>

              <Card className="mx-4 space-y-3 border-white/20 bg-white/10 p-5 backdrop-blur-md sm:p-6 sm:space-y-4">
                <h2 className="text-center text-lg font-semibold text-white sm:text-xl">
                  Before you start
                </h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileQuestion className="mt-1 h-5 w-5 flex-shrink-0 text-[#E36C59]" />
                    <p className="text-sm text-white/90">
                      This test consists of {instructions.total_questions}{" "}
                      thought-provoking statements designed to explore your
                      political beliefs. Your answers will reflect your position
                      across eight core values.
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-2 sm:p-3">
                    <p className="text-center text-sm font-medium text-white/90">
                      Please respond honestly, based on your true opinions.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/90 sm:text-sm">
                      Estimated Time:{" "}
                      <span className="font-semibold text-white">
                        {estimatedTime} min
                      </span>
                    </p>
                    <p className="text-xs text-white/90 sm:text-sm">
                      Progress:{" "}
                      <span className="font-semibold text-white">
                        {currentQuestion}/{instructions.total_questions}
                      </span>
                    </p>
                  </div>
                </div>

                {currentQuestion > 0 && (
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full bg-[#E36C59]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </Card>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-center px-4"
              >
                <FilledButton
                  variant="primary"
                  size="lg"
                  className="relative w-full overflow-hidden bg-gradient-to-r from-[#E36C59] to-[#E36C59]/90 px-8 hover:from-[#E36C59]/90 hover:to-[#E36C59] sm:w-auto"
                  onClick={() => {
                    void router.push(`/ideology-test?testId=${testId}`);
                  }}
                >
                  <span className="relative z-10">
                    {currentQuestion > 0 ? "Continue test" : "Start test"}
                  </span>
                </FilledButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#387478]/20 blur-3xl" />
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-[#2C5154]/40 blur-3xl" />
    </div>
  );
}
