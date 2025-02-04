import { getXataClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface UserScores {
  dipl: number;
  econ: number;
  govt: number;
  scty: number;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Calculate the similarity between user scores and ideology scores
 * Lower score means more similar
 */
function calculateSimilarity(userScores: UserScores, ideologyScores: UserScores): number {
  const diff = {
    dipl: Math.abs(userScores.dipl - ideologyScores.dipl),
    econ: Math.abs(userScores.econ - ideologyScores.econ),
    govt: Math.abs(userScores.govt - ideologyScores.govt),
    scty: Math.abs(userScores.scty - ideologyScores.scty)
  };

  // Return average difference (lower is better)
  return (diff.dipl + diff.econ + diff.govt + diff.scty) / 4;
}

/**
 * @swagger
 * /api/ideology:
 *   post:
 *     summary: Calculate user's ideology based on scores
 *     description: Matches user's scores with closest ideology and updates IdeologyPerUser table
 *     tags:
 *       - Ideology
 *     security:
 *       - SessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dipl
 *               - econ
 *               - govt
 *               - scty
 *             properties:
 *               dipl:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               econ:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               govt:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               scty:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Successfully matched and saved ideology
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ideology:
 *                   type: string
 *                   example: "Social Democracy"
 *                 similarity:
 *                   type: number
 *                   example: 85.5
 *       400:
 *         description: Invalid scores provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const xata = getXataClient();
    let user;

    // Get token from cookies
    const token = cookies().get('session')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.address) {
        user = await xata.db.Users.filter({ 
          wallet_address: payload.address 
        }).getFirst();
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user scores from request body
    const userScores = await request.json() as UserScores;

    // Validate scores
    const scores = [userScores.dipl, userScores.econ, userScores.govt, userScores.scty];
    if (scores.some(score => score < 0 || score > 100 || !Number.isFinite(score))) {
      return NextResponse.json(
        { error: "Invalid scores. All scores must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Get all ideologies
    const ideologies = await xata.db.Ideologies.getAll();
    
    if (!ideologies.length) {
      return NextResponse.json(
        { error: "No ideologies found in database" },
        { status: 404 }
      );
    }

    // Find best matching ideology
    let bestMatch = ideologies[0];
    let bestSimilarity = calculateSimilarity(userScores, ideologies[0].scores as UserScores);

    for (const ideology of ideologies) {
      const similarity = calculateSimilarity(userScores, ideology.scores as UserScores);
      if (similarity < bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = ideology;
      }
    }

    // Get latest ideology_user_id
    const latestIdeology = await xata.db.IdeologyPerUser
      .sort("ideology_user_id", "desc")
      .getFirst();
    const nextIdeologyId = (latestIdeology?.ideology_user_id || 0) + 1;

    // Update or create IdeologyPerUser record
    await xata.db.IdeologyPerUser.create({
      user: user.xata_id,
      ideology: bestMatch.xata_id,
      ideology_user_id: nextIdeologyId
    });

    return NextResponse.json({
      ideology: bestMatch.name
    });

  } catch (error) {
    console.error("Error calculating ideology:", error);
    return NextResponse.json(
      { error: "Failed to calculate ideology" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/ideology:
 *   get:
 *     summary: Get user's ideology
 *     description: Retrieves the user's current ideology from their latest test results
 *     tags:
 *       - Ideology
 *     security:
 *       - SessionCookie: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's ideology
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ideology:
 *                   type: string
 *                   example: "Social Democracy"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or ideology not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const xata = getXataClient();
    let user;

    // Get token from cookies
    const token = cookies().get('session')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.address) {
        user = await xata.db.Users.filter({ 
          wallet_address: payload.address 
        }).getFirst();
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's latest ideology from IdeologyPerUser
    const userIdeology = await xata.db.IdeologyPerUser
      .filter({
        "user.xata_id": user.xata_id
      })
      .sort("ideology_user_id", "desc")
      .select(["ideology.name"])
      .getFirst();

    if (!userIdeology || !userIdeology.ideology?.name) {
      return NextResponse.json(
        { error: "No ideology found for user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ideology: userIdeology.ideology.name
    });

  } catch (error) {
    console.error("Error fetching ideology:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideology" },
      { status: 500 }
    );
  }
}
