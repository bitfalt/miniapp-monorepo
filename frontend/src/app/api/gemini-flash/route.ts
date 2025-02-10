import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface IdeologyScores {
  econ: number;
  dipl: number;
  govt: number;
  scty: number;
}

interface GeminiResponseCandidate {
  output: {
    text: string;
  };
}

interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
}

interface ApiResponse {
  analysis?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const scores = body as IdeologyScores;
    const { econ, dipl, govt, scty } = scores;

    if (econ === undefined || dipl === undefined || govt === undefined || scty === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate that each score is a number between 0 and 100
    for (const [key, value] of Object.entries(scores)) {
      const score = Number(value);
      if (Number.isNaN(score) || score < 0 || score > 100) {
        return NextResponse.json(
          { error: `Invalid ${key} score. Must be a number between 0 and 100` },
          { status: 400 }
        );
      }
    }

    // Construct the new prompt with your updated template
    const prompt = `[ROLE]
Act as a senior political scientist specializing in ideological analysis. Write in a direct, dynamic, and encouraging tone, addressing the user as “you” and “your.” Demonstrate advanced knowledge of political ideologies and offer practical, real-world context. Encourage introspection and growth by highlighting key tensions, policy implications, and potential personal dilemmas.
[INPUT]
Economic: ${econ} | Diplomatic: ${dipl} | Government: ${govt} | Social: ${scty} (All 0-100)
[STRUCTURE]
Return your analysis in EXACTLY 5 sections with these headers:
Your Ideological Breakdown
Your Closest Ideological Matches
Your Likely Policy Preferences
Your Key Philosophical Tensions
Your Growth Opportunities
[REQUIREMENTS]
Breakdown
Begin each axis analysis with “Your [Axis] score of [X] suggests…”
Provide a concise descriptor (for example, “regulated capitalism with a welfare focus”).
Offer a real-world analogy (such as, “similar to Sweden's mixed-market approach”).
Give a brief explanation of how this orientation might shape your worldview.
Matches
Compare the user to 2–3 real-world political movements/parties.
Use percentage alignments only for broad ideological frameworks.
Highlight at least one area of divergence from each movement/party.
Preferences
Introduce policies with “You would likely support…”
Provide a concrete policy example (for instance, “universal childcare systems like Canada’s 2023 Bill C-35”).
Briefly explain the connection between the user’s scores and the policy stance.
Tensions
Present contradictions as reflective questions, framed as real-world challenges.
Provide at least one historical or contemporary example illustrating how a similar tension has unfolded.
Growth
Recommend one academic resource that aligns with the user’s scores.
Suggest one practical action step (for example, joining a local advocacy group).
Offer one reflective exercise (for example, writing a short essay that balances global cooperation with local autonomy).
[CONSTRAINTS]
Aim for approximately 600 words (±50).
Use AP style.
Do not use markdown formatting.
Avoid passive voice.
Explain technical terms in parentheses, for example, “multilateralism (global cooperation).”
Conclude with exactly 2 open-ended reflection questions for the user.
Begin the response immediately with the header “1. Your Ideological Breakdown”`;

    // Prepare Gemini API URL and payload
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set in environment");
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Gemini expects the prompt in a "contents" array with "parts"
    const payload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    // Make the POST request to the Gemini API
    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    // Parse the response and extract the text from the first candidate
    const data = (await geminiResponse.json()) as GeminiResponse;
    const analysis =
      data.candidates && data.candidates.length > 0
        ? data.candidates[0].output.text
        : "";

    const response: ApiResponse = { analysis };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Gemini API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const response: ApiResponse = { error: message };
    return NextResponse.json(response, { status: 500 });
  }
}
