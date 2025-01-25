import { NextResponse } from "next/server";
import { getXataClient } from "@/lib/xata";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const econ = parseFloat(searchParams.get('econ') || '0'); 
  const dipl = parseFloat(searchParams.get('dipl') || '0'); 
  const govt = parseFloat(searchParams.get('govt') || '0'); 
  const scty = parseFloat(searchParams.get('scty') || '0'); 

  try {
    const xata = getXataClient();

    // Fetch insights based on the results
    const insights = await xata.db.Insights.filter({
      $any: [
        { lower_limit: { $le: econ }, upper_limit: { $ge: econ } },
        { lower_limit: { $le: dipl }, upper_limit: { $ge: dipl } },
        { lower_limit: { $le: govt }, upper_limit: { $ge: govt } },
        { lower_limit: { $le: scty }, upper_limit: { $ge: scty } },
      ],
    }).getMany();

    if (!insights.length) {
      return NextResponse.json(
        { error: "No insights found for these results" },
        { status: 404 }
      );
    }

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}