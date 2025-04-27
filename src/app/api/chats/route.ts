import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DatabaseError } from "pg";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import predictTitle from "@/lib/predictTitle";

export async function POST(request: Request) {
  try {
    const { firstMessage } = await request.json();
    const cookieStore = await cookies();

    if (!firstMessage) {
      return NextResponse.json(
        { error: "Where is first message from user?" },
        { status: 400 }
      );
    }
    //get user id from jwt token
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    const id = payload.id;

    // predict a title for the chat.
    const title = await predictTitle(firstMessage);
    if (!title) {
      return NextResponse.json(
        { error: "Failed to predict title" },
        { status: 500 }
      );
    }

    try {
      const insertChat = await query(
        "INSERT INTO chats(user_id, title) VALUES($1, $2) RETURNING *",
        [id, title]
      );
      const chatId = insertChat.rows[0].id;

      if (!insertChat || insertChat.rowCount === 0) {
        return NextResponse.json(
          { error: "Failed to add to archive chat" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Chat saved", chat_id: chatId },
        { status: 201 }
      );
    } catch (dbError) {
      if (dbError instanceof DatabaseError) {
        console.error("Database error:", dbError);
        if (dbError.code === "ETIMEDOUT") {
          return NextResponse.json(
            { error: "Database connection timed out" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { error: "Failed to query user from database" },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Unexpected server error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
