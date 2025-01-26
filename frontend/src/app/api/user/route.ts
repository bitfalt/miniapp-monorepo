import { getXataClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

/**
 * Type definition for user update data
 * Contains all required fields for user profile creation/update
 */
type UserUpdateData = {
  age: number;
  name: string;
  country: string;
  email: string;
  last_name: string;
  username: string;
  wallet_address: string;
};

/**
 * Validation functions for user data
 */
const validateAge = (age: number): boolean => age >= 18 && age <= 120;

const validateString = (str: string, minLength = 2, maxLength = 50): boolean =>
  str.length >= minLength && str.length <= maxLength;

const validateUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_-]{3,30}$/.test(username);

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateWalletAddress = (address: string): boolean =>
  /^0x[a-fA-F0-9]{40}$/.test(address);

// Function to generate UUID using Web Crypto API
const generateUUID = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Function to create hash using Web Crypto API
async function createHash(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get user profile information
 *     description: Retrieves the current user's profile data including username, subscription status, and verification status
 *     tags:
 *       - User
 *     security:
 *       - NextAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 subscription:
 *                   type: boolean
 *                   example: false
 *                 verified:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const xata = getXataClient();
    const user = await xata.db.Users.filter({ email: userEmail }).getFirst();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: user.username,
      subscription: user.subscription,
      verified: user.verified
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create user profile
 *     description: Creates a new user profile with provided data
 *     tags:
 *       - User
 *     security:
 *       - NextAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateData'
 *     responses:
 *       200:
 *         description: User profile created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as UserUpdateData;
    const xata = getXataClient();

    // Check if user already exists
    const existingUser = await xata.db.Users.filter({
      $any: [
        { email: body.email },
        { wallet_address: body.wallet_address }
      ]
    }).getFirst();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Validate all input data
    if (!validateAge(body.age)) {
      return NextResponse.json(
        { error: "Invalid age. Must be between 18 and 120." },
        { status: 400 }
      );
    }

    if (!validateString(body.name) || !validateString(body.last_name)) {
      return NextResponse.json(
        { error: "Invalid name or last name. Must be between 2 and 50 characters." },
        { status: 400 }
      );
    }

    if (!validateUsername(body.username)) {
      return NextResponse.json(
        { error: "Invalid username. Must be 3-30 characters and contain only letters, numbers, underscores, and hyphens." },
        { status: 400 }
      );
    }

    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Get the latest user_id
    const latestUser = await xata.db.Users.sort('user_id', 'desc').getFirst();
    const nextUserId = (latestUser?.user_id || 0) + 1;
    
    // Generate user_uuid using Web Crypto API
    const userUuid = body.wallet_address 
      ? await createHash(body.wallet_address)
      : generateUUID();

    // Validate and get country record
    const country = await xata.db.Countries.filter({ country_name: body.country }).getFirst();
    if (!country) {
      return NextResponse.json(
        { error: "Invalid country name provided" },
        { status: 400 }
      );
    }

    // Create new user
    await xata.db.Users.create({
      ...body,
      country: country.xata_id,
      user_id: nextUserId,
      user_uuid: userUuid,
      created_at: new Date(),
      updated_at: new Date(),
      subscription: false,
      verified: false,
    });

    return NextResponse.json(
      { message: "User profile created successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
} 
