import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAccessibleRepositories } from "../../../../lib/github/repository";
import { getAccessTokenFromCookie } from "../../../../utils/functions";

// GET handler with pagination support
export async function GET()  {
  try {
    const accessToken =  await getAccessTokenFromCookie()
    const repos = await getAccessibleRepositories(accessToken);
    return NextResponse.json({ repos }, {status: 200})
  } catch (error) {
   
    console.error('Error in repositories route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


