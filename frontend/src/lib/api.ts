import { getXataClient } from "@/lib/xata";

export const saveProgress = async (
  testId: number,
  answeredQuestions: number,
  status: "not_started" | "in_progress" | "completed",
  currentQuestionId?: number, 
) => {
  const xata = getXataClient();

  try {
    // Fetch the test record by its ID
    const testRecord = await xata.db.Tests
      .filter({ test_id: testId })
      .getFirst();

    if (!testRecord) {
      throw new Error(`Test with ID ${testId} not found`);
    }

    // Replace "current_user_id" with the actual user ID from your authentication system
    const userId = "current_user_id"; // Replace with actual user ID

    // Fetch the user record by its ID
    const userRecord = await xata.db.Users
      .filter({ user_uuid: userId })
      .getFirst();

    if (!userRecord) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Create or update the UserTestProgress record
    await xata.db.UserTestProgress.createOrUpdate({
      test: { id: testRecord.id }, // Link to the test record
      user: { id: userRecord.id }, // Link to the user record
      answers: {}, // Add actual answers if needed
      answeredQuestions,
      status,
      current_question: currentQuestionId ? { id: currentQuestionId } : null, // Link to the current question
    });

    console.log("Progress saved successfully!");
  } catch (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
};