import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db";
import { DatabaseError } from "pg";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const { searchEntry } = await request.json();

    const safeSearchEntry = searchEntry.trim().split(" ")[0];

    if (!searchEntry) {
      return NextResponse.json(
        { error: "Search entry is required" },
        { status: 400 }
      );
    }

    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.id;

    try {
      const response = await query(
        `SELECT 
      ts_headline('english', messages.content, to_tsquery($2), 'MaxFragments=1, MinWords=4, MaxWords=8, ShortWord=1, FragmentDelimiter="..."') AS snippet,
      chat_id, 
      chats.title AS chat_title
      FROM messages
      JOIN chats ON chats.id = messages.chat_id 
      WHERE messages.user_id = $1 
      AND to_tsvector('english', messages.content) @@ to_tsquery($2);`,
        [userId, safeSearchEntry]
      );

      if (!response || response.rowCount === 0) {
        return NextResponse.json(
          { error: "No matching messages found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { searchResult: response.rows },
        { status: 200 }
      );
    } catch (dbError) {
      if (dbError instanceof DatabaseError) {
        console.error("Database error:", dbError);

        const errorMessage =
          dbError.code === "ETIMEDOUT"
            ? "Database connection timed out"
            : "Failed to query the database";

        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }

      throw dbError;
    }
  } catch (error: unknown) {
    console.error("Unexpected server error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
